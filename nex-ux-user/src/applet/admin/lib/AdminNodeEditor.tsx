import React, { useState } from "react";

import {
  NexButton,
  NexDiv,
  NexInput,
  NexLabel,
} from "component/base/NexBaseComponents";
import {
  NexFeatureNode,
  NexFeatureType,
  NexNode,
  NexNodeType,
} from "type/NexNode";
import { Stack } from "@mui/material";
import { adminNodeDefs } from "./adminDataFormat";
import {
  MdCancel,
  MdDelete,
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

function buildInitialFromFeatures(features: any[]): any {
  const obj: any = {};
  console.log(
    "# buildInitialFromFeatures : ",
    JSON.stringify(features, null, 2)
  );
  for (const f of features) {
    if (f.featureType === NexFeatureType.ATTRIBUTES) {
      obj[f.name] = buildInitialFromFeatures(f.attributes);
    } else if (f.featureType === NexFeatureType.LITERALS) {
      obj[f.name] = ""; // empty until chosen
    } else if (f.featureType === NexFeatureType.RECORDS) {
      obj[f.name] = []; // array
    } else {
      // primitives → empty string for consistency with user's format2Json
      obj[f.name] = "";
    }
  }
  return obj;
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
  id: string;
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number" | "password";
}

const LabeledInput: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) => (
  <Stack direction="row" spacing={1} alignItems="center" width="100%">
    <NexLabel width="8rem">{label}</NexLabel>
    <NexInput
      id={id}
      width="100%"
      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
      placeholder={placeholder || label}
      value={value as any}
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
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

  console.log("# LabeledSelect: options11=", JSON.stringify(options, null, 2));
  return (
    <NexDiv
      direction="row"
      align="flex-start"
      justify="flex-start"
      width="100%"
      fontSize={fontSize}
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
          <select
            value={String(value)}
            style={{ width: "100%", height: "100%" }}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              {placeholder || "옵션을 선택하세요"}
            </option>
            {Array.isArray(options)
              ? options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))
              : null}
          </select>
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
          base[f.name] = buildInitialFromFeatures((f as any).attributes);
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
          <NexButton onClick={addRow}>+ 추가</NexButton>
        </Stack>
      ) : (
        <NexDiv width="100%">
          <table>
            <thead className="bg-gray-50">
              <tr>
                {recordFields.map((f) => (
                  <th
                    key={`${id}.head.${f.name}`}
                    className="px-3 py-2 text-left font-medium"
                  >
                    {f.dispName || f.name}
                  </th>
                ))}
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, rIdx: number) => (
                <tr key={`${id}.row.${rIdx}`} className="border-t">
                  {recordFields.map((f) => {
                    const cellId = `${id}.${rIdx}.${f.name}`;
                    const ph = (f as any).description || undefined;

                    if ((f as any).featureType === NexFeatureType.LITERALS) {
                      const opts = ((f as any).literals || []).map(
                        toLiteralTuple
                      );
                      return (
                        <td key={cellId} className="px-3 py-2">
                          <select
                            className="w-full rounded-lg border px-2 py-1"
                            value={String(row[f.name] ?? "")}
                            onChange={(e) => {
                              const next = rows.map((x, i) =>
                                i === rIdx
                                  ? { ...x, [f.name]: e.target.value }
                                  : x
                              );
                              setRows(next);
                            }}
                          >
                            <option value="" disabled>
                              {ph || "선택"}
                            </option>
                            {opts.map(([v, d]: [string, string]) => (
                              <option key={v} value={v}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }

                    //const isNumber = (f as any).featureType === "UINT32";
                    return (
                      <td key={cellId} className="px-3 py-2">
                        <input
                          className="w-full rounded-lg border px-2 py-1"
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
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      className="rounded-lg border px-2 py-1"
                      onClick={() => removeRow(rIdx)}
                    >
                      삭제
                    </button>
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
  nodeType: NexNodeType;
  node?: any; // node for input
  fontLevel?: number; // 1~10
  style?: NexThemeStyle;
  //initialValue?: any;              // if omitted, the form will initialize from the schema
  onChange?: (value: any) => void; // emit current JSON on every edit
  onSubmit?: (value: any) => void; // submit handler
  submitText?: string;

  type: "add" | "update" | "delete"; // add, update, delete
  onSetValue(key: string, value: any): void;
  onApply(): void;
  onCancel(): void;
}

const AdminNodeEditor: React.FC<AdminNodeEditorProps> = (props) => {
  const {
    node,
    nodeType,
    fontLevel = 5,
    style = defaultThemeStyle,
    onSetValue,
    onApply,
    onCancel,
    onChange,
    onSubmit,
    submitText = "저장",
  } = props;

  //const [data, setData] = useState<any>(node ? { ...base, ...node } : base);

  const fontSize =
    style.fontSize[clamp(fontLevel - 1, 0, style.fontSize.length - 1)] ||
    "1rem";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  //const 

  const curFormat = node ? adminNodeDefs[node.type as NexNodeType] : adminNodeDefs[nodeType];
  const dispName = curFormat?.dispName || nodeType;

  
  const initData = node
    ? node
    : buildInitialFromFeatures(curFormat ? curFormat.features : []);
  const [data, setData] = useState<any>(initData);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  const handleReset = () => {
    const tData = buildInitialFromFeatures(curFormat.features);
    // tData 와 initData 의 병합
    const next = { ...tData, ...initData };
    setData(next);
  };

  const headFields = () => {
    return <NexDiv width="100%" direction="column"></NexDiv>;
  };

  const bodyFields = () => (
    <NexDiv width="100%" flex="1">
      {curFormat && (
        <Stack spacing={1} direction="column" width="100%">
          <NexDiv flex="1" width="100%">
            {curFormat.dispName}
          </NexDiv>
          <Stack
            flex="1"
            spacing={1}
            direction="column"
            width="100%"
            alignItems="end"
          >
            {curFormat.features.map((f: NexFeatureNode) => renderFeature(f))}
          </Stack>
        </Stack>
      )}
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
      <NexButton flex="1" bgColor="blue" onClick={onApply}>
        Apply
      </NexButton>
      <NexButton flex="1" bgColor="#777777" onClick={onCancel}>
        Cancel
      </NexButton>
      <NexButton flex="1" bgColor="#999999" onClick={handleReset}>
        Reset
      </NexButton>
    </Stack>
  );

  const emit = (next: any) => {
    console.log("NexModalNodeEditer: emit", JSON.stringify(next, null, 2));
    setData(next);
    onChange?.(next);
  };

  const handlePrimitiveChange = (
    path: string[],
    featureType: NexFeatureType,
    raw: string
  ) => {
    console.log(`# handlePrimitiveChange : ${path.join(".")} = ${raw}`);
    const next = { ...data };
    const value = asFeatureValue(raw, featureType);
    setDeep(next, path, value);
    emit(next);
  };

  const handleLiteralChange = (path: string[], raw: string) => {
    const next = { ...data };
    setDeep(next, path, raw);
    emit(next);
  };

  const handleRecordsChange = (path: string[], rows: any[]) => {
    const next = { ...data };
    setDeep(next, path, rows);
    emit(next);
  };

  const toggleSubItem = (key: string) => {
    const open = !(isOpen[key] !== false);
    setIsOpen({ ...isOpen, [key]: open });
  };

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
    const path = [...parentPath, feature.name];
    const id = path.join(".");
    const label = feature.name;
    const placeholder =
      (feature as any).description || feature.dispName || undefined;

    if (feature.featureType === NexFeatureType.ATTRIBUTES) {
      return (
        <NexDiv width="100%" direction="column">
          {iconSubItem(id, label)}
          <Stack
            spacing={0.5}
            direction="column"
            width="100%"
            paddingLeft={fontSize}
          >
            {isOpen[id] !== false &&
              feature.attributes.map((child: any) =>
                renderFeature(child, path)
              )}
          </Stack>
        </NexDiv>
      );
    }

    if (feature.featureType === NexFeatureType.LITERALS) {
      const options = (feature.literals || []).map(toLiteralTuple);
      const value = String(getAtPath(data, path) ?? "");
      console.log(
        `# renderFeature: literals ${id} value=${value} options=`,
        JSON.stringify(options, null, 2)
      );
      return (
        <LabeledSelect
          key={id}
          label={label}
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={(v) => handleLiteralChange(path, v)}
        />
      );
    }

    if (feature.featureType === NexFeatureType.RECORDS) {
      const rows = (getAtPath(data, path) as any[]) || [];
      return (
        <RecordsEditor
          key={id}
          id={id}
          label={label}
          placeholder={placeholder}
          rows={rows}
          setRows={(r) => handleRecordsChange(path, r)}
          recordFields={feature.recordFields}
        />
      );
    }

    // Primitive (STRING / UINT32)
    const value = getAtPath(data, path) ?? "";
    const type = isNumber(feature.featureType)
      ? "number"
      : feature.name.toLowerCase().includes("passwd") ||
          feature.name.toLowerCase().includes("password")
        ? "password"
        : "text";

    return (
      <LabeledInput
        key={id}
        id={id}
        label={label}
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={(v) => handlePrimitiveChange(path, feature, v)}
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
          onSubmit?.(data);
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <NexDiv direction="column" width="100%" height="100%">
          <NexDiv flex="1" width="100%">
            {headFields()}
          </NexDiv>
          <NexDiv flex="10" width="100%">
            {bodyFields()}
          </NexDiv>
          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          <NexDiv flex="1" width="100%">
            {tailFields()}
          </NexDiv>
        </NexDiv>
      </form>
    </NexDiv>
  );
};

export default AdminNodeEditor;

/**
 * Usage Example
 *
 * // Given your `format` JSON
 * <FormatDynamicForm
 *   format={format}
 *   onChange={(val) => console.log("change", val)}
 *   onSubmit={(val) => console.log("submit", val)}
 * />
 */
