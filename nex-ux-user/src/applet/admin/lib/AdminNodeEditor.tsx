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
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowLeft,
  MdArrowRight,
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineResetTv,
  MdUpdate,
} from "react-icons/md";
import { defaultThemeStyle, NexThemeStyle } from "type/NexTheme";
import { clamp } from "utils/util";
import { set } from "mobx";
import { pxIconList, pxIconMap } from "icon/pxIcon";

// 향후 Theme 등에 적용 고려
// 좁은 화면 세로 1열 편집 시
const gridNarrowSpacing = 1;
const gridNarrowColumns = 2;

// 중간 화면 편집 시 (팝업 등)
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
    featureType === NexFeatureType.NUMBER ||
    featureType === NexFeatureType.FLOAT
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
    <FormControl title={placeholder} variant="standard" sx={{ width: "100%" }}>
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
    <NexDiv width="100%" direction="column">
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", md: 1 }}>
        {label}
      </Typography>
      {recordFields && (
        <Stack spacing={1.5} width="100%" direction="column" sx={{ p: 1 }}>
          {rows.map((row: any, rIdx: number) => (
            <NexDiv align="center" width="100%" direction="row">
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
                  alignItems="flex-end"
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
                            variant="standard"
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
                flex="3"
                width="100%"
                height="100%"
                align="center"
                justify="center"
                direction="column"
              >
                <Stack spacing={1} direction="column" alignItems="center">
                  <Stack spacing={0.5} direction="row" alignItems="center">
                    <IconButton
                      title="삽입"
                      onClick={() => addRow(rIdx)}
                      size="small"
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowLeft fontSize="large" />
                    </IconButton>
                    <IconButton
                      title="삭제"
                      onClick={() => removeRow(rIdx)}
                      size="small"
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowRight fontSize="large" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={0.5} direction="row" alignItems="center">
                    <IconButton
                      title="위로 이동"
                      onClick={() => upRow(rIdx)}
                      size="small"
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowDropUp fontSize="large" />
                    </IconButton>
                    <IconButton
                      title="아래로 이동"
                      onClick={() => downRow(rIdx)}
                      size="small"
                      sx={{ border: "1px solid gray", borderRadius: 1.5 }}
                    >
                      <MdArrowDropDown fontSize="large" />
                    </IconButton>
                  </Stack>
                </Stack>
              </NexDiv>
            </NexDiv>
          ))}
          <NexDiv width="100%" direction="row">
            <NexDiv flex="11">
              <Button
                title="추가"
                variant="outlined"
                onClick={() => addRow(-1)}
                size="small"
                startIcon={<MdAdd />}
                sx={{ width: "100%", border: "1px solid gray" }}
              >
                추가
              </Button>
            </NexDiv>
            <NexDiv flex="1" />
          </NexDiv>
        </Stack>
      )}
    </NexDiv>
  );
};

// ===== Main component =====
export interface AdminNodeEditorProps {
  node: any; // node for input
  fontLevel?: number; // 1~10
  style?: NexThemeStyle;
  nodes?: any;

  onAdd?(data: any): void; // "추가"
  onUpdate?(data: any): void; // "수정"
  onCancel?(): void;
}

