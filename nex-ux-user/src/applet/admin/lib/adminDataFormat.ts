import {
  NexFeatureNode,
  NexFeatureType,
  NexFormatNode,
  NexNodeType,
} from "type/NexNode";

export const folderNodeDef: any = {
  name: "folder",
  dispName: "폴더",
  description: "폴더 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "dispName",
      dispName: "시스템 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.FOLDER,
          description: "폴더",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
};

export const formatNodeDef: NexFormatNode = {
  name: "format",
  dispName: "데이터 유형",
  description: "데이터 유형 정보",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "데이터 유형 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING, // 데이터 유형 이름은 문자열로 처리
    },
    {
      name: "dispName",
      dispName: "데이터 유형 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.FORMAT,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
};

export const featureNodeDef: NexFormatNode = {
  name: NexNodeType.FEATURE,
  dispName: "데이터 속성",
  description: "데이터 속성 정보",
  type: NexNodeType.FORMAT,
  features: [
    // feature의 기본 속성들
    // feature의 이름, 출력 이름, 설명, 유형, 데이터 유형, 아이콘, 컬러 코드
    {
      name: "name",
      dispName: "속성 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING, // 속성 이름은 문자열로 처리
    },
    {
      name: "dispName",
      dispName: "속성 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.FEATURE,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 아이콘은 문자열로 처리
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 컬러 코드는 문자열로 처리
    },
    {
      name: "isKey",
      dispName: "키 여부",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 컬러 코드는 문자열로 처리
      literals: [
        { value: false, description: "일반 속성", icon: "", color: "" },
        { value: true, description: "키 속성", icon: "", color: "" },
      ],
    } as NexFeatureNode,
    {
      name: "featureType",
      dispName: "속성 데이터 유형",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 속성 데이터 유형은 문자열로 처리 (예: "STRING", "UINT32")
      literals: [
        /*
        export enum NexFeatureType {
          STRING = "STRING",
          INDEX = "INDEX", // 자동 증가 숫자
          UINT8 = "UINT8",
          UINT16 = "UINT16",
          UINT32 = "UINT32",
          UINT64 = "UINT64",
          INT8 = "INT8",
          INT16 = "INT16",
          INT32 = "INT32",
          INT64 = "INT64",
          FLOAT = "FLOAT",
          DOUBLE = "DOUBLE",
          PATH = "PATH", // 경로 /test1/.../node-name
          JSON = "JSON",
          BOOLEAN = "BOOLEAN",
          BINARY = "BINARY",
          DATE = "DATE",
          TIME_SEC = "TIME_SEC",
          TIME_MSEC = "TIME_MSEC",
          TIME_USEC = "TIME_USEC",
          TIME_HOUR = "TIME_HOUR",
          TIMESTAMP = "TIMESTAMP",
          EMAIL = "EMAIL",
          PHONE = "PHONE",
          ADDRESS = "ADDRESS",
          URL = "URL",
          LITERALS = "LITERALS", // 문자열 목록 중에서 선택
          RECORDS = "RECORDS", // 레코드 목록 중에서 선택
          ATTRIBUTES = "ATTRIBUTES", // key-value 쌍의 속성 목록
        }
        */
        {
          value: NexFeatureType.STRING,
          description: "문자열",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.INDEX,
          description: "자동발행숫자",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.UINT8,
          description: "부호 없는 8비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.UINT16,
          description: "부호 없는 16비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.UINT32,
          description: "부호 없는 32비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.UINT64,
          description: "부호 없는 64비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.INT8,
          description: "부호 있는 8비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.INT16,
          description: "부호 있는 16비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.INT32,
          description: "부호 있는 32비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.INT64,
          description: "부호 있는 64비트 정수",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.FLOAT,
          description: "32비트 부동소수점",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.DOUBLE,
          description: "64비트 부동소수점",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.PATH,
          description: "경로",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.JSON,
          description: "JSON 객체",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.BOOLEAN,
          description: "불리언",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.BINARY,
          description: "바이너리",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.DATE,
          description: "날짜",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.TIME_SEC,
          description: "초 시간",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.TIME_MSEC,
          description: "밀리초 시간",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.TIME_USEC,
          description: "마이크로초 시간",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.TIME_HOUR,
          description: "시각",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.TIMESTAMP,
          description: "타임스탬프",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.EMAIL,
          description: "이메일",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.PHONE,
          description: "전화번호",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.ADDRESS,
          description: "주소",
          icon: "",
          color: "",
        },
        { value: NexFeatureType.URL, description: "URL", icon: "", color: "" },
        {
          value: NexFeatureType.LITERALS,
          description: "리터럴 목록",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.RECORDS,
          description: "레코드 목록",
          icon: "",
          color: "",
        },
        {
          value: NexFeatureType.ATTRIBUTES,
          description: "속성 목록",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "literals",
      dispName: "리터럴 값",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.RECORDS,
      records: ["value", "description", "icon", "color"],
    } as NexFeatureNode,
  ],
};

export const storeNodeDef: NexFormatNode = {
  name: "store",
  dispName: "저장 정책",
  description: "저장 정책 정보",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "저장 정책 이름",
      description: "저장 정책 이름",
      type: NexNodeType.FEATURE,
      featureType: NexFeatureType.STRING,
      isKey: true,
      icon: null,
      color: null,
    },
    {
      name: "dispName",
      dispName: "저장 정책 출력 이름",
      description: "저장 정책 출력 이름",
      type: NexNodeType.FEATURE,
      featureType: NexFeatureType.STRING,
      isKey: false,
      icon: null,
      color: null,
    },
    {
      name: "description",
      dispName: "설명",
      description: "저장 정책 설명",
      type: NexNodeType.FEATURE,
      featureType: NexFeatureType.STRING,
      isKey: false,
      icon: null,
      color: null,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.STORE,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "record",
      dispName: "저장 속성",
      description: "저장 정책에 세부 속성들 그룹",
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "storage", // 기록 유형
          dispName: "저장 매체",
          description: "저장 매체", // memory, disk, hdfs
          type: NexNodeType.FEATURE,
          featureType: "literals", // 기록 유형은 문자열로 처리
          literals: [
            {
              value: "memory",
              description: "메모리",
              icon: "/system/memory",
              color: "",
            },
            {
              value: "disk",
              description: "디스크",
              icon: "/system/disk",
              color: "",
            },
            {
              value: "hdfs",
              description: "HDFS",
              icon: "/system/hdfs",
              color: "",
            },
          ],
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "nature", // 기록 유형
          dispName: "데이터 성격",
          description: "데이터 성격", // "'static': 정적 데이터, 'temporary': 시간 데이터 "
          type: NexNodeType.FEATURE,
          featureType: "literals", // 기록 유형은 문자열로 처리
          literals: [
            {
              value: "static",
              description: "정적데이터",
              icon: "",
              color: "",
            },
            {
              value: "temporary",
              description: "시간데이터",
              icon: "",
              color: "",
            },
          ],
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "unit", // 기록 단위
          dispName: "데이터 단위",
          description: "데이터 단위",
          type: NexNodeType.FEATURE,
          featureType: "literals", // 기록 단위는 문자열로 처리
          // 일반적인 비주기 데이터 : "NONE"
          // 주기 데이터 "MSEC" | "SEC" | "MIN" | "HOUR" | "DAY" | "MONTH" | "YEAR"
          literals: [
            { value: "NONE", description: "미지정", icon: "", color: "" },
            {
              value: "MSEC",
              description: "Milli-Second",
              icon: "",
              color: "",
            },
            { value: "SEC", description: "Second", icon: "", color: "" },
            { value: "MIN", description: "Minute", icon: "", color: "" },
            { value: "HOUR", description: "Hour", icon: "", color: "" },
            { value: "DAY", description: "Day", icon: "", color: "" },
            { value: "MONTH", description: "Month", icon: "", color: "" },
            { value: "YEAR", description: "Year", icon: "", color: "" },
          ],
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "block", // 블록 단위
          dispName: "저장 단위",
          description: "저장 단위",
          type: NexNodeType.FEATURE,
          featureType: "literals", // 블록 단위는 문자열로 처리
          literals: [
            { value: "NONE", description: "None", icon: "", color: "" }, // 1파일에 저장 (unit 이 "NONE" 인경우)
            { value: "1M", description: "1MB", icon: "", color: "" }, // 1MB 단위로 저장 (unit 이 "NONE" 인경우)
            { value: "100M", description: "100MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { value: "500M", description: "500MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { value: "1G", description: "1GB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { value: "MIN", description: "MIN", icon: "", color: "" }, // "MIN" 단위로 저장 (unit 이 "SEC" 이하이 경우)
            { value: "HOUR", description: "HOUR", icon: "", color: "" },
            { value: "DAY", description: "DAY", icon: "", color: "" },
            { value: "MONTH", description: "MONTH", icon: "", color: "" },
            { value: "YEAR", description: "YEAR", icon: "", color: "" },
          ],
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "expire", // 기록 만료 시간(초 단위)
          dispName: "만료시간",
          description: "데이터 만료 시간(초)",
          type: NexNodeType.FEATURE,
          featureType: "INT64", //   0: 임시 저장(최신값만 저장), -1: 영구 저장(전체 보관),
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "expireUnit", // 기록 단위
          dispName: "만료시간단위",
          description: "만료시간단위",
          type: NexNodeType.FEATURE,
          featureType: "literals",
          literals: [
            { value: "NONE", description: "미지정", icon: "", color: "" },
            { value: "SEC", description: "Second", icon: "", color: "" },
            { value: "MIN", description: "Minute", icon: "", color: "" },
            { value: "HOUR", description: "Hour", icon: "", color: "" },
            { value: "DAY", description: "Day", icon: "", color: "" },
            { value: "MONTH", description: "Month", icon: "", color: "" },
            { value: "YEAR", description: "Year", icon: "", color: "" },
          ],
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "allowDuplication", // 중복 허용 여부
          dispName: "중복 허용 여부",
          description: "중복 데이터를 허용하는지 여부 (true/false)",
          type: NexNodeType.FEATURE,
          featureType: "BOOLEAN", // 중복 허용 여부는 불리언으로 처리
          isKey: false,
          icon: null,
          color: null,
        },
        {
          name: "allowKeepValue", // 값 유지 여부
          dispName: "값 유지 여부",
          description: "마지막 값을 유지할지 여부",
          type: NexNodeType.FEATURE,
          featureType: "BOOLEAN",
          isKey: false,
          icon: null,
          color: null,
        },
      ],
    } as NexFeatureNode,
  ],
};

