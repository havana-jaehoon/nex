import React from "react";
import { withTheme } from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { Theme as SemanticTheme } from "@rjsf/semantic-ui";
import { Theme as MantineTheme } from "@rjsf/mantine";
import { Theme as MuiTheme } from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { NexFeatureType, NexNodeType } from "./NexNode";
import { NexDiv } from "component/base/NexBaseComponents";

import "semantic-ui-css/semantic.min.css";

const NexJsonForm = withTheme(MuiTheme);

const nexBaseProps: NonNullable<RJSFSchema["properties"]> = {
  name: { type: "string", title: "이름", minLength: 1 },
  dispName: { type: ["string", "null"], title: "표시 이름" },
  description: { type: ["string", "null"], title: "설명" },
  type: { const: NexNodeType.FOLDER },
  // type은 각 노드에서 const로 재정의하므로 여기서는 제거하거나 넓은 범위로 둡니다.
  // type: { $ref: "#/$defs/NexNodeType" },
  icon: { type: ["string", "null"], title: "아이콘" },
  color: { type: ["string", "null"], title: "색상(HEX 또는 이름)" },
};

const folderSchema: RJSFSchema = {
  $id: "NexFolderNode",
  title: "Folder",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.FOLDER },
  },
  required: ["name", "type"],
  // ajv-errors를 통해 필수값 누락 메시지 커스터마이즈
  errorMessage: {
    required: {
      name: "이름을 입력하세요.",
    },
  },
};

const featureSchema: RJSFSchema = {
  type: "object",
  properties: {
    ...nexBaseProps,

    isKey: { type: "boolean", title: "Key 여부", default: false },
    featureType: {
      type: "string",
      title: "피처 타입",
      enum: Object.values(NexFeatureType).filter((v) => typeof v === "string"),
    },
    literal: {
      type: "array",
      title: "리터럴 값(옵션)",
      items: {
        oneOf: [
          { type: "string" },
          { type: "number" },
          { type: "boolean" },
          { type: "object" },
        ],
      },
    },
  },
  required: ["name", "type"],
};

const formatSchema: RJSFSchema = {
  $id: "NexFormatNode",
  title: "Format",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.FORMAT },
    features: {
      type: "array",
      title: "피처 목록",
      items: featureSchema,
      minItems: 0,
    },
  },
  required: ["name", "type"],
};

const storeSchema: RJSFSchema = {
  $id: "NexStoreNode",
  title: "Store",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.STORE },
  },
  required: ["name", "type"],
};

const processorSchema: RJSFSchema = {
  $id: "NexProcessorNode",
  title: "Processor",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.PROCESSOR },
  },
  required: ["name", "type"],
};

const elementSchema: RJSFSchema = {
  $id: "NexElementNode",
  title: "Element",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.ELEMENT },
    format: { type: "string", title: "Format 경로" },
    store: { type: "string", title: "Store 경로" },
    processor: { type: "string", title: "Processor 경로" },
    processingInterval: {
      type: "integer",
      title: "Processing Interval(초)",
      default: 0,
    },
    processingUnit: { type: "string", title: "Processing Unit" },
    source: { type: "string", title: "Source 경로(들)" },
  },
  required: [
    "name",
    "type",
    "format",
    "store",
    "processor",
    "processingInterval",
    "processingUnit",
    "source",
  ],
};

const contentsSchema: RJSFSchema = {
  $id: "NexContentsNode",
  title: "Contents",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.CONTENTS },
    element: { type: "string", title: "Element 경로" },
    condition: {
      type: "array",
      title: "조건 목록",
      items: {
        type: "object",
        properties: {
          key: { type: "string", title: "키" },
          feature: { type: "string", title: "피처" },
          method: { type: "string", title: "메서드" },
        },
        required: ["key", "feature", "method"],
      },
      minItems: 0,
    },
    selection: {
      type: "array",
      title: "선택 목록",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          feature: { type: "string", title: "피처" },
        },
      },
      minItems: 0,
    },
  },
  required: ["name", "type", "element"],
};

const sectionSchema: RJSFSchema = {
  $id: "NexWebSectionNode",
  title: "Web Section",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.SECTION },
    size: { type: "integer", title: "크기" },
    isRoute: {
      type: ["boolean", "null"],
      title: "라우트 여부",
      default: false,
    },
    route: { type: ["string", "null"], title: "라우트 경로" },
    direction: {
      type: "string",
      title: "방향",
      oneOf: [
        { const: "row", title: "가로" },
        { const: "column", title: "세로" },
      ],
    },
    padding: { type: "integer", title: "간격" },
    applet: { type: "string", title: "Applet 경로" },
    contents: {
      type: "array",
      title: "하위 섹션 목록",
      items: {
        type: "string",
      },
    },
  },
  required: ["name", "type"],
};