const AdminNodeEditor: React.FC<AdminNodeEditorProps> = (props) => {
  const {
    node,
    nodes,
    fontLevel = 5,
    style = defaultThemeStyle,
    onUpdate,
    onAdd,
  } = props;

  //const [index, setIndex] = useState<any>(null);
  //const [path, setPath] = useState<string>("");
  //const [project, setProject] = useState<string>("");
  //const [system, setSystem] = useState<string>("");
  //const [orderIndex, setOrderIndex] = useState<number>(-1);

  const [orgNode, setOrgNode] = useState<any>(null);

  const [format, setFormat] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  //  const [parentPath, setParentPath] = useState<string>("");
  //const [editingPath, setEditingPath] = useState<string>("");

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const tformat = node ? adminNodeDefs[node.type as NexNodeType] : null;
    const tfeatures = tformat?.features || [];

    // Merge the node with the template format
    const tNode = getAdminNodeFromFeatures(tfeatures);
    const next = { ...tNode, ...node };

    setOrgNode(next);

    // set editing state
    setEditingNode(next);

    setFormat(tformat);
    setFeatures(tfeatures);
  }, [node]);

  const fontSize =
    style.fontSize[clamp(fontLevel - 1, 0, style.fontSize.length - 1)] ||
    "1rem";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  const handleReset = () => {
    // 입력된 node 데이터와 format 에 의해 만들어진 데이터를 병합
    setEditingNode(orgNode);
    console.log("# handleReset: ", JSON.stringify(editingNode));
  };

  const handleAdd = () => {
    //const newData = [-1, editingPath, project, system, { ["-1"]: editingNode }];
    onAdd?.(editingNode);
  };

  const handleUpdate = () => {
    onUpdate?.(editingNode);
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

    //setEditingPath(newNodePath);
    //onChange?.([index, newNodePath, next]);
  };

  const handleLiteralChange = (argPath: string[], raw: string) => {
    //console.log(`# handleLiteralChange : ${argPath.join(".")} = ${raw}`);
    const next = { ...editingNode };
    setDeep(next, argPath, raw);
    //console.log(`# handleLiteralChange : ${argPath.join(".")} = ${JSON.stringify(next)}`);
    setEditingNode(next);

    //onChange?.([index, editingPath, next]);
  };

  const handleRecordsChange = (argPath: string[], rows: any[]) => {
    const next = { ...editingNode };
    setDeep(next, argPath, rows);
    setEditingNode(next);

    //onChange?.([index, editingPath, next]);
  };

  const toggleSubItem = (key: string) => {
    const open = !(isOpen[key] !== false);
    setIsOpen({ ...isOpen, [key]: open });
  };

  const headFields = () => {
    //console.log("# format: ", JSON.stringify(format, null, 2));
    return (
      <NexDiv width="100%" direction="column">
        {/* 간격 조정 */}

        <span style={{ height: fontSize }} />
      </NexDiv>
    );
  };

  const bodyFields = () => (
    <Grid container spacing={3} width="100%" alignItems="flex-end">
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
      direction="row"
      width="100%"
      alignContent="end"
      alignItems="center"
      justifyContent="end"
    >
      {onUpdate && (
        <Button
          size="large"
          variant="contained"
          onClick={() => handleUpdate()}
          sx={{ flex: 3 }}
          startIcon={<MdUpdate />}
        >
          업데이트
        </Button>
      )}

      {onAdd && (
        <Button
          size="large"
          variant="contained"
          onClick={() => handleAdd()}
          sx={{ flex: 3 }}
          startIcon={<MdAdd />}
        >
          추가
        </Button>
      )}

      <Button
        size="large"
        variant="contained"
        onClick={() => handleReset()}
        sx={{ flex: 3 }}
        startIcon={<MdOutlineResetTv />}
      >
        초기화
      </Button>
    </Stack>
  );

  const iconSubItem = (key: string, label: string) => {
    return (
      <NexDiv
        direction="row"
        align="center"
        justify="space-between"
        onClick={() => toggleSubItem(key)}
        cursor="pointer"
        width="100%"
      >
        <NexLabel fontSize={fontSize}>{key}</NexLabel>
        <NexDiv align="end">
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
        <NexDiv key={feature.name} width="100%" direction="column">
          {iconSubItem(id, label)}
          <Stack
            spacing={0.5}
            direction="column"
            width="100%"
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
        <NexDiv width="100%" align="flex-end">
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
      //console.log("# renderFeature: RECORDS", argPath, id);
      const rows = (getAtPath(editingNode, argPath) as any[]) || [];
      //console.log(
      //  `# renderFeature: RECORDS at ${argPath} = ${JSON.stringify(feature, null, 2)}`
      //);
      return (
        <NexDiv key={id} width="100%">
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
    if (
      feature.featureType === NexFeatureType.STRING_ARRAY ||
      feature.featureType === NexFeatureType.NUMBER_ARRAY
    ) {
      const arr =
        (getAtPath(editingNode, argPath) as any[]) &&
        Array.isArray(getAtPath(editingNode, argPath))
          ? (getAtPath(editingNode, argPath) as any[])
          : [];

      const itemType =
        feature.featureType === NexFeatureType.NUMBER_ARRAY ? "number" : "text";

      const updateArray = (nextArr: any[]) => {
        const nextNode = { ...editingNode };
        setDeep(nextNode, argPath, nextArr);
        setEditingNode(nextNode);
        //onChange?.([index, editingPath, nextNode]);
      };

      const updateItem = (idx: number, raw: string) => {
        const nextArr = [...arr];
        nextArr[idx] =
          itemType === "number" ? (raw === "" ? "" : Number(raw)) : raw;
        updateArray(nextArr);
      };

      const addItem = () => {
        updateArray([...arr, itemType === "number" ? "" : ""]);
      };

      const removeItem = (idx: number) => {
        const nextArr = arr.filter((_, i) => i !== idx);
        updateArray(nextArr);
      };

      const arrayItemView = (label: string, value: any, index: number) => {
        let selectOptions: [] | null = null;

        if (feature.name === "sources") {
          const systemOptions = nodes["system"] || [];
          const elementList = nodes["element"] || [];

          const systemName = value ? value.split(":")[0] : "";
          const elementPath = value ? value.split(":")[1] : "";
          const elementOptions = (sysName: string) =>
            elementList.filter((el: any) => el.system === sysName);
          return (
            <>
              <TextField
                select
                label={"system"}
                variant="standard"
                value={systemName ?? ""}
                onChange={(e) => updateItem(index, e.target.value)}
                style={{ flex: 1, width: "100%" }}
              >
                {systemOptions.map((item: any) => (
                  <MenuItem key={item.path} value={item.name}>
                    {item.helper}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={"element"}
                variant="standard"
                value={elementPath ?? ""}
                onChange={(e) =>
                  updateItem(index, `${systemName}:${e.target.value}`)
                }
                style={{ flex: 1, width: "100%" }}
              >
                {elementOptions(systemName).map((item: any) => (
                  <MenuItem key={item.path} value={item.path}>
                    {item.helper}
                  </MenuItem>
                ))}
              </TextField>
            </>
          );
        }

        if (
          feature.name === NexNodeType.SYSTEM ||
          feature.name === NexNodeType.STORAGE ||
          feature.name === NexNodeType.FORMAT ||
          feature.name === NexNodeType.FORMAT ||
          feature.name === NexNodeType.STORE ||
          feature.name === NexNodeType.PROCESSOR ||
          feature.name === NexNodeType.ELEMENT ||
          feature.name === NexNodeType.CONTENTS ||
          feature.name === NexNodeType.APPLET ||
          feature.name === NexNodeType.THEME ||
          feature.name === NexNodeType.USER
        ) {
          if (nodes[feature.name]) {
            selectOptions = nodes[feature.name];
          }
        }

        if (selectOptions) {
          return (
            <TextField
              select
              label={label}
              variant="standard"
              value={value ?? ""}
              onChange={(e) => updateItem(index, e.target.value)}
              style={{ flex: 1, width: "100%" }}
            >
              {selectOptions.map((item: any) => (
                <MenuItem key={item.path} value={item.path}>
                  {item.helper}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        return (
          <TextField
            variant="standard"
            label={`${label}[${index}]`}
            type={itemType}
            value={value ?? ""}
            style={{ flex: 1, width: "100%" }}
            onChange={(e) => updateItem(index, e.target.value)}
          />
        );
      };

      return (
        <NexDiv key={id} width="100%" direction="column">
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {label}
          </Typography>
          <Stack spacing={0.5} direction="column" width="100%">
            {arr.map((v, i) => (
              <Stack
                key={`${id}.${i}`}
                spacing={0.5}
                direction="row"
                alignItems="flex-end"
              >
                {arrayItemView(label, v, i)}
                <IconButton
                  size="small"
                  title="삭제"
                  onClick={() => removeItem(i)}
                  sx={{ border: "1px solid gray", borderRadius: 1 }}
                >
                  <MdDelete fontSize="1rem" />
                </IconButton>
              </Stack>
            ))}
            <Button
              variant="outlined"
              size="small"
              onClick={addItem}
              startIcon={<MdAdd />}
              sx={{ alignSelf: "flex-start" }}
            >
              추가
            </Button>
          </Stack>
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

    const itemView = (
      label: string,
      value: any,
      itemType: string,
      index: number,
      argPath: string[],
      featureType: any
    ) => {
      let selectOptions: any[] | null = null;

      if (
        feature.name === NexNodeType.SYSTEM ||
        feature.name === NexNodeType.STORAGE ||
        feature.name === NexNodeType.FORMAT ||
        feature.name === NexNodeType.FORMAT ||
        feature.name === NexNodeType.STORE ||
        feature.name === NexNodeType.PROCESSOR ||
        feature.name === NexNodeType.ELEMENT ||
        feature.name === NexNodeType.CONTENTS ||
        feature.name === NexNodeType.APPLET ||
        feature.name === NexNodeType.THEME ||
        feature.name === NexNodeType.USER
      ) {
        if (nodes[feature.name]) {
          selectOptions = nodes[feature.name];
        }
      } else if (feature.name === "icon") {
        selectOptions = pxIconList;
      }

      if (selectOptions) {
        return (
          <TextField
            select
            label={label}
            variant="standard"
            value={value ?? ""}
            onChange={(e) =>
              handlePrimitiveChange(argPath, featureType, e.target.value)
            }
            style={{ flex: 1, width: "100%" }}
          >
            {selectOptions.map((item: any) => (
              <MenuItem key={item.path} value={item.path}>
                {item.helper}
              </MenuItem>
            ))}
          </TextField>
        );
      }

      return (
        <TextField
          variant="standard"
          label={label}
          type={itemType}
          value={value ?? ""}
          style={{ flex: 1, width: "100%" }}
          onChange={(e) =>
            handlePrimitiveChange(argPath, feature.featureType, e.target.value)
          }
        />
      );
    };

    return itemView(label, value, type, 0, argPath, feature.featureType);
  };

  return (
    <NexDiv
      direction="column"
      width="100%"
      height="100%"
      padding="1rem"
      bgColor={bgColor}
      color={color}
      fontSize={fontSize}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Stack
          spacing={2}
          direction="column"
          width="100%"
          height="100%"
          style={{ minHeight: 0 }}
        >
          <NexDiv width="100%">{headFields()}</NexDiv>
          <NexDiv
            flex="10"
            width="100%"
            style={{ minHeight: 0, overflow: "auto" }}
          >
            {bodyFields()}
          </NexDiv>
          {false && editingNode && (
            <pre>{JSON.stringify(editingNode, null, 2)}</pre>
          )}
          <NexDiv flex="1" width="100%">
            {tailFields()}
          </NexDiv>
        </Stack>
      </form>
    </NexDiv>
  );
};

export default AdminNodeEditor;