export const processorNodeDef: NexFormatNode = {
  name: "processor",
  dispName: "데이터 수집 및 처리 모듈",
  description: "데이터 수집 및 처리 모듈 정보",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "project",
      dispName: "프로젝트",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "system",
      dispName: "시스템",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "path", // format Path :  /project/format(category)/folder/formatName
      dispName: "경로",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "name",
      dispName: "모듈 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING, // 모듈 이름은 문자열로 처리
    },
    {
      name: "dispName",
      dispName: "모듈 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "module",
      dispName: "모듈 정보",
      description: "모듈 정보",
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "version", // 모듈 버전
          dispName: "모듈 버전",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // 모듈 버전은 문자열로 처리
        },
        {
          name: "history", // 모듈 히스토리
          dispName: "모듈 히스토리",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // 모듈 히스토리는 문자열로 처리
        },
      ],
    } as NexFeatureNode,
  ],
};

export const systemNodeDef: NexFormatNode = {
  name: "system",
  dispName: "시스템",
  description: "시스템 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "시스템명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "dispName",
      dispName: "시스템 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.SYSTEM,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "address",
      dispName: "주소",
      icon: null,
      color: null,
      isKey: false,
      type: NexNodeType.FEATURE,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "ip",
          dispName: "IP 주소",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // IP 주소는 문자열로 처리
        },
        {
          name: "port",
          dispName: "포트 번호",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: "UINT32",
        },
      ],
    } as NexFeatureNode,
    {
      name: "hdfs",
      dispName: "HDFS",
      icon: null,
      color: null,
      isKey: false,
      type: NexNodeType.FEATURE,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "ip",
          dispName: "HDFS IP 주소",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // HDFS IP 주소는 문자열로 처리
        },
        {
          name: "port",
          dispName: "HDFS 포트 번호",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: "UINT32",
        },
        {
          name: "path",
          dispName: "HDFS 경로",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // HDFS 경로는 문자열로 처리
        },
      ],
    } as NexFeatureNode,
    {
      name: "db",
      dispName: "DB",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "ip",
          dispName: "DB IP 주소",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
        },
        {
          name: "port",
          dispName: "DB 포트 번호",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: "UINT32",
        },
        {
          name: "id",
          dispName: "DB 사용자 ID",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // DB 사용자 ID는 문자열로 처리
        },
        {
          name: "passwd",
          dispName: "DB 비밀번호",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // DB 비밀번호는 문자열로 처리
        },
        {
          name: "name",
          dispName: "DB 이름",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING, // DB 이름은 문자열로 처리
        },
      ],
    } as NexFeatureNode,
  ],
};

