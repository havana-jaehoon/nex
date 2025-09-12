import React, { ChangeEvent, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";

import {
  NexButton,
  NexDiv,
  NexInput,
  NexLabel,
} from "component/base/NexBaseComponents";
import NexModal from "./NexModal";
import { NexFeatureNode, NexFeatureType, NexNodeType } from "type/NexNode";
import { Stack } from "@mui/material";

/**
 * FormatDynamicForm
 * - Render inputs from a "format" JSON (features array)
 * - Supports featureType: "STRING", "UINT32", "attributes" (nested), "literals" (select), "records" (array)
 * - Uses dispName as label, description as placeholder
 * - Values are kept in a JSON object compatible with format2Json output
 */

// ===== Types =====
//export type FeatureKind = "feature" | "format" | "folder";
//export type PrimitiveType = "STRING" | "UINT32";
/*
export interface BaseFeatureDef {
  name: string;
  dispName?: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  type: FeatureKind; // typically "feature"
  isKey?: boolean;
}

export interface PrimitiveFeatureDef extends BaseFeatureDef {
  featureType: PrimitiveType;
}


export interface LiteralsFeatureDef extends BaseFeatureDef {
  featureType: "literals";
  literals: Array<LiteralItem | string | number | boolean>;
}

export interface AttributeGroupDef extends BaseFeatureDef {
  featureType: "attributes";
  attributes: FeatureDef[];
}

// If records has an internal schema, we allow defining the fields as FeatureDef[]
export interface RecordsFeatureDef extends BaseFeatureDef {
  featureType: "records";
  // optional structural hints
  recordFields?: FeatureDef[]; // if provided, each row is an object with these fields
}

export type FeatureDef =
  | PrimitiveFeatureDef
  | LiteralsFeatureDef
  | AttributeGroupDef
  | RecordsFeatureDef;

export interface FormatDef {
  name: string;
  dispName?: string;
  description?: string;
  type: "format";
  features: FeatureDef[];
}
*/
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
    if (f.featureType === "attributes") {
      obj[f.name] = buildInitialFromFeatures(f.attributes);
    } else if (f.featureType === "literals") {
      obj[f.name] = ""; // empty until chosen
    } else if (f.featureType === "records") {
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
  <Stack direction="row" spacing={0.1} alignItems="center" width="100%">
    <NexLabel flex="3">{label}</NexLabel>
    <NexInput
      flex="5"
      id={id}
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
        spacing={0.1}
        direction="row"
        width="100%"
        alignItems="center"
        alignContent="end"
        justifyContent="center"
      >
        <NexLabel flex="3">{label}</NexLabel>
        <NexDiv flex="5" width="100%">
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
        if ((f as any).featureType === "attributes") {
          base[f.name] = buildInitialFromFeatures((f as any).attributes);
        } else if ((f as any).featureType === "records") {
          base[f.name] = [];
        } else if ((f as any).featureType === "literals") {
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
    <NexDiv width="100%">
      <div className="mb-2 text-sm font-semibold">{label} </div>
      {!recordFields || recordFields.length === 0 ? (
        <div className="space-y-2">
          {rows.map((val: any, i: number) => (
            <div key={`${id}.${i}`} className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border px-3 py-2"
                placeholder={placeholder || label}
                value={val}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = e.target.value;
                  setRows(next);
                }}
              />
              <button
                type="button"
                className="rounded-lg border px-2 py-1"
                onClick={() => removeRow(i)}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border px-3 py-2"
            onClick={addRow}
          >
            + 추가
          </button>
        </div>
      ) : (
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full text-sm">
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

                    if ((f as any).featureType === "literals") {
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

                    const isNumber = (f as any).featureType === "UINT32";
                    return (
                      <td key={cellId} className="px-3 py-2">
                        <input
                          className="w-full rounded-lg border px-2 py-1"
                          placeholder={ph}
                          type={isNumber ? "number" : "text"}
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
          <div className="p-2">
            <button
              type="button"
              className="rounded-lg border px-3 py-2"
              onClick={addRow}
            >
              + 행 추가
            </button>
          </div>
        </div>
      )}
    </NexDiv>
  );
};

// ===== Main component =====
export interface NexModalNodeEditerProps {
  isOpen: boolean; // true: showing, false: don't showing
  format: any;
  node: any; // node for input
  //initialValue?: any;              // if omitted, the form will initialize from the schema
  onChange?: (value: any) => void; // emit current JSON on every edit
  onSubmit?: (value: any) => void; // submit handler
  submitText?: string;

  type: "add" | "update" | "delete"; // add, update, delete
  onSetValue(key: string, value: any): void;
  onApply(): void;
  onCancel(): void;
}

const NexModalNodeEditer: React.FC<NexModalNodeEditerProps> = (props) => {
  const {
    isOpen,
    node,
    format,
    onSetValue,
    onApply,
    onCancel,
    onChange,
    onSubmit,
    submitText = "저장",
  } = props;

  /*
  const base = useMemo(
    () => buildInitialFromFeatures(format.features),
    [format.features]
  );

  */

  //const [data, setData] = useState<any>(node ? { ...base, ...node } : base);
  const [data, setData] = useState<any>(null);

  const [curFormat, setCurFormat] = useState<any>(
    format.type === NexNodeType.FORMAT ? format : format.children?.[1] || null
  );

  const formats =
    format.type === NexNodeType.FORMAT ? [format] : format.children || [];

  const handleFormatChange = (formatName: string) => {
    const f = formats.find((f: any) => f.name === formatName);
    console.log("# handleFormatChange: ", JSON.stringify(f, null, 2));
    const features = f ? f.features : [];
    const next = buildInitialFromFeatures(features);
    const value = asFeatureValue(formatName, NexFeatureType.STRING);

    console.log(`# handleFormatChange: data=`, JSON.stringify(next, null, 2));

    setDeep(next, ["type"], value);
    emit(next);
    setCurFormat(f);
  };

  const headFields = () => {
    // type selector (if multiple formats)
    // format 에 때라 입력 필드가 달라지므로 format 선택시 초기화
    //console.log("# headFields: formats=", JSON.stringify(format, null, 2));
    if (formats.length <= 1) return null;
    const opts = formats.map((format: any) => [format.name, format.dispName]);

    return (
      <NexDiv width="100%" direction="column">
        {format.type === NexNodeType.FOLDER ? (
          <LabeledSelect
            label="노드 선택"
            options={opts}
            value={curFormat?.name}
            onChange={handleFormatChange}
          />
        ) : null}
      </NexDiv>
    );
  };

  const bodyFields = () => (
    <>
      {curFormat && (
        <Stack spacing={1} direction="column" width="100%">
          <NexDiv flex="1">{curFormat.dispName}</NexDiv>
          <Stack
            flex="1"
            spacing={0.1}
            direction="column"
            width="100%"
            alignItems="end"
          >
            {curFormat.features.map((f: NexFeatureNode) => renderFeature(f))}
          </Stack>
        </Stack>
      )}
    </>
  );

  const tailFields = () => (
    <Stack
      spacing={2}
      direction="row"
      width="100%"
      alignContent="center"
      alignItems="center"
      justifyContent="center"
    >
      <NexButton flex="1" bgColor="blue" onClick={onApply}>
        Apply
      </NexButton>
      <NexButton flex="1" bgColor="#777777" onClick={onCancel}>
        Cancel
      </NexButton>
      <NexButton flex="1" bgColor="#999999">
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

  const renderFeature = (feature: any, parentPath: string[] = []) => {
    const path = [...parentPath, feature.name];
    const id = path.join(".");
    const label = feature.dispName || feature.name;
    const placeholder = (feature as any).description || undefined;

    //console.log("# renderFeature : ", JSON.stringify(feature, null, 2));

    if (feature.featureType === "attributes") {
      return (
        <fieldset key={id}>
          <legend>{label}</legend>
          {feature.attributes.map((child: any) => renderFeature(child, path))}
        </fieldset>
      );
    }

    if (feature.featureType === "literals") {
      const options = (feature.literals || []).map(toLiteralTuple);
      const value = String(getAtPath(data, path) ?? "");
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

    if (feature.featureType === "records") {
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
    const type =
      feature.featureType === "UINT32"
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
    <NexModal
      isOpen={isOpen}
      onClose={onCancel}
      elementId="root"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 어둡게 설정
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-0%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#333333",
          color: "white",
          border: "1px solid #666",
          borderRadius: "4px",
          padding: "0.5rem",
          display: "flex",
          width: "24rem",
        },
      }}
    >
      <NexDiv
        direction="column"
        gap="0.5rem"
        width="100%"
        border="1px solid white"
      >
        <form
          className="max-w-4xl rounded-2xl border p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(data);
          }}
          style={{ width: "100%" }}
        >
          {headFields()}

          {bodyFields()}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            >
              {submitText}
            </button>
            <button
              type="button"
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              onClick={() =>
                emit(
                  curFormat ? buildInitialFromFeatures(curFormat.features) : []
                )
              }
            >
              초기화
            </button>
            <pre className="ml-auto max-h-64 w-full max-w-[50%] overflow-auto rounded-lg bg-gray-50 p-3 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {tailFields()}
        </form>
      </NexDiv>
    </NexModal>
  );
};

export default NexModalNodeEditer;

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
