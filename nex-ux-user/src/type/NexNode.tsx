import { NexTheme, NexThemeStyle, NexThemeUser } from "./NexTheme";

export enum NexNodeType {
  FOLDER = "folder",

  FORMAT = "format",
  FEATURE = "feature",

  PROCESSOR = "processor",

  STORE = "store",

  SYSTEM = "system",
  ELEMENT = "element",
  CONTENTS = "contents",

  APPLET = "applet",

  //WEBPAGE = "webpage",
  SECTION = "section",

  THEME = "theme", // THEME attribute : color, bgColor, ...

  USER = "user",
}

export enum NexFeatureType {
  INDEX = "INDEX", // 자동 증가 숫자
  UINT8 = "UINT8",
  UINT16 = "UINT16",
  UINT32 = "UINT32",
  UINT64 = "UINT64",
  INT8 = "INT8",
  INT16 = "INT16",
  INT32 = "INT32",
  INT64 = "INT64",
  FLOAT = "FLOAT",
  DOUBLE = "DOUBLE",
  STRING = "STRING",
  PATH = "PATH", // 경로 /test1/.../node-name
  JSON = "JSON",
  BOOLEAN = "BOOLEAN",
  BINARY = "BINARY",
  DATE = "DATE",
  TIME_SEC = "TIME_SEC",
  TIME_MSEC = "TIME_MSEC",
  TIME_USEC = "TIME_USEC",
  TIME_HOUR = "TIME_HOUR",
  TIMESTAMP = "TIMESTAMP",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  ADDRESS = "ADDRESS",
  URL = "URL",
  LITERALS = "LITERALS", // 문자열 목록 중에서 선택
  RECORDS = "RECORDS", // 레코드 목록 중에서 선택
  ATTRIBUTES = "ATTRIBUTES", // key-value 쌍의 속성 목록
}

export interface NexNode {
  name: string; //"Enter Name of Object",
  dispName?: string | null; //"Enter Display Name of Object",
  description?: string | null; //"Enter Description of Object",
  type: NexNodeType; //"Enter Type of Object", // e.g., "project", "system", "format", "storage"
  //children?: NexNode[]; // Optional array of child objects (could be systems, formats, etc.)

  icon?: string | null; //"Enter Icon for Object",
  color?: string | null; //"Enter Color for Object",
  //size?: number; // Optional size property for the object, e.g., for storage size
  //direction?: "row" | "column"; // Optional direction property for layout, e.g., "row" or "column"
  //[key: string]: any; // Additional properties can be added dynamically
}

export interface NexProjectNode extends NexNode {}

export interface NexFolderNode extends NexNode {
  children: NexNode[]; // Array of child objects (could be systems, formats,
}

export interface NexSystemNode extends NexNode {
  address: {
    ip: string; //"Enter IP Address for System API",
    port: string; //"Enter Port for System API",
  };
  hdfs: {
    ip: string; //"Enter IP Address for HDFS",
    port: string; //"Enter Port for HDFS",
    path: string; //"Enter Root Path for HDFS",
  };
  db: {
    ip: string; //"Enter IP Address for Database",
    port: string; //"Enter Port for Database",
    user: string; //"Enter User ID for Database",
    password: string; //"Enter Password for Database",
    database: string; //"Enter Name for Database",
  };
}

export interface NexFeatureNode extends NexNode {
  isKey: boolean; // Whether this feature is a key
  featureType: NexFeatureType; // Type of the feature, e.g., "UINT32", "STRING", etc.
  literal?: any[];
  children?: NexNode[]; // Array of child objects (could be systems, formats,
}

export interface NexFormatNode extends NexNode {
  isTree?: boolean; // Whether this element is a tree structure
  //volatility: "static" | "mutable" | "immutable"; // Volatility of the element
  features: NexFeatureNode[]; // Array of features associated with the format // feature or folder
}

export enum NexRecordStorage {
  MEMORY = "memory",
  DISK = "disk",
  HDFS = "hdfs",
}