export const elementNodeDef: NexFormatNode = {
  name: "element",
  dispName: "엘리먼트",
  description: "엘리먼트 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    // 엘리먼트의 기본 속성들

    {
      name: "name",
      dispName: "엘리먼트 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "dispName",
      dispName: "엘리먼트 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.ELEMENT,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
    {
      name: "format",
      dispName: "데이터 포맷 경로",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 포맷 경로는 문자열로 처리
    },
    {
      name: "store",
      dispName: "보관 정책 경로",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 보관 정책 경로는 문자열로 처리
    },
    {
      name: "processor",
      dispName: "데이터 수집 및 처리 모듈 경로",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 수집 및 처리 모듈 경로는 문자열로 처리
    },
    {
      name: "processingInterval", // 데이터 수집 주기
      dispName: "수집 주기(초)",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.UINT32,
    },
    {
      name: "processingUnit", // 데이터 수집 주기 단위
      dispName: "수집 주기 단위",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 수집 주기 단위는 문자열로 처리 (예: "SEC", "MIN", "HOUR")
    },
    {
      name: "source",
      dispName: "데이터 소스 경로",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 소스 경로는 문자열로 처리
    },
  ],
};

const sectionNodeDef: NexFormatNode = {
  name: "websection",
  dispName: "웹 섹션",
  description: "웹 섹션 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "웹 섹션 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: true,
      featureType: NexFeatureType.STRING, // 웹 섹션 이름은 문자열로 처리
    },
    {
      name: "dispName",
      dispName: "웹 섹션 출력 이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 웹 섹션 출력 이름은 문자열로 처리
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 웹 섹션 설명은 문자열로 처리
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.SECTION,
          description: "웹 섹션",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "icon",
      dispName: "아이콘",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 아이콘은 문자열로 처리
    },
    {
      name: "color",
      dispName: "컬러 코드",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 컬러 코드는 문자열로 처리
    },
    {
      name: "isRoute", // 경로
      dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.BOOLEAN, // 경로는 문자열로 처리
    },
    {
      name: "route", // 경로
      dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 경로는 문자열로 처리
    },

    {
      name: "direction", // 방향
      dispName: "방향 (예시 : 'column' 또는 'row')",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 방향은 문자열로 처리
    },
    {
      name: "size", // 크기
      dispName: "크기 (예시 : '1rem', '1px')",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 크기는 문자열로 처리
    },
    {
      name: "padding",
      dispName: "패딩",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, //문자열로 처리
    },
    {
      name: "applet", // applet 경로
      dispName: "Applet Path",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, //
    },
  ],
};

