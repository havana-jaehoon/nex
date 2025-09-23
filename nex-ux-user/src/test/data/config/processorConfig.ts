import { NexFolderNode, NexNodeType, NexProcessorNode } from "type/NexNode";

export const processorConfig: (NexFolderNode | NexProcessorNode)[] = [
  {
    name: "common",
    dispName: "관리자용 데이터",
    description: "관리자용 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
      {
        name: "transparent",
        dispName: "",
        type: NexNodeType.PROCESSOR,
        module: {
          version: "0", // 0: 초기 한번 수집
          history: "",
        },
      } as NexProcessorNode,
    ],
  },
];

export const getTestProcessor = (path: string) => {
  if (!path || path === null) return null;
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("createDataStore path:", pathList);
  //return new NexAppletStoreTest("", path, testMenuElement);

  let list = processorConfig as any[];
  let node = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    node = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!node) return null;
    //console.log("createDataStore node:", node);
    list = (node.children as any[]) || [];
  }

  if (!node || node.type !== NexNodeType.PROCESSOR) return null;
  return node;
};

//const testData = testDataList["menu"];