const userSchema: RJSFSchema = {
  $id: "NexWebThemeUserNode",
  title: "Web Theme User",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.USER },
    theme: { type: "string", title: "테마 경로" },
  },
  required: ["name", "type", "theme"],
};

const themeSchema: RJSFSchema = {
  $id: "NexWebThemeNode",
  title: "Web Theme",
  type: "object",
  properties: {
    ...nexBaseProps,
    type: { const: NexNodeType.THEME },
    theme: {
      type: "array",
      title: "테마 스타일 목록",
      items: {
        type: "object",
        properties: {
          name: { type: "string", title: "이름" },
          colors: {
            type: "array",
            title: "색상 목록",
            items: {
              type: "string",
              title: "색상",
            },
          },
          bgColors: {
            type: "array",
            title: "배경 색상 목록",
            items: {
              type: "string",
              title: "배경 색상",
            },
          },
          activeColor: {
            type: "array",
            title: "활성 색상 목록",
            items: {
              type: "string",
              title: "활성 색상",
            },
          },
          activeBgColor: {
            type: "array",
            title: "활성 배경 색상 목록",
            items: {
              type: "string",
              title: "활성 배경 색상",
            },
          },
          horverColor: {
            type: "array",
            title: "호버 색상 목록",
            items: {
              type: "string",
              title: "호버 색상",
            },
          },
          hoverBgColor: {
            type: "array",
            title: "호버 배경 색상 목록",
            items: {
              type: "string",
              title: "호버 배경 색상",
            },
          },
          fontFamily: { type: "string", title: "폰트 패밀리" },
          fontSize: {
            type: "array",
            title: "폰트 크기 목록",
            items: {
              type: "string",
              title: "폰트 크기",
            },
          },
          borderRadius: { type: ["string", "null"], title: "테두리 반경" },
          gap: { type: ["string", "null"], title: "간격" },
          padding: { type: ["string", "null"], title: "패딩" },
        },
      },
    },
  },
  required: ["name", "type"],
};

