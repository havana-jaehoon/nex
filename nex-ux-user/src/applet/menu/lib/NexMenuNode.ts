export interface NexMenuNode {
  type: "item" | "folder";
  name: string;
  dispName: string;
  description: string;
  icon: string | null;
  color: string | null;
  route: string | null;
  children?: NexMenuNode[];
}

export function buildMenuTree(data: any[][]): NexMenuNode[] {
  const nodeMap = new Map<string, NexMenuNode>();
  const roots: NexMenuNode[] = [];

  for (const row of data) {
    const [type, path, name, dispName, description, icon, color, route] = row;
    const node: NexMenuNode = {
      type: type as any,

      name,
      dispName,
      description,
      icon,
      color,
      route,
      children: [],
    };

    const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;
    nodeMap.set(fullPath, node);

    if (path === "/") {
      roots.push(node);
    } else {
      const parentPath = path;
      const parent = nodeMap.get(parentPath);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        console.warn(`Parent not found for ${fullPath}`);
      }
    }
  }

  return roots;
}
