export function parseCsv2Json(csvRow: any[], features: any[]): any {
  let result: any = {};
  let idx = 0;
  for (const feature of features) {
    if (
      feature.featureType === "attributes" &&
      Array.isArray(feature.attributes)
    ) {
      // 복합 속성 객체
      let groupObj: any = {};
      for (const attr of feature.attributes) {
        groupObj[attr.name] = csvRow[idx++];
      }
      result[feature.name] = groupObj;
    } else if (feature.featureType === "literals") {
      const literalRow = csvRow[idx++];
      if (
        Array.isArray(feature.literals) &&
        feature.literals.find((lit: any) => lit.value === literalRow)
      ) {
        result[feature.name] = literalRow;
      } else {
        //console.warn(
        //  `Literal value not found in feature literals: ${csvRow}, feature=${JSON.stringify(features, null, 2)}`
        //);
      }
    }
    // for admin format 데이터를 구성하기 위한 records
    else if (
      feature.featureType === "records" &&
      Array.isArray(feature.records)
    ) {
      // *** "records"는 N개씩 반복 읽어서 배열로 만듦 ***
      if (idx < csvRow.length) {
        const recordArr = [];
        const records = feature.records;
        if (Array.isArray(csvRow[idx])) {
          // 배열로 되어 있으면 바로 배열로 처리
          const recordsRow = csvRow[idx++];
          for (let i = 0; i < recordsRow.length; ) {
            const recordObj: any = {};
            for (
              let featureIndex = 0;
              featureIndex < records.length;
              featureIndex++
            ) {
              if (i >= recordsRow.length) break;
              const recordName = records[featureIndex];
              recordObj[recordName] = recordsRow[i++];
            }

            if (Object.keys(recordObj).length > 0) {
              recordArr.push(recordObj);
            }
            //recordArr.push(recordObj);
          }
        } else {
          console.warn(
            `Record row is not an array: ${JSON.stringify(csvRow[idx], null, 2)}`
          );
        }

        result[feature.name] = recordArr;
      }
    } else {
      // 일반 속성
      result[feature.name] = csvRow[idx++];
    }
  }
  return result;
}

// 1. 임시값 생성 헬퍼
function makeSampleValue(featureType: string, name: string, idx: number = 0) {
  switch (featureType) {
    case "STRING":
      return `${name || "string"}_${idx}`;
    case "UINT32":
    case "INT64":
      return idx;
    case "BOOLEAN":
      return idx % 2 === 0 ? true : false;
    case "literals":
      return "LITERAL"; // 실제 값은 literals 목록에서 고를 수도 있음
    case "attributes":
    case "records":
      return {}; // placeholder
    default:
      return `${name || "val"}_${idx}`;
  }
}

// 2. 샘플 데이터 생성
export function makeSampleJsonAndCsv(
  dir: string,
  name: string,
  features: any[]
): {
  json: any;
  csv: any[];
} {
  let json: any = {};
  let csv: any[] = [];
  let idx = 1;

  for (const feature of features) {
    if (
      feature.featureType === "attributes" &&
      Array.isArray(feature.attributes)
    ) {
      // 복합 객체
      //const group = makeSampleJsonAndCsv(feature.attributes, depth + 1);

      json[feature.name] = {}; // group.json;
      for (const attr of feature.attributes) json[feature.name][attr.name] = "";
    } else if (
      feature.featureType === "records" &&
      Array.isArray(feature.records)
    ) {
      // 레코드 배열
      // 샘플: 2개 생성
      let csvArr: any[] = [];
      let jsonArr: any[] = [];
      let obj: any = {};

      // 1개만 만듬
      const count = 1;
      for (let i = 0; i < count; i++) {
        for (const rec of feature.records) {
          obj[rec] = "";
          csvArr.push("");
        }
        jsonArr.push(obj);
      }
      csv.push(csvArr);
      json[feature.name] = jsonArr;
    } else if (
      feature.featureType === "literals" &&
      Array.isArray(feature.literals)
    ) {
      // literals은 배열로 2세트 생성
      json[feature.name] = feature.literals[0].value;
      csv.push(feature.literals[0].value);
    } else {
      // 일반 필드
      if (feature.name === "path") {
        json[feature.name] = `${dir}/${name}`;
        csv.push(`${dir}/${name}`);
      } else if (feature.name === "name") {
        json[feature.name] = name;
        csv.push(name);
      } else {
        csv.push("");
      }
    }
  }
  return { json, csv };
}