/** 통합 스키마 */
const schema: RJSFSchema = {
  $id: "NexNodeSchema",
  title: "Nex Node",
  type: "object",
  required: ["name", "type"],
  properties: {
    type: {
      title: "노드 타입",
      type: "string",
      enum: [
        "project",
        "folder",
        "system",
        "feature",
        "format",
        "store",
        "processor",
        "element",
        "contents",
        "applet",
        "section",
      ],
    },
  },
  allOf: [{ $ref: "#/$defs/NexNodeBase" }],
  oneOf: [
    { $ref: "#/$defs/NexFolderNode" },
    { $ref: "#/$defs/NexFormatNode" },
    { $ref: "#/$defs/NexFeatureNode" },
  ],
  $defs: {
    /** ===== 공통 base ===== */
    NexNodeBase: {
      type: "object",
      properties: {
        name: { type: "string", title: "이름" },
        dispName: { type: ["string", "null"], title: "표시 이름" },
        description: { type: ["string", "null"], title: "설명" },
        // type은 각 노드에서 const로 재정의하므로 여기서는 제거하거나 넓은 범위로 둡니다.
        // type: { $ref: "#/$defs/NexNodeType" },
        icon: { type: ["string", "null"], title: "아이콘" },
        color: { type: ["string", "null"], title: "색상(HEX 또는 이름)" },
      },
      required: ["name"],
      additionalProperties: true,
      // Base에서는 additionalProperties를 제거하거나 true로 둡니다.
    },

    /** ====== Enums ====== */
    NexRecordStorage: {
      type: "string",
      enum: ["memory", "disk", "hdfs"],
      title: "저장소",
    },
    NexRecordUnit: {
      type: "string",
      enum: ["NONE", "SEC", "MIN", "HOUR", "DAY", "MONTH", "YEAR"],
      title: "레코드 단위",
    },
    NexRecordBlock: {
      type: "string",
      enum: ["NONE", "MIN", "HOUR", "DAY", "MONTH", "YEAR"],
      title: "블록 단위",
    },
    NexRecordExpireUnit: {
      type: "string",
      enum: ["NONE", "SEC", "MIN", "HOUR", "DAY", "MONTH", "YEAR"],
      title: "만료 단위",
    },
    NexProcessingUnit: {
      type: "string",
      enum: ["NONE", "MSEC", "SEC", "MIN", "HOUR", "DAY", "MONTH", "YEAR"],
      title: "처리 주기 단위",
    },
    NexConditionMethod: {
      type: "string",
      enum: [
        "match",
        "path-match",
        "starts-with",
        "ends-with",
        "contains",
        "greater-than",
        "less-than",
      ],
      title: "조건 방식",
    },
    /** 질문에 없던 enum 가정 (실제 값으로 교체 권장) */
    NexNodeType: {
      type: "string",
      enum: [
        "folder",
        "system",
        "feature",
        "format",
        "store",
        "processor",
        "element",
        "contents",
        "applet",
        "section",
      ],
    },
    NexFeatureType: {
      type: "string",
      enum: [
        "uint32",
        "int32",
        "float",
        "double",
        "boolean",
        "string",
        "timestamp",
      ],
      title: "특성 타입",
    },

    NexFolderNode: {
      title: "Folder Node",
      allOf: [
        { $ref: "#/$defs/NexNodeBase" },
        {
          type: "object",
          properties: {
            type: { const: "folder" },
          },
          required: ["type"],
        },
      ],
    },
    NexFormatNode: {
      title: "Format Node",
      allOf: [
        { $ref: "#/$defs/NexNodeBase" },
        {
          type: "object",
          properties: {
            type: { const: "format" },
            isTree: { type: "boolean", title: "트리 여부", default: false },
            features: {
              type: "array",
              title: "피처 목록",
              items: { $ref: "#/$defs/NexFeatureNode" },
              minItems: 0,
            },
          },
          required: ["type", "features"],
        },
      ],
    },
    NexFeatureNode: {
      title: "Feature Node",
      allOf: [
        { $ref: "#/$defs/NexNodeBase" },
        {
          type: "object",
          properties: {
            type: { const: "feature" },
            isKey: { type: "boolean", title: "Key 여부", default: false },
            featureType: { $ref: "#/$defs/NexFeatureType" },
            literal: {
              type: "array",
              title: "리터럴 값(옵션)",
              items: {
                oneOf: [
                  { type: "string" },
                  { type: "number" },
                  { type: "boolean" },
                  { type: "object" },
                ],
              },
            },
            children: {
              type: "array",
              title: "하위 노드(옵션)",
              items: { $ref: "#" },
            },
          },
          required: ["type", "isKey", "featureType"],
        },
      ],
    },
  },
};

/** 권장 uiSchema (위젯/정렬) */
const smallOptions = { margin: "dense", size: "tiny", variant: "outlined" };

const uiSchema: UiSchema = {
  // common small inputs
  name: { "ui:options": smallOptions },
  dispName: { "ui:options": smallOptions },
  description: {
    "ui:widget": "textarea",
    "ui:options": { ...smallOptions, rows: 2 },
  },
  icon: { "ui:options": smallOptions },
  color: { "ui:options": smallOptions },

  // features array
  features: {
    "ui:options": { ...smallOptions },
    items: {
      name: { "ui:options": smallOptions },
      dispName: { "ui:options": smallOptions },
      description: {
        "ui:widget": "textarea",
        "ui:options": { ...smallOptions, rows: 2 },
      },
      icon: { "ui:options": smallOptions },
      color: { "ui:options": smallOptions },
      isKey: { "ui:widget": "checkbox", "ui:options": { size: "small" } },
      featureType: { "ui:options": smallOptions },
      literal: { "ui:options": { ...smallOptions, orderable: true } },
    },
  },

  // existing configs
  db: {
    password: { "ui:widget": "password" },
  },
  processingInterval: { "ui:widget": "updown", "ui:options": smallOptions },
  record: {
    allowDuplication: {
      "ui:widget": "checkbox",
      "ui:options": { size: "small" },
    },
    allowKeepValue: {
      "ui:widget": "checkbox",
      "ui:options": { size: "small" },
    },
  },
  literal: {
    "ui:options": { ...smallOptions, orderable: true },
  },
};

const folderDataSample = {
  name: "web",
  dispName: "web 데이 터 포맷",
  description: "WEB UI 용 데이터 유형 폴더",
  type: "folder",
  icon: "",
  color: "",
};

