export function format2Json(format: any): any {
  const features = format.features || [];
  let result: any = {};
  for (const feature of features) {
    if (
      feature.featureType === "attributes" &&
      Array.isArray(feature.attributes)
    ) {
      // 복합 속성 객체
      let groupObj: any = {};
      for (const attr of feature.attributes) {
        groupObj[attr.name] = "";
      }
      result[feature.name] = groupObj;
    } else if (feature.featureType === "literals") {
      // select box 입력 필드 (literal.value)
      if (
        Array.isArray(feature.literals)
        // && feature.literals.find((lit: any) => lit.value === literalRow)
      ) {
        result[feature.name] = "";
      } else {
        console.warn(
          `Literal value not found in feature feature=${JSON.stringify(features, null, 2)}`
        );
      }
    } else if (
      feature.featureType === "records" &&
      Array.isArray(feature.records)
    ) {
      result[feature.name] = [];
    } else {
      // 일반 속성
      result[feature.name] = "";
    }
  }
  return result;
}

/*
function buildTreeData(odata: any[], format: any): any {
  let result: any = null;

  if (format.type === "format") {
    result = odata.map((row) => {
      return parseCsv2Json(row, format.features);
    });
  } else if (format.type === "folder" && format.children) {
    const formatMap: Record<string, any> = {};
    format.children.forEach((child: any) => (formatMap[child.name] = child));
    const typeIndex = format.children[0].features.findIndex(
      (f: any) => f.name === "type"
    );
    if (typeIndex < 0) {
      console.warn(
        `NexDataStore: No "type" feature found in format: ${JSON.stringify(format, null, 2)}`
      );
      return [];
    }
    const nodes = odata.map((row) => {
      const type = row[typeIndex];
      const childFormat = format.children.find((fmt: any) => fmt.name === type);
      if (!childFormat) {
        console.warn(
          `NexDataStore: Unknown type "${type}" in row: ${JSON.stringify(row)}`
        );
        return null; // 해당 타입이 없으면 null 반환
      }
      return parseCsv2Json(row, childFormat.features);
    });

    const virtualRoot: any = { children: [] };
    for (const node of nodes) {
      // path를 "/"와 "." 모두 고려하여 분리
      // path를 "/"와 "." 모두 고려하여 분리
      // 예: "foo/bar.baz/qux" -> [{value: "foo", type: "segment"}, {value: "bar", type: "segment"}, {value: "baz", type: "attribute"}, {value: "qux", type: "segment"}]
      // path를 "/"와 "." 기준으로 분리하여 parentSegments 배열 생성
      const parentSegments: any[] = [];
      if (node.path && node.path.length > 0) {
        node.path
          .split("/")
          .filter(Boolean)
          .forEach((part: any) => {
            part
              .split(".")
              .filter(Boolean)
              .forEach((seg: string, idx: number) => {
                parentSegments.push({
                  name: seg,
                  delimiter: idx === 0 ? "/" : ".",
                });
              });
          });
      } else {
        console.log(
          `buildTreeData() path가 없음! node=${JSON.stringify(node, null, 2)}`
        );
        continue;
      }

      //console.log(`parentSegments: ${JSON.stringify(parentSegments, null, 2)}`);
      const name = node.name;

      const lastSeg =
        parentSegments.length > 0
          ? parentSegments[parentSegments.length - 1]
          : { name: "", delimiter: "" };
      // lastSeg에 점이 있으면 마지막 점 이후의 값을 추출, 없으면 그대로 사용

      if (lastSeg.name !== name) {
        console.warn(
          `buildTreeData() path와 name 불일치! path="${node.path}", name="${name}"`
        );
        continue; // 트리에 추가하지 않음
      }

      //const config = this.keyFieldMap[node.type] || {};
      const format = formatMap[node.type] || {};

      //const childKey = hasDot ? "attributes" : "children"; // 기본 children 키

      let cursor = virtualRoot;
      const childKey = lastSeg.delimiter === "." ? "attributes" : "children";
      for (const seg of parentSegments.slice(0, -1)) {
        const children =
          seg.delimiter === "." ? cursor.attributes : cursor.children;
        let next = children.find((n: any) => n.name === seg.name);
        if (!next) {
          next = { name: seg.name, children: [] };
          children.push(next);
        }
        cursor = next;
      }

      cursor[childKey] = cursor[childKey] || [];
      cursor[childKey].push(node);
    }

    result = filterValidNodes(virtualRoot.children);
  }
  return result;
}
  */
