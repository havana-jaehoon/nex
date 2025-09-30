import React, { useEffect, useMemo, useState } from "react";

import {
  NexButton,
  NexDiv,
  NexInput,
  NexLabel,
} from "component/base/NexBaseComponents";
import { NexFeatureNode, NexFeatureType, NexNodeType } from "type/NexNode";
import { Divider, Stack } from "@mui/material";
import { adminNodeDefs, getAdminNodeFromFeatures } from "./adminDataFormat";
import {
  MdCancel,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { defaultThemeStyle, NexThemeStyle } from "type/NexTheme";
import { clamp } from "utils/util";

export interface LiteralItem {
  value: string | number | boolean;
  dispName?: string;
}

// ===== Helpers =====
function toLiteralTuple(
  item: LiteralItem | string | number | boolean
): [string, string] {
  if (typeof item === "object" && item !== null && "value" in item) {
    const value = String((item as LiteralItem).value);
    const dispName = (item as LiteralItem).dispName ?? value;
    return [value, dispName];
  }
  const value = String(item);
  return [value, value];
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
interface InputProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange?: (v: string) => void;
  type?: "text" | "number" | "password";
}

const LabeledInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    width="100%"
    title={placeholder}
  >
    <NexLabel width="8rem">{label}</NexLabel>
    {onChange ? (
      <NexInput
        width="100%"
        placeholder={placeholder || label}
        value={value as any}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <NexLabel width="100%">{value}</NexLabel>
    )}
  </Stack>
);

interface SelectProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  options: [string, string][]; // [value, label]
}

