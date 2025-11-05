import React, { useEffect, useMemo, useState } from "react";

import { NexButton, NexDiv, NexLabel } from "component/base/NexBaseComponents";
import { NexFeatureType, NexNodeType } from "type/NexNode";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { adminNodeDefs, getAdminNodeFromFeatures } from "./adminDataFormat";
import {
  MdAdd,
  MdArrowDownward,
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowLeft,
  MdArrowRight,
  MdCancel,
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdRemove,
} from "react-icons/md";
import { defaultThemeStyle, NexThemeStyle } from "type/NexTheme";
import { clamp } from "utils/util";
import { set } from "mobx";

// 향후 Theme 등에 적용 고려
// 좁은 화면 세로 1열 편집 시
const gridNarrowSpacing = 1;
const gridNarrowColumns = 2;

// 중간 화면 세포 편집 시 (팝업 등)
const gridMidSpacing = 3;
const gridMidColumns = 6;

// 큰화면 가로 편집 시
const gridWideSpacing = 4;
const gridWideColumns = 12;

export interface LiteralItem {
  name: string;
  dispName: string;
  icon: string | null;
  color: string | null;
}

// ===== Helpers =====
function toLiteralTuple(item: LiteralItem): [string, string] {
  if (typeof item !== "object") {
    console.warn(
      `# LabeledSelect: toLiteralTuple: invalid item : ${JSON.stringify(item, null, 2)}`
    );
  }
  const name = String((item as LiteralItem).name);
  const dispName = (item as LiteralItem).dispName ?? name;
  return [name, dispName];
}

function setDeep(obj: any, path: string[], value: any) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[path[path.length - 1]] = value;
}

function getAtPath(obj: any, path: string[]) {
  return path.reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function isNumber(featureType: NexFeatureType) {
  if (
    featureType === NexFeatureType.UINT8 ||
    featureType === NexFeatureType.UINT16 ||
    featureType === NexFeatureType.UINT32 ||
    featureType === NexFeatureType.UINT64 ||
    featureType === NexFeatureType.INT8 ||
    featureType === NexFeatureType.INT16 ||
    featureType === NexFeatureType.INT32 ||
    featureType === NexFeatureType.INT64 ||
    featureType === NexFeatureType.FLOAT ||
    featureType === NexFeatureType.DOUBLE
  )
    return true;
  return false;
}

function asFeatureValue(value: string, featureType: NexFeatureType) {
  if (featureType === NexFeatureType.STRING) return value;
  if (featureType === NexFeatureType.BOOLEAN) return value === "true";
  if (isNumber(featureType)) {
    if (value === "" || value == null) return "";
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : "";
  }
  return value;
}

// ===== UI atoms =====

interface SelectProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  literals: LiteralItem[]; // [value, label]
}

