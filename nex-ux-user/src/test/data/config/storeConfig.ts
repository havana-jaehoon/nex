import { NexFolderNode, NexNodeType, NexStoreNode } from "type/NexNode";

// 보관 정책 설정 데이터
export const storeConfig: (NexFolderNode | NexStoreNode)[] = [
  {
    name: "memory",
    dispName: "공통",
    description: "공통 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
      {
        name: "static", // 정적 데이터
        type: NexNodeType.STORE,
        record: {
          storage: "memory", // memory, disk, hdfs
          nature: "static", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "NONE",
          block: "NONE",
          expire: "-1", // (sec 단위)  0: 임시 저장, -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      } as NexStoreNode,
      {
        name: "status", // 마지막 상태 데이터
        type: "store",
        record: {
          storage: "memory", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "SEC",
          block: "MIN",
          expire: "0", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY

          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1min",
        type: "store",
        record: {
          storage: "memory", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY

          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10min",
        type: "store",
        record: {
          storage: "memory", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1hour",
        type: "store",
        record: {
          storage: "memory", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "HOUR", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
    ],
  },
  {
    name: "disk",
    dispName: "공통",
    description: "공통 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
      {
        name: "static", // 정적 데이터
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "static", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "NONE",
          block: "NONE",
          expire: "-1", // (sec 단위)  0: 임시 저장, -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "status", // 마지막 상태 데이터
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "SEC",
          block: "MIN",
          expire: "0", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY

          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1min",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY

          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10min",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1hour",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "HOUR", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1day",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY

          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "7day",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "7", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10day",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY, MONTH
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1month",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MONTH", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1year",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "5year",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "5", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10year",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "infinite",
        type: "store",
        record: {
          storage: "disk", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "-1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장(전체 보관),
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
    ],
  },

  {
    name: "hdfs",
    dispName: "공통",
    description: "공통 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
      {
        name: "static", // 정적 데이터
        type: NexNodeType.STORE,
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "static", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "NONE",
          block: "NONE",
          expire: "-1", // (sec 단위)  0: 임시 저장, -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "status", // 마지막 상태 데이터
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간단위데이터: temporary
          unit: "SEC",
          block: "MIN",
          expire: "0", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1min",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static,  시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10min",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MIN", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1hour",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "HOUR", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1day",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "7day",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "7", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10day",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "DAY", // NONE, SEC, MIN, HOUR, DAY, MONTH
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1month",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "MONTH", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "1year",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "5year",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "5", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "10year",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "10", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장,
          expireUnit: "YEAR", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
      {
        name: "infinite",
        type: "store",
        record: {
          storage: "hdfs", // memory, disk, hdfs
          nature: "temporary", //  정적 데이터 : static, 시간 데이터: temporary,
          unit: "SEC",
          block: "MIN",
          expire: "-1", // (sec 단위)  0: 임시 저장(최신값만 저장), -1: 영구 저장(전체 보관),
          expireUnit: "NONE", // NONE, SEC, MIN, HOUR, DAY, MONTH, YEAR
          allowDuplication: "false", // 중복 허용 여부
          allowKeepValue: "false", // 값 유지 여부
        },
      },
    ],
  },
];

export const getTestStore = (path: string) => {
  if (!path || path === null) return null;
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("createDataStore path:", pathList);
  //return new NexAppletStoreTest("", path, testMenuElement);

  let list = storeConfig;
  let node = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    node = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!node) return null;
    //console.log("createDataStore element:", element);
    list = (node.children as any[]) || [];
  }

  if (!node || node.type !== NexNodeType.STORE) return null;
  return node;
};

//const testData = testDataList["menu"];