export const contentsNodeDef: NexFormatNode = {
  name: "contents",
  dispName: "웹 데이터 컨텐츠",
  description: "웹 데이터 컨텐츠 포맷",
  type: NexNodeType.FORMAT,
  features: [
    {
      name: "name",
      dispName: "이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 웹 섹션 경로는 문자열로 처리
    },
    {
      name: "dispName",
      dispName: "출력이름",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 웹 섹션 경로는 문자열로 처리
    },
    {
      name: "description",
      dispName: "설명",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 웹 섹션 설명은 문자열로 처리
    },
    {
      name: "type",
      dispName: "타입",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
      literals: [
        {
          value: NexNodeType.CONTENTS,
          description: "포맷",
          icon: "",
          color: "",
        },
      ],
    } as NexFeatureNode,
    {
      name: "element", // 경로
      dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.STRING, // 경로는 문자열로 처리
    },
    {
      name: "conditons",
      dispName: "데이터 출력조건",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.RECORDS,
      records: ["key", "feature", "method"],
    } as NexFeatureNode,
    {
      name: "selections",
      dispName: "데이터 출력조건",
      icon: null,
      color: null,
      type: NexNodeType.FEATURE,
      isKey: false,
      featureType: NexFeatureType.RECORDS,
      records: ["key", "feature"],
    } as NexFeatureNode,
  ],
};

