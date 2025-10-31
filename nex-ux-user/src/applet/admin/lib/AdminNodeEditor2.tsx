import React, { useEffect, useState } from "react";

import {
  NexButton,
  NexDiv,
  NexInput,
  NexLabel,
} from "component/base/NexBaseComponents";
import { NexNodeType } from "type/NexNode";
import { Stack } from "@mui/material";
import { adminNodeDefs, getAdminNodeFromFeatures } from "./adminDataFormat";

import { defaultThemeStyle, NexThemeStyle } from "type/NexTheme";
import { clamp } from "utils/util";

import { withTheme } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { Theme as MuiTheme } from "@rjsf/mui";

import validator from "@rjsf/validator-ajv8";
import NexNodeForm from "type/NexNodeSchema";

const MuiForm = withTheme(MuiTheme);

const schema: RJSFSchema = {
  type: "object",
  properties: {
    name: { type: "string", title: "이름" },
    age: { type: "number", title: "나이", minimum: 0 },
    enabled: { type: "boolean", title: "활성화" },
  },
  required: ["name"],
};

const uiSchema = {
  age: { "ui:widget": "updown" },
};

// ===== Main component =====
export interface AdminNodeEditor2Props {
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

const AdminNodeEditor2: React.FC<AdminNodeEditor2Props> = (props) => {
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
  const [node, setNode] = useState<any>(null);
  const [path, setPath] = useState<string>("");

  const [format, setFormat] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [parentPath, setParentPath] = useState<string>("");

  const [editingPath, setEdidtingPath] = useState<string>("");
  //const [newNode, setNode] = useState<any>(node);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState<any>({ enabled: true });

  useEffect(() => {
    const index = data[0];
    const nodePath = data[1];
    const projectName = data[2];
    const systemName = data[3];
    const node: any = Object.values(data[4])[0];

    const tformat = node ? adminNodeDefs[node.type as NexNodeType] : null;
    const tfeatures = tformat?.features || [];

    // Merge the node with the template format
    const tNode = getAdminNodeFromFeatures(tfeatures);
    const next = { ...tNode, ...node };

    // original node setting
    setIndex(index);
    setNode(next);
    setPath(nodePath);

    const testData: any = {
      type: "system",
      name: "demo-system",
      address: { ip: "10.0.0.1", port: "8080" },
      hdfs: { ip: "10.0.0.2", port: "9000", path: "/data" },
      db: {
        ip: "10.0.0.3",
        port: "5432",
        user: "postgres",
        password: "****",
        database: "nex",
      },
    };
    setFormData(testData);
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
        <Stack
          spacing={1}
          direction="column"
          width="100%"
          alignItems="center"
        ></Stack>
        {/* 간격 조정 */}
        <NexDiv height="0.5rem" width="100%" borderBottom="1px solid gray" />
      </NexDiv>
    );
  };

  const bodyFields = () => (
    <NexDiv width="100%" flex="1">
      <Stack spacing={1} direction="column" width="100%">
        <NexNodeForm
          onSubmit={(data: any, event: any) =>
            console.log("submit:", data, event)
          }
        />
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

export default AdminNodeEditor2;
