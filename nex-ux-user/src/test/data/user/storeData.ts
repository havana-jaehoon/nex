import { NexNode, NexNodeType } from "type/NexNode";

// 보관 정책 설정 데이터

//const testData = testDataList["menu"];

export const storeData = [
  [
    "/memory",
    {
      name: "memory",
      dispName: "메모리",
      description: "메모리 저장 정책 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
  [
    "/memory/static",
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
    },
  ],
  [
    "/memory/status",
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
  ],
  [
    "/memory/1min",
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
  ],
  [
    "/memory/10min",
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
  ],
  [
    "/memory/1hour",
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

  [
    "/disk",
    {
      name: "disk",
      dispName: "디스크",
      description: "디스크 저장 정책 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
  [
    "/disk/static",
    {
      name: "static", // 정적 데이터
      type: NexNodeType.STORE,
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
  ],
  [
    "/disk/status",
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
  ],
  [
    "/disk/1min",
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
  ],
  [
    "/disk/10min",
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
  ],
  [
    "/disk/1hour",
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
  ],
  [
    "/disk/1day",
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
  ],
  [
    "/disk/7day",
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
  ],
  [
    "/disk/10day",
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
  ],
  [
    "/disk/1month",
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
  ],
  [
    "/disk/1year",
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
  ],
  [
    "/disk/5year",
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
  ],
  [
    "/disk/10year",
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
  ],
  [
    "/disk/infinite",
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
  [
    "/hdfs",
    {
      name: "memory",
      dispName: "메모리",
      description: "메모리 저장 정책 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
];
