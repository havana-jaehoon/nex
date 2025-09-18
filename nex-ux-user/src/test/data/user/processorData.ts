import { NexNodeType } from "type/NexNode";

export const processorData = [
  [
    "/common",
    {
      name: "common",
      dispName: "관리자용 데이터",
      description: "관리자용 데이터 엘리먼트 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
  [
    "/common/transparent",
    {
      name: "transparent",
      dispName: "",
      type: NexNodeType.PROCESSOR,
      module: {
        version: "0", // 0: 초기 한번 수집
        history: "",
      },
    },
  ],
];
