import {
  defaultTheme,
  defaultThemeUser,
  NexTheme,
  NexThemeUser,
} from "./NexTheme";

export enum NexNodeType {
  FOLDER = "folder",
  PROJECT = "project",

  FORMAT = "format",
  FEATURE = "feature",

  PROCESSOR = "processor",

  STORE = "store",

  SYSTEM = "system",
  ELEMENT = "element",

  WEBAPPLET = "webapplet",

  //WEBPAGE = "webpage",
  WEBSECTION = "websection",

  WEBSTYLE = "webstyle", // WEBSTYLE attribute : color, bgColor, ...

  WEBUSER = "webuser",
}

export interface NexNode {
  name: string; //"Enter Name of Object",
  dispName?: string; //"Enter Display Name of Object",
  description?: string; //"Enter Description of Object",
  type: string; //"Enter Type of Object", // e.g., "project", "system", "format", "storage"
  //children?: NexNode[]; // Optional array of child objects (could be systems, formats, etc.)

  //formats?: string; // Optional format path for the object, e.g., "system-name/format-path"
  //stores?: string; // Optional store path for the object, e.g., "system-name
  //icon?: string; //"Enter Icon for Object",
  //color?: string; //"Enter Color for Object",
  //size?: number; // Optional size property for the object, e.g., for storage size
  //direction?: "row" | "column"; // Optional direction property for layout, e.g., "row" or "column"
  [key: string]: any; // Additional properties can be added dynamically
}

export interface NexProject extends NexNode {
  systems: NexSystem[]; // Array of systems associated with the project

  formats: NexFormat[]; // Array of formats associated with the project
  stores: NexStore[];
  processors: NexProcessor[]; // Array of processors associated with the project

  webpages: NexNode[]; // Array of webpages associated with the project
  webthemes: NexTheme[]; // Array of webthemes associated with the project
  webthemeUsers: NexThemeUser[]; // Array of webtheme users associated with the project
  applets: any[]; // Array of applets associated with the project
}

export interface NexFolder extends NexNode {
  children: NexNode[]; // Array of child objects (could be systems, formats,
}

export interface NexSystem extends NexNode {
  address: {
    ip: string; //"Enter IP Address for System API",
    port: number; //"Enter Port for System API",
  };
  hdfs: {
    ip: string; //"Enter IP Address for HDFS",
    port: string; //"Enter Port for HDFS",
    path: string; //"Enter Root Path for HDFS",
  };
  db: {
    ip: string; //"Enter IP Address for Database",
    port: number; //"Enter Port for Database",
    id: string; //"Enter ID for Database",
    passwd: string; //"Enter Password for Database",
    name: string; //"Enter Name for Database",
  };
}

export interface NexFormat extends NexNode {
  isTree: boolean; // Whether this element is a tree structure
  volatility: "static" | "mutable" | "immutable"; // Volatility of the element
  features: NexNode[]; // Array of features associated with the format // feature or folder
}

export interface NexFeature extends NexNode {
  isKey?: boolean; // Whether this feature is a key
  featureType?: string; // Type of the feature, e.g., "UINT32", "STRING", etc.
  children?: NexNode[]; // Array of child objects (could be systems, formats,
}

export interface NexElement extends NexNode {
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

export interface NexStore extends NexNode {
  // Additional properties specific to stores can be added here
}

export interface NexProcessor extends NexNode {
  // Additional properties specific to processors can be added here
}

export const initObjects = {
  [NexNodeType.PROJECT]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.PROJECT,
    systems: [],
    formats: [],
    stores: [],
    processors: [],
    webpages: [],
    webthemes: [defaultTheme],
    webthemeUsers: [defaultThemeUser],
    applets: [],
  } as NexProject,

  [NexNodeType.FOLDER]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FOLDER,
    children: [],
  } as NexFolder,
  [NexNodeType.SYSTEM]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.SYSTEM,

    address: { ip: "", port: 0 },
    hdfs: { ip: "", port: "", path: "" },
    db: { ip: "", port: 0, id: "", passwd: "", name: "" },
  } as NexSystem,
  [NexNodeType.FORMAT]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FORMAT,
    isTree: false,
    volatility: "immutable",
    features: [],
  } as NexFormat,
  [NexNodeType.FEATURE]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.FEATURE,
    isKey: false,
    featureType: "",
    icon: "",
    color: "",
  } as NexFeature,
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
  } as NexElement,
  [NexNodeType.STORE]: {
    name: "",
    dispName: "",
    description: "",
    type: NexNodeType.STORE,
    icon: "",
    color: "",
  } as NexStore,
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
export const fieldPaths = Object.values(initObjects).map((obj: any) =>
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