const formatDataSample = {
  name: "node",
  dispName: "Admin Node",
  description: "Admin Node 데이터 포맷",
  type: "format",
  icon: "",
  color: "",
  isTree: true,
  features: [
    {
      name: "index",
      dispName: "Index",
      icon: null,
      color: null,
      type: "feature",
      isKey: true,
      featureType: "INDEX",
    },
    {
      name: "path",
      dispName: "경로",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "project",
      dispName: "프로젝트",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "system",
      dispName: "시스템",
      icon: null,
      color: null,
      type: "feature",
      isKey: false,
      featureType: "STRING",
    },
    {
      name: "object",
      dispName: "객체",
      description: "노드 객체",
      type: "feature",
      icon: null,
      color: null,
      featureType: "JSON",
    },
  ],
};

const themeDataSample = {
  name: "default",
  dispName: "Default Theme",
  description: "Default Theme",
  type: "theme",
  icon: "theme",
  color: "#33A1FF",
  theme: [
    {
      name: "default",
      colors: ["#393c45", "#03dac6"],
      bgColors: ["#eeeeee", "#e8edf7"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      gap: "1rem",
      padding: "0.2rem",
      fontSize: [
        "0.5rem",
        "0.6rem",
        "0.7rem",
        "0.8rem",
        "0.9rem",
        "1rem",
        "1.25rem",
        "1.5rem",
        "1.75rem",
        "2rem",
      ],
    },
    {
      name: "applet",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      borderRadius: "0.5rem",
      padding: "0rem",
      gap: "0rem",
      fontSize: [
        "0.5rem",
        "0.6rem",
        "0.7rem",
        "0.8rem",
        "0.9rem",
        "1rem",
        "1.25rem",
        "1.5rem",
        "1.75rem",
        "2rem",
      ],
    },
    {
      name: "button",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      fontSize: ["1.5rem", "1.25rem", "1rem", "0.875rem"],
      borderRadius: "4px",
    },
    {
      name: "input",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      fontSize: ["1.25rem", "1rem", "0.875rem", "0.8rem"],
      borderRadius: "4px",
    },
    {
      name: "menu",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#045bac", "#045bac"],
      activeBgColors: ["#FFFFFF", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      fontSize: [
        "0.5rem",
        "0.6rem",
        "0.7rem",
        "0.8rem",
        "0.9rem",
        "1rem",
        "1.25rem",
        "1.5rem",
        "1.75rem",
        "2rem",
      ],
      borderRadius: "1px",
      padding: "1px",
    },
    {
      name: "table",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      fontSize: [
        "0.5rem",
        "0.6rem",
        "0.7rem",
        "0.8rem",
        "0.9rem",
        "1rem",
        "1.25rem",
        "1.5rem",
        "1.75rem",
        "2rem",
      ],
    },
    {
      name: "chart",
      colors: ["#393c45", "#045bac"],
      bgColors: ["#e8edf7", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"],
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#e8edf7", "#ffffff"],
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"],
      fontFamily: "Arial, sans-serif",
      fontSize: [
        "0.5rem",
        "0.6rem",
        "0.7rem",
        "0.8rem",
        "0.9rem",
        "1rem",
        "1.25rem",
        "1.5rem",
        "1.75rem",
        "2rem",
      ],
    },
  ],
};

const rjshCustomStyleSheet = `
/* Global base */
.rjsf {
  --rjsf-font-size: 0.8rem;
  --rjsf-spacing-y: 1px;  /* vertical gap */
  --rjsf-spacing-x: 1px;  /* horizontal gap */
  --rjsf-section-pad: 20px;
  /* Array specific spacing */
  --rjsf-array-gap-y: 0px;
  --rjsf-array-gap-x: 0px;
  --rjsf-array-pad: 1px;
  font-size: var(--rjsf-font-size);

  font-family: var(--rjsf-font-family, Arial, sans-serif) !important;
}
/* Labels/headers font-size */
.rjsf .field > label,
.rjsf .ui.header,
.rjsf .ui.label {
  font-size: calc(var(--rjsf-font-size) * 1.25) !important;
}

/* help/messages/buttons font-size */
.rjsf .field > label,
.rjsf .field-description,
.rjsf .help,
.rjsf .ui.message,
.rjsf .ui.button {
  font-size: var(--rjsf-font-size) !important;
}

/* Text/number/select/textarea/dropdown font-size */
.rjsf input[type="text"],
.rjsf input[type="number"],
.rjsf input[type="password"],
.rjsf input[type="email"],
.rjsf input[type="search"],
.rjsf textarea,
.rjsf select,
.rjsf .ui.input > input,
.rjsf .ui.textarea > textarea,
.rjsf .ui.selection.dropdown,
.rjsf .ui.selection.dropdown .menu > .item,
.rjsf .ui.dropdown .menu > .item,
.rjsf .ui.search.dropdown > input.search {
  font-size: var(--rjsf-font-size) !important;
}

/* Placeholder font-size */
.rjsf input::placeholder,
.rjsf textarea::placeholder {
  font-size: var(--rjsf-font-size) !important;
}

/* Spacing between elements */
.rjsf .ui.form .field {
  margin-bottom: var(--rjsf-spacing-y) !important;
}
.rjsf .ui.form .field > label {
  margin-bottom: 4px !important;
}

/* Group (row) spacing */
.rjsf .ui.form .fields {
  margin-left: calc(-1 * var(--rjsf-spacing-x)) !important;
  margin-right: calc(-1 * var(--rjsf-spacing-x)) !important;
}
.rjsf .ui.form .fields > .field {
  padding-left: var(--rjsf-spacing-x) !important;
  padding-right: var(--rjsf-spacing-x) !important;
  margin-bottom: var(--rjsf-spacing-y) !important;
}

/* Object/Array sections */
.rjsf .ui.segment,
.rjsf .ui.message,
.rjsf .ui.header {
  margin-bottom: var(--rjsf-spacing-y) !important;
}
.rjsf .ui.segment {
  padding: var(--rjsf-section-pad) !important;
}

/* Array item compact layout */
.rjsf .array-item {
  margin: var(--rjsf-array-gap-y) 0 !important;
}
.rjsf .array-item .ui.segment {
  padding: var(--rjsf-array-pad) !important;
  margin: 0 !important;
  box-shadow: none !important;
}
.rjsf .array-item .ui.form .field {
  margin-bottom: var(--rjsf-array-gap-y) !important;
}
.rjsf .array-item .ui.form .field:last-child {
  margin-bottom: 0 !important;
}
.rjsf .array-item .ui.form .fields {
  margin-left: calc(-1 * var(--rjsf-array-gap-x)) !important;
  margin-right: calc(-1 * var(--rjsf-array-gap-x)) !important;
}
.rjsf .array-item .ui.form .fields > .field {
  padding-left: var(--rjsf-array-gap-x) !important;
  padding-right: var(--rjsf-array-gap-x) !important;
  margin-bottom: 0 !important;
}
.rjsf .array-item .array-item-toolbox {
  margin-top: 0 !important;
}

/* Buttons */
.rjsf .ui.button {
  margin-right: var(--rjsf-spacing-x) !important;
  margin-bottom: var(--rjsf-spacing-y) !important;
}

/* Trim last margins */
.rjsf .ui.form .field:last-child,
.rjsf .array-item:last-child,
.rjsf .ui.segment:last-child,
.rjsf .ui.message:last-child,
.rjsf .ui.header:last-child {
  margin-bottom: 0 !important;
}
`;

/** 사용 예시 */
export default function NexNodeForm({ onSubmit }: any) {
  const [formData, setFormData] = React.useState<any>(themeDataSample);

  const transformErrors = (errors: any[]) =>
    errors.map((err) => {
      if (err.name === "required" && err.params?.missingProperty === "name") {
        return { ...err, message: "이름은 반드시 입력해야 합니다." };
      }
      if (err.name === "required" && err.params?.missingProperty === "type") {
        return { ...err, message: "타입은 반드시 선택해야 합니다." };
      }
      return err;
    });

  const handleFormChange = (newFormData: any) => {
    setFormData(newFormData);
  };
  return (
    <NexDiv
      width="100%"
      height="100%"
      overflow="auto"
      padding="8px"
      fontSize="1rem"
      direction="column"
      style={
        { "--rjsh-custom-styles": rjshCustomStyleSheet } as React.CSSProperties
      }
    >
      <style>{rjshCustomStyleSheet}</style>
      <NexJsonForm
        schema={themeSchema}
        uiSchema={uiSchema}
        validator={validator}
        formData={formData}
        onSubmit={onSubmit}
        onChange={(e) => handleFormChange(e.formData)}
        liveValidate
        transformErrors={transformErrors}
      />
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </NexDiv>
  );
}