export const adminNodeDefs = {
  [NexNodeType.FOLDER]: folderNodeDef,
  [NexNodeType.FORMAT]: formatNodeDef,
  [NexNodeType.FEATURE]: featureNodeDef,
  [NexNodeType.STORE]: storeNodeDef,
  [NexNodeType.PROCESSOR]: processorNodeDef,
  [NexNodeType.SYSTEM]: systemNodeDef,
  [NexNodeType.ELEMENT]: elementNodeDef,
  [NexNodeType.SECTION]: sectionNodeDef,
  [NexNodeType.CONTENTS]: contentsNodeDef,
  [NexNodeType.APPLET]: {},
  [NexNodeType.THEME]: {},
  [NexNodeType.USER]: {},
};

export function getAdminNodeFromFeatures(
  features: any[],
  type?: NexNodeType
): any {
  const obj: any = {};

  for (const f of features) {
    if (f.featureType === NexFeatureType.ATTRIBUTES) {
      obj[f.name] = getAdminNodeFromFeatures(f.attributes);
    } else if (f.featureType === NexFeatureType.LITERALS) {
      if (type && f.name === "type") {
        obj[f.name] = type;
      } else {
        f.literals && f.literals.length > 0
          ? (obj[f.name] = f.literals[0].value)
          : (obj[f.name] = "");
      }
    } else if (f.featureType === NexFeatureType.RECORDS) {
      obj[f.name] = []; // array
    } else {
      // primitives → empty string for consistency with user's format2Json
      type && f.name === "type" ? (obj[f.name] = type) : (obj[f.name] = "");
    }
  }
  return obj;
}

export function getAdminNodeFromType(type: string): any {
  // type is string but should be one of NexNodeType
  const isValid = (Object.values(NexNodeType) as string[]).includes(type);
  if (!isValid) {
    console.warn(`getAdminNodeFromType: Unknown type=${type}`);
    return null;
  }

  const format = adminNodeDefs[type as NexNodeType];
  if (!format) {
    console.warn(`getAdminNodeFromType: Unknown type=${type}`);
    return null;
  }
  return getAdminNodeFromFeatures(format.features, type as NexNodeType);
}