const LabeledSelect: React.FC<SelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
}) => {
  const fontSize = "1rem";

  const tValue =
    value === null || value === undefined || value === ""
      ? options[0][0]
      : value;

  const existsInOptions = options.some(
    ([name, dispName]) => name === String(tValue)
  );

  if (!existsInOptions) {
    console.warn(
      `# LabeledSelect: no valid options : label=${label}, value=${value}, opts=${JSON.stringify(options, null, 2)}`
    );
    return null;
  }

  return (
    <NexDiv
      direction="row"
      align="flex-start"
      justify="flex-start"
      width="100%"
      fontSize={fontSize}
      title={placeholder}
    >
      <Stack
        spacing={1}
        direction="row"
        width="100%"
        alignItems="center"
        alignContent="end"
        justifyContent="center"
      >
        <NexLabel width="8rem">{label}</NexLabel>
        <NexDiv width="100%">
          {options.length === 1 ? (
            <NexLabel>{tValue}</NexLabel>
          ) : (
            <select
              value={String(tValue)}
              style={{ width: "100%", height: "100%" }}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="" disabled>
                {placeholder || "옵션을 선택하세요"}
              </option>
              {Array.isArray(options)
                ? options.map(([name, dispName]) => (
                    <option key={name} value={name}>
                      {dispName}
                    </option>
                  ))
                : null}
            </select>
          )}
        </NexDiv>
      </Stack>
    </NexDiv>
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
  const addRow = () => {
    if (recordFields && recordFields.length > 0) {
      const base: any = {};
      for (const f of recordFields) {
        if ((f as any).featureType === NexFeatureType.ATTRIBUTES) {
          base[f.name] = getAdminNodeFromFeatures((f as any).attributes);
        } else if ((f as any).featureType === NexFeatureType.RECORDS) {
          base[f.name] = [];
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
  };

  const removeRow = (idx: number) => {
    const next = [...rows];
    next.splice(idx, 1);
    setRows(next);
  };

  return (
    <Stack spacing={1} width="100%" direction="row">
      <NexDiv width="8rem">{label} </NexDiv>
      {!recordFields || recordFields.length === 0 ? (
        <Stack width="100%" direction="column" spacing={0.2}>
          {rows.map((val: any, i: number) => (
            <NexDiv key={`${id}.${i}`} width="100%">
              <NexInput
                width="100%"
                placeholder={placeholder || label}
                value={val}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = e.target.value;
                  setRows(next);
                }}
              />

              <MdCancel type="button" onClick={() => removeRow(i)} />
            </NexDiv>
          ))}
          <NexButton type="button" onClick={addRow}>
            + 추가
          </NexButton>
        </Stack>
      ) : (
        <NexDiv width="100%">
          <table>
            <thead>
              <tr>
                {recordFields.map((f) => (
                  <th key={`${id}.head.${f.name}`}>{f.dispName || f.name}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, rIdx: number) => (
                <tr key={`${id}.row.${rIdx}`}>
                  {recordFields.map((f) => {
                    const cellId = `${id}.${rIdx}.${f.name}`;
                    const ph = (f as any).description || undefined;

                    if ((f as any).featureType === NexFeatureType.LITERALS) {
                      const opts = ((f as any).literals || []).map(
                        toLiteralTuple
                      );
                      return (
                        <td key={cellId}>
                          <LabeledSelect
                            key={id}
                            label={f.name}
                            placeholder={f.description || f.dispName || f.name}
                            value={row[f.name]}
                            options={opts}
                            onChange={(v) => {
                              const next = rows.map((x, i) =>
                                i === rIdx ? { ...x, [f.name]: v } : x
                              );
                              setRows(next);
                            }}
                          />
                        </td>
                      );
                    }

                    //const isNumber = (f as any).featureType === "UINT32";
                    return (
                      <td key={cellId}>
                        <NexInput
                          placeholder={ph}
                          type={isNumber(f.featureType) ? "number" : "text"}
                          value={row[f.name] ?? ""}
                          onChange={(e) => {
                            const value = asFeatureValue(
                              e.target.value,
                              (f as NexFeatureNode).featureType
                            );
                            const next = rows.map((x, i) =>
                              i === rIdx ? { ...x, [f.name]: value } : x
                            );
                            setRows(next);
                          }}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <NexButton onClick={() => removeRow(rIdx)}>삭제</NexButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <NexDiv>
            <NexButton onClick={addRow}>+ </NexButton>
          </NexDiv>
        </NexDiv>
      )}
    </Stack>
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

  //const [data, setData] = useState<any>(node ? { ...base, ...node } : base);

  //const index = data[0];
  //const nodePath = data[1];
  //const parentPath = `${nodePath.substring(0, nodePath.lastIndexOf("/"))}`;
  //const node: any = data[2];

  //const format = node ? adminNodeDefs[node.type as NexNodeType] : null;
  //const features = format?.features || [];
  //const tNode = getAdminNodeFromFeatures(features);
  //const label = format?.dispName || node.type;

  const [index, setIndex] = useState<any>(null);
  const [node, setNode] = useState<any>(null);
  const [path, setPath] = useState<string>("");

  const [format, setFormat] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [parentPath, setParentPath] = useState<string>("");

  const [editingPath, setEdidtingPath] = useState<string>("");
  //const [newNode, setNode] = useState<any>(node);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const index = data[0];
    const nodePath = data[1];
    const node: any = data[2];

    const tformat = node ? adminNodeDefs[node.type as NexNodeType] : null;
    const tfeatures = tformat?.features || [];

    // Merge the node with the template format
    const tNode = getAdminNodeFromFeatures(tfeatures);
    const next = { ...tNode, ...node };

    // original node setting
    setIndex(index);
    setNode(next);
    setPath(nodePath);

    // set editing state
    setEditingNode(next);
    setFormat(tformat);
    setFeatures(tfeatures);
    setEdidtingPath(nodePath);

    setParentPath(`${nodePath.substring(0, nodePath.lastIndexOf("/"))}`);
  }, [data]);

  const fontSize =
    style.fontSize[clamp(fontLevel - 1, 0, style.fontSize.length - 1)] ||
    "1rem";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  const handleReset = () => {
    // 입력된 node 데이터와 format 에 의해 만들어진 데이터를 병합
    setEditingNode(node);
    setEdidtingPath(path);
    console.log("# handleReset: ", JSON.stringify(editingNode));
  };

  const handleApply = () => {
    const newData = [index, editingPath, editingNode];
    console.log(
      "NexModalNodeEditer: handleApply",
      JSON.stringify(newData, null, 2)
    );

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
    setEdidtingPath(newNodePath);
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
    return (
      <NexDiv width="100%" direction="column">
        <NexLabel fontSize={fontSize} style={{ fontWeight: "bold" }}>
          {format?.dispName}
        </NexLabel>
        {/* 간격 조정 */}
        <span style={{ height: fontSize }} />
        <Stack spacing={1} direction="column" width="100%" alignItems="center">
          <LabeledInput
            label={"index"}
            placeholder={"Index(key) of Node"}
            value={index}
          />
          <LabeledInput
            label={"Path"}
            placeholder={"Path of Node"}
            value={editingPath}
          />
        </Stack>
        {/* 간격 조정 */}
        <NexDiv height="0.5rem" width="100%" borderBottom="1px solid gray" />
      </NexDiv>
    );
  };

  const bodyFields = () => (
    <NexDiv width="100%" flex="1">
      <Stack spacing={1} direction="column" width="100%">
        <Stack
          flex="1"
          spacing={1}
          direction="column"
          width="100%"
          alignItems="end"
        >
          {features && features.map((f: NexFeatureNode) => renderFeature(f))}
        </Stack>
      </Stack>
    </NexDiv>
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
      <NexButton flex="1" bgColor="blue" onClick={handleApply}>
        {mode === "add" ? "추가" : "적용"}
      </NexButton>
      {onCancel && (
        <NexButton type="button" flex="1" bgColor="#777777" onClick={onCancel}>
          취소
        </NexButton>
      )}
      <NexButton type="button" flex="1" bgColor="#999999" onClick={handleReset}>
        초기화
      </NexButton>
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
        <NexDiv key={id} width="100%" direction="column">
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
      const options = (feature.literals || []).map(toLiteralTuple);
      const value = String(getAtPath(editingNode, argPath) ?? "");

      return (
        <LabeledSelect
          key={id}
          label={label}
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={(v) => handleLiteralChange(argPath, v)}
        />
      );
    }

    if (feature.featureType === NexFeatureType.RECORDS) {
      const rows = (getAtPath(editingNode, argPath) as any[]) || [];
      return (
        <RecordsEditor
          key={id}
          id={id}
          label={label}
          placeholder={placeholder}
          rows={rows}
          setRows={(r) => handleRecordsChange(argPath, r)}
          recordFields={feature.recordFields}
        />
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
      <LabeledInput
        key={id}
        label={label}
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={(v) => handlePrimitiveChange(argPath, feature.featureType, v)}
      />
    );
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
          handleApply();
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Stack spacing={2} direction="column" width="100%" height="100%">
          <NexDiv width="100%">{headFields()}</NexDiv>
          <NexDiv flex="10" width="100%">
            {bodyFields()}
          </NexDiv>
          {editingNode && <pre>{JSON.stringify(editingNode, null, 2)}</pre>}
          <NexDiv flex="1" width="100%">
            {tailFields()}
          </NexDiv>
        </Stack>
      </form>
    </NexDiv>
  );
};

export default AdminNodeEditor;