/*
// formatList는 websection/contents/selectors 등 모든 format 객체 배열
export function buildKeyFieldsMap(formatList: any[]): KeyFieldsMap {
  const map: KeyFieldsMap = {};
  for (const fmt of formatList) {
    //console.log(`buildKeyFieldsMap: ${fmt.name}`);
    map[fmt.name] = {
      field: featuresToKeyFields(fmt.features),
      child: "children", //guessChildKey(fmt.features),
      property: fmt.isProperty || false, // property 모드 여부
    };
  }
  return map;
}

export function guessChildKey(features: any[]): string {
  const arrFeature = features.find(
    (f) =>
      Array.isArray(f) ||
      (typeof f === "object" &&
        f.type === "feature" &&
        (f.featureType === "records" ||
          f.featureType === "record" ||
          f.featureType === "literals"))
  );
  if (arrFeature && arrFeature.name) return arrFeature.name;
  // 명시적으로 "contents", "selectors" 등으로 지정하고 싶으면 features에 그 키로 넣으면 됨
  return "children"; // fallback
}

export const buildCSVFromTree = (
  tree: any[],
  keyFieldsMap: KeyFieldsMap
): any[][] => {
  const csvRows: any[][] = [];
  const buildRows = (nodes: any[], parentPath = "") => {
    for (const node of nodes) {
      const curPath =
        parentPath === "" ? `/${node.name}` : `${parentPath}/${node.name}`;
      const row = [node.type, parentPath, ...Object.values(node)];
      csvRows.push(row);
      if (node.children && node.children.length > 0) {
        buildRows(node.children, curPath);
      }
    }
  };
  buildRows(tree);
  return csvRows;
};

export function findNodeByPath(
  nodes: any[],
  targetPath: string,
  parentPath = ""
): any | null {
  for (const node of nodes) {
    const curPath =
      parentPath === "" ? `/${node.name}` : `${parentPath}/${node.name}`;
    if (curPath === targetPath) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeByPath(node.children, targetPath, curPath);
      if (found) return found;
    }
  }
  return null;
}

// CSV-like array: [type, parentPath, ..., name, ...]
export function findRowBySelectedPath(
  data: any[][],
  selectedPath: string
): any[] | null {
  // 경로 맵을 만들어서 빠르게 parent를 따라가며 전체 경로를 생성
  const pathMap: Record<string, any[]> = {};
  data.forEach((row) => {
    const name = row[4];
    pathMap[name] = row;
  });

  for (const row of data) {
    let cur = row;
    let fullPath = "";
    // parent path가 있으면 누적
    while (cur) {
      const name = cur[4];
      fullPath = "/" + name + fullPath;
      const parentName = cur[1];
      cur = pathMap[parentName];
    }
    if (fullPath === selectedPath) return row;
  }
  return null;
}

export function buildTreeFromCSV_1(
  csvRows: any[][],
  keyFieldsMap: KeyFieldsMap
) {
  const nodes: any[] = csvRows.map((row) => {
    const type = row[0];
    const keyFields = keyFieldsMap[type]?.field;
    if (!keyFields) throw new Error(`Unknown type: ${row}`);

    let obj: any = { type };
    let i = 0;
    for (let kf of keyFields) {
      if (kf.type === "record") {
        obj[kf.key] = {};
        for (let akf of kf.records || []) obj[kf.key][akf.key] = row[i++];
      } else if (kf.type === "records" || kf.type === "literals") {
        obj[kf.key] = [];
        while (i < row.length) {
          let attrObj: any = {};
          for (let akf of kf.records || []) attrObj[akf.key] = row[i++];
          if (!attrObj[kf.records![0].key]) break;
          obj[kf.key].push(attrObj);
        }
      } else if (kf.type === "child") {
        obj[kf.key] = [];
      } else {
        obj[kf.key] = row[i++];
      }
    }
    return obj;
  });

  // 트리 빌드 (parent path + name 기반)
  const pathMap: Record<string, any> = {};
  const virtualRoot: any = { children: [] };

  for (const node of nodes) {
    // 1. parentPath + name → 풀경로 + 속성체인
    const parentSegments = node.path
      ? node.path.split("/").filter(Boolean)
      : [];
    const nameParts = node.name.split(".");
    const mySeg = nameParts[0];
    const attrChain = nameParts.slice(1);
    const nodePath = [...parentSegments, mySeg].join("/");

    pathMap[nodePath] = node;

    // 2. 부모 노드 찾기
    const parentPath = parentSegments.join("/");
    const isRoot = !parentPath;

    if (!isRoot && pathMap[parentPath]) {
      const parent = pathMap[parentPath];
      const childKey = keyFieldsMap[parent?.type]?.child ?? "children";

      if (attrChain.length > 0) {
        // 중첩 속성 트리
        let mainNodeArr = parent[childKey] || (parent[childKey] = []);
        let mainNode = mainNodeArr.find(
          (n: any) => n.name === mySeg || n.path === nodePath
        );
        if (!mainNode) {
          mainNode = { name: mySeg, path: nodePath };
          mainNodeArr.push(mainNode);
        }
        let current = mainNode;
        for (let i = 0; i < attrChain.length - 1; i++) {
          const attr = attrChain[i];
          if (!current[attr]) current[attr] = {};
          current = current[attr];
        }
        current[attrChain[attrChain.length - 1]] = node;
      } else {
        // 일반 자식
        if (!parent[childKey]) parent[childKey] = [];
        parent[childKey].push(node);
      }
    } else {
      virtualRoot.children.push(node);
    }
  }
  return virtualRoot.children;
}

export function buildTreeFromCSV1(
  csvRows: any[][],
  keyFieldsMap: KeyFieldsMap
) {
  // 1. CSV row -> 객체화
  const nodes: any[] = csvRows.map((row) => {
    const type = row[0];
    const keyFields = keyFieldsMap[type]?.field;
    if (!keyFields) throw new Error(`Unknown type: ${row}`);

    let obj: any = { type };
    let i = 0;
    for (let kf of keyFields) {
      if (kf.type === "record") {
        obj[kf.key] = {};
        for (let akf of kf.records || []) obj[kf.key][akf.key] = row[i++];
      } else if (kf.type === "records" || kf.type === "literals") {
        obj[kf.key] = [];
        while (i < row.length) {
          let attrObj: any = {};
          for (let akf of kf.records || []) attrObj[akf.key] = row[i++];
          if (!attrObj[kf.records![0].key]) break;
          obj[kf.key].push(attrObj);
        }
      } else if (kf.type === "child") {
        obj[kf.key] = [];
      } else {
        obj[kf.key] = row[i++];
      }
    }
    return obj;
  });

  // 2. 트리 빌드 (virtualRoot 사용)
  const pathMap: Record<string, any> = {};
  const virtualRoot: any = { children: [] };

  for (const node of nodes) {
    let path = node.path || "";
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    // path에서 . 있으면 중첩 속성 처리 준비
    const segments = path.split("/");
    let lastSeg = segments[segments.length - 1];
    let attrChain: string[] = [];
    if (lastSeg && lastSeg.includes(".")) {
      const parts = lastSeg.split(".");
      segments[segments.length - 1] = parts[0];
      attrChain = parts.slice(1); // e.g. ["a", "b", "c"]
    }
    const nodePath = segments.join("/");
    pathMap[nodePath] = node;

    // 부모 경로
    let parentPath = nodePath.substring(0, nodePath.lastIndexOf("/"));
    if (parentPath.length > 1 && parentPath.endsWith("/"))
      parentPath = parentPath.slice(0, -1);
    const isRoot = !parentPath || parentPath === "/";

    if (!isRoot && pathMap[parentPath]) {
      const parent = pathMap[parentPath];
      const childKey = keyFieldsMap[parent?.type]?.child ?? "children";

      // 중첩 속성 (dot) 트리 분기
      if (attrChain.length > 0) {
        const mainSeg = segments[segments.length - 1];
        let mainNodeArr = parent[childKey] || (parent[childKey] = []);
        let mainNode = mainNodeArr.find(
          (n: any) => n.name === mainSeg || n.path === nodePath
        );
        if (!mainNode) {
          mainNode = { name: mainSeg, path: nodePath };
          mainNodeArr.push(mainNode);
        }
        // attrChain 따라 내려가서 마지막에 node 할당
        let current = mainNode;
        for (let i = 0; i < attrChain.length - 1; i++) {
          const attr = attrChain[i];
          if (!current[attr]) current[attr] = {};
          current = current[attr];
        }
        current[attrChain[attrChain.length - 1]] = node;
      } else {
        // 일반 자식 처리
        if (!parent[childKey]) parent[childKey] = [];
        parent[childKey].push(node);
      }
    } else {
      // 진짜 root는 virtualRoot.children에만 담음 ("" 또는 "/"만)
      virtualRoot.children.push(node);
    }
  }

  return virtualRoot.children;
}

export function buildTreeFromCSV_old(
  csvRows: any[][],
  keyFieldsMap: KeyFieldsMap
) {
  // 1. 각 row를 객체로 파싱
  const nodes: any[] = csvRows.map((row) => {
    const type = row[0];
    console.log(`Parsing type: ${type}`);
    const keyFields = keyFieldsMap[type].field;
    if (!keyFields) throw new Error(`Unknown type: ${row}`);

    let obj: any = { type };
    let i = 0;
    for (let kf of keyFields) {
      if (kf.type === "record") {
        obj[kf.key] = {};
        for (let akf of kf.records || []) {
          obj[kf.key][akf.key] = row[i++];
        }
      } else if (kf.type === "records" || kf.type === "literals") {
        obj[kf.key] = [];
        while (i < row.length) {
          let attrObj: any = {};
          for (let akf of kf.records || []) {
            attrObj[akf.key] = row[i++];
          }
          // break if no value for the first attr
          if (
            attrObj[kf.records![0].key] == null ||
            attrObj[kf.records![0].key] === ""
          )
            break;
          obj[kf.key].push(attrObj);
        }
      } else if (kf.type === "child") {
        obj[kf.key] = [];
      } else {
        obj[kf.key] = row[i++];
      }
    }
    //console.log(`Parsed node: ${JSON.stringify(obj, null, 2)}`);
    return obj;
  });

  // 2. 경로 맵핑 및 트리 구조화
  const pathMap: Record<string, any> = {};
  const rootNodes: any[] = [];
  for (const node of nodes) {
    let path = node.path || "";
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    // .이 있는지, 여러 번인지 파싱
    const segments = path.split("/");
    let lastSeg = segments[segments.length - 1];
    let attrChain: string[] = [];
    if (lastSeg && lastSeg.includes(".")) {
      const parts = lastSeg.split(".");
      segments[segments.length - 1] = parts[0];
      attrChain = parts.slice(1); // ["a","b","c"] 처럼
    }
    const nodePath = segments.join("/");
    pathMap[path] = node;
    pathMap[nodePath] = pathMap[nodePath] || node; // 부모 노드 path 등록

    // 부모 경로
    let pureParentPath = nodePath.substring(0, nodePath.lastIndexOf("/"));
    if (pureParentPath.length > 1 && pureParentPath.endsWith("/")) {
      pureParentPath = pureParentPath.slice(0, -1);
    }

    if (pureParentPath && pathMap[pureParentPath]) {
      const parent = pathMap[pureParentPath];
      const childKey = keyFieldsMap[parent?.type]?.child ?? "children";

      // (중첩 속성 트리 처리)
      if (attrChain.length > 0) {
        // 1. mainSeg 노드(children에서 찾거나 생성)
        const mainSeg = segments[segments.length - 1];
        let mainNodeArr = parent[childKey];
        if (!mainNodeArr) {
          mainNodeArr = [];
          parent[childKey] = mainNodeArr;
        }
        let mainNode = mainNodeArr.find(
          (n: any) => n.name === mainSeg || n.path === nodePath
        );
        if (!mainNode) {
          mainNode = { name: mainSeg, path: nodePath };
          mainNodeArr.push(mainNode);
        }
        // 2. attrChain 따라 중첩 속성 트리 생성
        let current = mainNode;
        for (let i = 0; i < attrChain.length - 1; i++) {
          const attr = attrChain[i];
          if (!current[attr]) current[attr] = {};
          current = current[attr];
        }
        const lastAttr = attrChain[attrChain.length - 1];
        current[lastAttr] = node;
      } else {
        // 일반 자식 배열 처리
        if (!parent[childKey]) parent[childKey] = [];
        parent[childKey].push(node);
      }
    } else {
      rootNodes.push(node);
    }
  }
  // 최상위만 반환
  return rootNodes;
}
*/