export enum NexRecordUnit {
  NONE = "NONE",
  SEC = "SEC",
  MIN = "MIN",
  HOUR = "HOUR",
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum NexRecordBlock {
  NONE = "NONE",
  MIN = "MIN",
  HOUR = "HOUR",
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum NexRecordExpireUnit {
  NONE = "NONE",
  SEC = "SEC",
  MIN = "MIN",
  HOUR = "HOUR",
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export interface NexStoreNode extends NexNode {
  // Additional properties specific to stores can be added here
  record: {
    storage: NexRecordStorage; // memory, disk, hdfs
    nature: "static"; //  정적 데이터 : static,  시간단위데이터: temporary
    unit: NexRecordUnit; // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
    block: NexRecordBlock; // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
    expire: "-1"; // (sec 단위)  0: 임시 저장, -1: 영구 저장,
    expireUnit: NexRecordExpireUnit; // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
    allowDuplication: boolean; // 중복 허용 여부
    allowKeepValue: boolean; // 값 유지 여부
  };
}

export interface NexProcessorNode extends NexNode {
  // Additional properties specific to processors can be added here
}

export interface NexElementNode extends NexNode {
  //isTree?: boolean; // Whether this element is a tree structure
  //volatility?: "static" | "mutable" | "immutable"; // Volatility of the element

  format: string; // 데이터 유형 (경로)
  store: string; // 보관 정책 (경로) => status

  processor: string; // 데이터 수집 및 처리 모듈(경로)
  processingInterval: number; // 0: 초기 한번 수집
  processingUnit:
    | "NONE"
    | "MSEC"
    | "SEC"
    | "MIN"
    | "HOUR"
    | "DAY"
    | "MONTH"
    | "YEAR"; // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
  source: string; // Source paths for the element, e.g., ["/system-name/element-path1", "/system-name/element-path2"]
}

export type NexCondition = {
  key: string; // Feature name for the condition
  feature: string; // Feature value for the condition
  method:
    | "match"
    | "path-match"
    | "starts-with"
    | "ends-with"
    | "contains"
    | "greater-than"
    | "less-than"; // Condition method
};

export type NexSelection = {
  key: string; // Feature key for the selection
  feature: string; // Feature name for the selection
};

export interface NexContentsNode extends NexNode {
  element: string; // Element path, e.g., "/system-name/element-path"
  condition?: NexCondition[]; // Conditions for the content
  selection?: NexSelection[]; // Selections for the content
}

export interface NexAppletNode extends NexNode {
  applet: string; // Applet path, e.g., "/applet-path"
}

export interface NexWebSectionNode extends NexNode {
  //webpage: string; // Webpage path, e.g., "/webpage-path"
  size?: string | null; // 같은 상위 섹션내의 section 크기 비율 (1, 2, 3, ...)
  direction?: "row" | "column"; // 섹션내부 정렬 방향 (row, column)
  padding?: string; // 섹션내부 여백 (8px, 10px, ...)
  isRoutes?: boolean; // 하위 섹션이 라우팅 섹션인지 여부
  route?: string | null; // 페이지 라우팅 경로, e.g., "page-route"
  applet?: string | null; // Applet path, e.g., "/applet-path"
  contents?: string[] | null; // Contents path list, e.g., ["/system-name/element-path1", "/system-name/element-path2"]
  children?: NexWebSectionNode[]; // Array of child sections
}

export interface NexWebThemeNode extends NexNode {
  theme: NexTheme;
}

export interface NexWebThemeUserNode extends NexNode {
  user: NexThemeUser; // User ID associated with the theme
}

export const initNodes = {
  [NexNodeType.FOLDER]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FOLDER,
    children: [],
  } as NexFolderNode,
  [NexNodeType.SYSTEM]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.SYSTEM,

    address: { ip: "", port: "" },
    hdfs: { ip: "", port: "", path: "" },
    db: { ip: "", port: "", user: "", password: "", database: "" },
  } as NexSystemNode,
  [NexNodeType.FORMAT]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FORMAT,
    isTree: false,
    volatility: "immutable",
    features: [],
  } as NexFormatNode,
  [NexNodeType.FEATURE]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FEATURE,
    isKey: false,
    featureType: NexFeatureType.STRING,
    icon: "",
    color: "",
  } as NexFeatureNode,
  [NexNodeType.ELEMENT]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.ELEMENT,
    icon: "",
    color: "",
    format: "", // 데이터 유형 (경로)
    store: "", // 보관 정책 (경로) => status
    processor: "", // 데이터 수집 및 처리 모듈(경로)
    processingInterval: 0, // 0: 초기 한번 수집
    processingUnit: "NONE", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
    source: "",
  } as NexElementNode,
  [NexNodeType.STORE]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.STORE,
    icon: "",
    color: "",
  } as NexStoreNode,
};

/* 프로젝트, 카테고리, 시스템명, 출력이름, 설명, 아이콘, 컬러 */
function extractPathsFromObject(obj: any, prefix = ""): string[] {
  const paths: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...extractPathsFromObject(value, newPrefix));
    } else {
      paths.push(newPrefix);
    }
  }
  return paths;
}
/* 프로젝트, 시스템정보 */

// If you want to use fieldPaths, do something with it, otherwise remove it.
// Example: Log all field paths for debugging
export const fieldPaths = Object.values(initNodes).map((obj: any) =>
  extractPathsFromObject(obj)
);

/**
 * Converts a CSV-like array to an object tree based on a given interface structure.
 * @param csvRows The CSV-like array.
 * @param mapFn A function that maps a row to the desired interface structure.
 * @returns An object tree.
 */
/*
export function buildTreeFromCsv<T>(
  csvRows: any[][],
  mapFn: (row: any[]) => T,
  keyFn: (row: any[]) => string
): Record<string, T> {
  const tree: Record<string, T> = {};
  csvRows.forEach((row) => {
    tree[keyFn(row)] = mapFn(row);
  });
  return tree;
}
*/

// Example for NexSystem
// TypeScript에서는 런타임에 인터페이스 정보를 알 수 없으므로, key 값을 인터페이스에서 직접 추출할 수 없습니다.
// 하지만, key로 사용할 필드명을 제네릭 파라미터로 받아서 타입 안전하게 처리할 수 있습니다.

export function buildTreeFromCsvByKey<T, K extends keyof T>(
  csvRows: any[][],
  mapFn: (row: any[]) => T,
  keyField: K
): Record<string, T> {
  const tree: Record<string, T> = {};
  csvRows.forEach((row) => {
    const obj = mapFn(row);
    const key = obj[keyField];
    tree[String(key)] = obj;
  });
  return tree;
}

// 다른 인터페이스 구조도 mapFn만 바꿔서 변환 가능
