export interface NexTreeNodeObject {
  path: string; // 표준화된 절대경로 (루트는 "")
  children?: NexTreeNodeObject[];
  data?: any; // 해당 경로의 json-data
}

export interface NexNodeTree {
  data: NexTreeNodeObject[] | undefined; // 최상위 노드들
  getNode: (path: string) => NexTreeNodeObject | undefined; // path -> node
}

/** 경로 표준화: "", "/" -> ""; "/a/" -> "/a" */
function normalizePath(p?: string): string {
  if (!p || p === "/") return "";
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

/** path 배열 -> 트리/맵 빌드 */
export function buildNexTree(datas: Array<[number, string, any]>): NexNodeTree {
  const virtualRoot: NexTreeNodeObject = {
    path: "",
    data: null,
    children: [],
  };
  const pathMap: Record<string, NexTreeNodeObject> = { "": virtualRoot };

  for (const row of datas) {
    const [idx, rawPath, data] = row;
    const path = normalizePath(rawPath);
    const segments = path.split("/").filter(Boolean);

    let cursor = virtualRoot;
    let accPath = ""; // 누적 경로(표준화된)

    for (const seg of segments) {
      accPath = accPath === "" ? `/${seg}` : `${accPath}/${seg}`;
      const key = normalizePath(accPath); // "/a" 형태

      let next = pathMap[key];
      if (!next) {
        next = { path: key, data: null, children: [] };
        pathMap[key] = next;
        // cursor.children은 항상 존재하므로 || [] 가 필요 없습니다.
        cursor.children!.push(next);
      }
      cursor = next;
    }

    // 최종 경로의 노드에 data를 할당합니다.
    // row 전체가 아닌 실제 data를 할당합니다.
    cursor.data = row;
  }

  // 최상위들(루트 바로 아래)만 반환
  const roots = virtualRoot.children;

  const getNode = (raw: string) => pathMap[normalizePath(raw)];

  return { data: roots, getNode: getNode };
}