const LabeledSelect: React.FC<SelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  literals,
}) => {
  const fontSize = "1rem";

  if (literals.length === 0) {
    console.warn(
      `# LabeledSelect: no valid literals : label=${label}, value=${value}, opts=${JSON.stringify(literals, null, 2)}`
    );
    return null;
  }

  const isValid = literals.some((litObj) => litObj.name === value);

  if (!isValid) {
    console.warn(
      `# LabeledSelect: invalid value : label=${label}, value=${value}, opts=${JSON.stringify(literals, null, 2)}`
    );
    onChange(literals[0].name);
  }

  return (
    <FormControl title={placeholder} variant='standard' sx={{ width: "100%" }}>
      <Select
        value={value}
        onChange={(e: any) => {
          console.log(`LabeledSelect: onChange : ${e.target.value}`);
          onChange(e.target.value);
        }}
        label={label}
        style={{ width: "100%" }}
      >
        {literals.map((litObj, index) => (
          <MenuItem key={index} value={litObj.name}>
            {litObj.dispName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Records editor (list of strings OR structured rows)
interface RecordsEditorProps {
  id: string;
  label: string;
  placeholder?: string;
  rows: any[];
  setRows: (rows: any[]) => void;
  recordFields?: any[]; // if provided, render object rows with these fields
}

const RecordsEditor: React.FC<RecordsEditorProps> = ({
  id,
  label,
  placeholder,
  rows,
  setRows,
  recordFields,
}) => {
  const addRow = (index: number) => {
    if (recordFields && recordFields.length > 0) {
      const base: any = {};
      for (const f of recordFields) {
        if ((f as any).featureType === NexFeatureType.ATTRIBUTES) {
          base[f.name] = getAdminNodeFromFeatures((f as any).attributes);
        } else if ((f as any).featureType === NexFeatureType.RECORDS) {
          base[f.name] = "";
        } else if ((f as any).featureType === NexFeatureType.LITERALS) {
          base[f.name] = "";
        } else {
          base[f.name] = "";
        }
      }
      setRows([...(rows || []), base]);
    } else {
      setRows([...(rows || []), ""]);
    }
    console.log("# RecordsEditor: addRow", {
      id,
      label,
      rows: JSON.stringify(rows),
    });
  };

  const removeRow = (idx: number) => {
    const next = [...rows];
    next.splice(idx, 1);
    setRows(next);
  };

  const upRow = (idx: number) => {
    if (idx <= 0) return;
    const next = [...rows];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setRows(next);
  };

  const downRow = (idx: number) => {
    if (idx >= rows.length - 1) return;
    const next = [...rows];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setRows(next);
  };

  return (
    <NexDiv width='100%' direction='column'>
      <Typography variant='subtitle2' sx={{ fontWeight: "bold", md: 1 }}>
        {label}
      </Typography>
      {recordFields && (
        <Stack spacing={1.5} width='100%' direction='column' sx={{ p: 1 }}>
          {rows.map((row: any, rIdx: number) => (
            <NexDiv align='center' width='100%' direction='row'>
              <Box
                key={rIdx}
                sx={{
                  flex: 11,
                  borderRadius: 1.5,
                  borderLeft: "1px solid gray",
                  borderRight: "1px solid gray",
                  padding: 1,
                  "&:hover": {
                    borderLeft: "3px solid #58a4ff",
                    borderRight: "3px solid #58a4ff",
                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Grid
                  container
                  rowSpacing={1.2}
                  columnSpacing={gridMidSpacing}
                  columns={gridMidColumns}
                  alignItems='flex-end'
                >
                  {recordFields.map((f, i) => {
                    const size = (f as any).uxSize || 6;
                    return (
                      <Grid item key={i} xs={size}>
                        {f.featureType === NexFeatureType.LITERALS ? (
                          <LabeledSelect
                            label={f.dispName || f.name}
                            value={row[f.name] ?? ""}
                            literals={f.literals || []}
                            onChange={(value) => {
                              const next = [...rows];
                              next[rIdx] = {
                                ...next[rIdx],
                                [f.name]: value,
                              };
                              setRows(next);
                            }}
                          />
                        ) : (
                          <TextField
                            label={f.dispName || f.name}
                            variant='standard'
                            value={row[f.name] ?? ""}
                            style={{ width: "100%" }}
                            onChange={(e) => {
                              const next = [...rows];
                              next[rIdx] = {
                                ...next[rIdx],
                                [f.name]: e.target.value,
                              };
                              setRows(next);
                            }}
                          />
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
              <NexDiv
                flex='1'
                width='100%'
                height='100%'
                align='center'
                justify='center'
                direction='column'
              >
                <Stack spacing={1} direction='column' alignItems='center'>
                  <Stack spacing={0.5} direction='row' alignItems='center'>
                    <IconButton
                      title='삽입'
                      onClick={() => addRow(rIdx)}
                      size='small'
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowLeft fontSize='large' />
                    </IconButton>
                    <IconButton
                      title='삭제'
                      onClick={() => removeRow(rIdx)}
                      size='small'
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowRight fontSize='large' />
                    </IconButton>
                  </Stack>
                  <Stack spacing={0.5} direction='row' alignItems='center'>
                    <IconButton
                      title='위로 이동'
                      onClick={() => upRow(rIdx)}
                      size='small'
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowDropUp fontSize='large' />
                    </IconButton>
                    <IconButton
                      title='아래로 이동'
                      onClick={() => downRow(rIdx)}
                      size='small'
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowDropDown fontSize='large' />
                    </IconButton>
                  </Stack>
                </Stack>
              </NexDiv>
            </NexDiv>
          ))}
          <NexDiv width='100%' direction='row'>
            <NexDiv flex='11'>
              <Button
                title='추가'
                variant='outlined'
                onClick={() => addRow(-1)}
                size='small'
                startIcon={<MdAdd />}
                sx={{ width: "100%", border: "1px solid gray" }}
              >
                추가
              </Button>
            </NexDiv>
            <NexDiv flex='1' />
          </NexDiv>
        </Stack>
      )}
    </NexDiv>
  );
};

// ===== Main component =====
export interface AdminNodeEditorProps {
  data: any; // node for input
  fontLevel?: number; // 1~10
  style?: NexThemeStyle;
  //initialValue?: any;              // if omitted, the form will initialize from the schema
  onChange?: (data: any) => void; // emit current JSON on every edit
  //onSubmit: (value: any) => void; // submit handler
  submitText?: string;

  mode: "add" | "edit"; // add, update, delete
  onApply(data: any): void;
  onCancel?(): void;
}

const AdminNodeEditor: React.FC<AdminNodeEditorProps> = (props) => {
  const {
    mode,
    data,
    fontLevel = 5,
    style = defaultThemeStyle,
    // onSetValue,
    onApply,
    onCancel,
    onChange,
    //onSubmit,
    // submitText = "저장",
  } = props;

  const [index, setIndex] = useState<any>(null);
  const [path, setPath] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [system, setSystem] = useState<string>("");
  const [orderIndex, setOrderIndex] = useState<number>(-1);

  const [node, setNode] = useState<any>(null);

  const [format, setFormat] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [parentPath, setParentPath] = useState<string>("");
  const [editingPath, setEditingPath] = useState<string>("");

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    //console.log("# AdminNodeEditor: data=", JSON.stringify(data, null, 2));
    const nodePath = data[1];

    // original node setting
    setIndex(data[0]);
    setPath(nodePath);
    setProject(data[2]);
    setSystem(data[3]);

    const nodeObject: any = Object.values(data[4])[0];
    // Object.keys(data[4])[0] => order of Node Objects

    const tformat = nodeObject
      ? adminNodeDefs[nodeObject.type as NexNodeType]
      : null;
    const tfeatures = tformat?.features || [];

    // Merge the node with the template format
    const tNode = getAdminNodeFromFeatures(tfeatures);
    const next = { ...tNode, ...nodeObject };

    setOrderIndex(
      Object.keys(data[4])[0] ? parseInt(Object.keys(data[4])[0]) : -1
    );

    setNode(next);

    // set editing state
    setEditingNode(next);
    //console.log("# AdminNodeEditor: format=", JSON.stringify(tformat, null, 2));
    setFormat(tformat);
    setFeatures(tfeatures);
    setEditingPath(nodePath);
    setParentPath(`${nodePath.substring(0, nodePath.lastIndexOf("/"))}`);
  }, [data]);

  const fontSize =
    style.fontSize[clamp(fontLevel - 1, 0, style.fontSize.length - 1)] ||
    "1rem";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  const handleHeaderChange = (field: string, v: any) => {
    if (field === "project") {
      setProject(v);
    } else if (field === "system") {
      setSystem(v);
    } else if (field === "orderIndex") {
      setOrderIndex(Number(v));
    }
  };

  const handleReset = () => {
    // 입력된 node 데이터와 format 에 의해 만들어진 데이터를 병합
    setEditingNode(node);
    setEditingPath(path);
    console.log("# handleReset: ", JSON.stringify(editingNode));
  };

  const handleApply = () => {
    const newData = [
      index,
      editingPath,
      project,
      system,
      { [orderIndex.toString()]: editingNode },
    ];

    onApply(newData);
  };

  const handlePrimitiveChange = (
    argPath: string[], // path within the node
    featureType: NexFeatureType,
    raw: string
  ) => {
    console.log(`# handlePrimitiveChange : ${argPath.join(".")} = ${raw}`);

    const next = { ...editingNode };
    const value = asFeatureValue(raw, featureType);
    setDeep(next, argPath, value);
    setEditingNode(next);

    let newNodePath = editingPath;
    if (argPath.join(".") === "name") {
      newNodePath = `${parentPath}/${raw}`;
    }
    setEditingPath(newNodePath);
    onChange?.([index, newNodePath, next]);
  };

  const handleLiteralChange = (argPath: string[], raw: string) => {
    console.log(`# handleLiteralChange : ${argPath.join(".")} = ${raw}`);
    const next = { ...editingNode };
    setDeep(next, argPath, raw);
    console.log(
      `# handleLiteralChange : ${argPath.join(".")} = ${JSON.stringify(next)}`
    );
    setEditingNode(next);

    onChange?.([index, editingPath, next]);
  };

  const handleRecordsChange = (argPath: string[], rows: any[]) => {
    const next = { ...editingNode };
    setDeep(next, argPath, rows);
    setEditingNode(next);

    onChange?.([index, editingPath, next]);
  };

  const toggleSubItem = (key: string) => {
    const open = !(isOpen[key] !== false);
    setIsOpen({ ...isOpen, [key]: open });
  };

  const headFields = () => {
    //console.log("# format: ", JSON.stringify(format, null, 2));
    return (
      <NexDiv width='100%' direction='column'>
        <NexLabel fontSize={fontSize} style={{ fontWeight: "bold" }}>
          {format?.dispName}
        </NexLabel>
        {/* 간격 조정 */}
        <span style={{ height: fontSize }} />
        <NexDiv width='100%'>
          <Grid
            container
            spacing={0.5}
            columnSpacing={gridMidSpacing}
            columns={12}
            width='100%'
            alignItems='flex-end'
          >
            <Grid item xs={"auto"} sm={"auto"} md={1}>
              <TextField
                size='small'
                disabled
                variant='standard'
                label={"인덱스"}
                value={String(index)}
                style={{ width: "100%" }}
                inputProps={{
                  style: { textAlign: "right" },
                }}
              />
            </Grid>

            <Grid item xs={"auto"} sm={"auto"} md={7}>
              <TextField
                disabled
                size='small'
                variant='standard'
                label={"경로"}
                value={editingPath}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={"auto"} sm={"auto"} md={4} />

            <Grid item xs={"auto"} sm={"auto"} md={4}>
              <TextField
                size='small'
                variant='standard'
                label={"프로젝트"}
                type='text'
                value={project}
                onChange={(e) => handleHeaderChange("project", e.target.value)}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={"auto"} sm={"auto"} md={4}>
              <TextField
                size='small'
                variant='standard'
                label={"시스템"}
                type='text'
                value={system}
                onChange={(e) => handleHeaderChange("system", e.target.value)}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={"auto"} sm={"auto"} md={2} />
            <Grid item xs={"auto"} sm={"auto"} md={2}>
              <TextField
                size='medium'
                variant='outlined'
                label={"순서"}
                type='number'
                value={orderIndex}
                onChange={(e) =>
                  handleHeaderChange("orderIndex", e.target.value)
                }
                style={{ width: "100%" }}
                inputProps={{
                  style: { textAlign: "right" },
                }}
              />
            </Grid>
          </Grid>
        </NexDiv>
        {/* 간격 조정 */}
        <span style={{ height: fontSize }} />
      </NexDiv>
    );
  };

  const bodyFields = () => (
    <Grid container spacing={3} width='100%' alignItems='flex-end'>
      {features &&
        features.map((f: any) => {
          const size = (f as any).uxSize || 12;
          /* console.log(
            "# bodyFields: feature =",
            f.name,
            " size=",
            JSON.stringify(f, null, 2)
          );*/
          return (
            <Grid item key={f.name} xs={"auto"} sm={"auto"} md={size}>
              {renderFeature(f)}
            </Grid>
          );
        })}
    </Grid>
  );

  const tailFields = () => (
    <Stack
      spacing={2}
      direction='row'
      width='100%'
      alignContent='end'
      alignItems='center'
      justifyContent='end'
    >
      <NexButton flex='1' bgColor='blue' onClick={handleApply}>
        {mode === "add" ? "추가" : "적용"}
      </NexButton>
      {onCancel && (
        <NexButton type='button' flex='1' bgColor='#777777' onClick={onCancel}>
          취소
        </NexButton>
      )}
      <NexButton type='button' flex='1' bgColor='#999999' onClick={handleReset}>
        초기화
      </NexButton>
    </Stack>
  );

  const iconSubItem = (key: string, label: string) => {
    return (
      <NexDiv
        direction='row'
        align='center'
        justify='space-between'
        onClick={() => toggleSubItem(key)}
        cursor='pointer'
        width='100%'
      >
        <NexLabel fontSize={fontSize}>{key}</NexLabel>
        <NexDiv align='end'>
          {isOpen[key] !== false ? (
            <MdKeyboardArrowDown />
          ) : (
            <MdKeyboardArrowRight />
          )}
        </NexDiv>
      </NexDiv>
    );
  };

  const renderFeature = (feature: any, parentPath: string[] = []) => {
    const argPath = [...parentPath, feature.name];
    const id = argPath.join(".");
    const label = feature.name;
    const placeholder =
      (feature as any).description || feature.dispName || undefined;

    if (feature.featureType === NexFeatureType.ATTRIBUTES) {
      return (
        <NexDiv key={id} width='100%' direction='column'>
          {iconSubItem(id, label)}
          <Stack
            spacing={0.5}
            direction='column'
            width='100%'
            paddingLeft={fontSize}
          >
            {isOpen[id] !== false &&
              feature.attributes.map((child: any) =>
                renderFeature(child, argPath)
              )}
          </Stack>
        </NexDiv>
      );
    }

    if (feature.featureType === NexFeatureType.LITERALS) {
      const value = String(getAtPath(editingNode, argPath) ?? "");
      return (
        <NexDiv width='100%' align='flex-end'>
          <LabeledSelect
            key={id}
            label={label}
            placeholder={placeholder}
            value={value}
            literals={feature.literals || []}
            onChange={(v) => handleLiteralChange(argPath, v)}
          />
        </NexDiv>
      );
    }

    if (feature.featureType === NexFeatureType.RECORDS) {
      console.log("# renderFeature: RECORDS", argPath, id);
      const rows = (getAtPath(editingNode, argPath) as any[]) || [];
      console.log(
        `# renderFeature: RECORDS at ${argPath} = ${JSON.stringify(feature, null, 2)}`
      );
      return (
        <NexDiv key={id} width='100%'>
          <RecordsEditor
            key={id}
            id={id}
            label={label}
            placeholder={placeholder}
            rows={rows}
            setRows={(r) => handleRecordsChange(argPath, r)}
            recordFields={feature.records}
          />
        </NexDiv>
      );
    }

    // Primitive (STRING / UINT32)
    const value = getAtPath(editingNode, argPath) ?? "";
    const type = isNumber(feature.featureType)
      ? "number"
      : feature.name.toLowerCase().includes("passwd") ||
          feature.name.toLowerCase().includes("password")
        ? "password"
        : "text";

    return (
      <TextField
        key={id}
        variant='standard'
        label={label}
        placeholder={placeholder || label}
        value={value as any}
        type={type}
        onChange={(e) =>
          handlePrimitiveChange(argPath, feature.featureType, e.target.value)
        }
        style={{ flex: "1", width: "100%" }}
      />
    );
  };

  return (
    <NexDiv
      direction='column'
      width='100%'
      height='100%'
      padding='1rem'
      bgColor={bgColor}
      color={color}
      fontSize={fontSize}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleApply();
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Stack
          spacing={2}
          direction='column'
          width='100%'
          height='100%'
          style={{ minHeight: 0 }}
        >
          <NexDiv flex='3' width='100%'>
            {headFields()}
          </NexDiv>
          <NexDiv
            flex='10'
            width='100%'
            style={{ minHeight: 0, overflow: "auto" }}
          >
            {bodyFields()}
          </NexDiv>
          {false && editingNode && (
            <pre>{JSON.stringify(editingNode, null, 2)}</pre>
          )}
          <NexDiv flex='1' width='100%'>
            {tailFields()}
          </NexDiv>
        </Stack>
      </form>
    </NexDiv>
  );
};

export default AdminNodeEditor;
