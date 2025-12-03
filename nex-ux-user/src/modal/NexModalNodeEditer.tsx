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
import AdminNodeEditor from "applet/admin/lib/AdminNodeEditor";

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
    featureType === NexFeatureType.NUMBER
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
  label: string;
  isOpen: boolean; // true: showing, false: don't showing
  node: any;
  //initialValue?: any;              // if omitted, the form will initialize from the schema
  onUpdate?(newNode: any): void; // emit current JSON on every edit
  onAdd?(newNode: any): void; // emit current JSON on every edit
  onCancel(): void;
}

const NexModalNodeEditer: React.FC<NexModalNodeEditerProps> = (props) => {
  const { label, isOpen, node, onUpdate, onAdd, onCancel } = props;

  return (
    <NexModal
      label={label}
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
          width: "48rem",
        },
      }}
    >
      <NexDiv direction="column" gap="0.5rem" width="100%">
        {/*<AdminNodeEditor node={node} onUpdate={onUpdate} onAdd={onAdd} />*/}
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
