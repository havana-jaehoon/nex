type JsonData = any;

export interface NexTreeNode {
  index: number; // 순서 (0부터 시작)
  name: string;
  path: string; // 표준화된 절대경로 (루트는 "")
  children: NexTreeNode[];
  data?: JsonData; // 해당 경로의 json-data
}

export interface NexTree {
  roots: NexTreeNode[]; // 최상위 노드들
  pathMap: Record<string, NexTreeNode>; // path -> node
  getNode: (path: string) => NexTreeNode | undefined;
}

/** 경로 표준화: "", "/" -> ""; "/a/" -> "/a" */
function normalizePath(p?: string): string {
  if (!p || p === "/") return "";
  return p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
}

/** path 배열 -> 트리/맵 빌드 */
export function buildNexTree(
  pairs: Array<[number, string, JsonData]>
): NexTree {
  const virtualRoot: NexTreeNode = {
    index: -1,
    name: "",
    path: "",
    children: [],
  };
  const pathMap: Record<string, NexTreeNode> = { "": virtualRoot };

  let index = 0;
  for (const [id, rawPath, data] of pairs) {
    const path = normalizePath(rawPath);
    const segments = path.split("/").filter(Boolean);

    index += 1;

    // 루트에 직접 데이터인 경우
    if (segments.length === 0) {
      pathMap[""].data = data;
      continue;
    }

    // 누적 경로를 따라 노드 생성/탐색
    let cursor = virtualRoot;
    let accPath = ""; // 누적 경로(표준화된)

    for (const seg of segments) {
      accPath = accPath ? `${accPath}/${seg}` : `/${seg}`;
      const key = normalizePath(accPath); // "/a" 형태

      let next = pathMap[key];
      if (!next) {
        next = { index: index - 1, name: seg, path: key, children: [] };
        cursor.children.push(next);
        pathMap[key] = next;
      }
      cursor = next;
    }

    // 마지막 노드에 data 세팅 (중복 path는 덮어쓰기)
    cursor.data = data;
  }

  // 최상위들(루트 바로 아래)만 반환
  const roots = virtualRoot.children;

  const getNode = (raw: string) => pathMap[normalizePath(raw)];
  //const getNode = (raw: string) => pathMap[normalizePath(raw)]?.data;

  return { roots, pathMap, getNode };
}
