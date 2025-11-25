import {
  NexFeatureType,
  NexFormatNode,
  NexNodeType,
  NexProcessingUnit,
} from "type/NexNode";

const commonFeatures: any[] = [
  {
    name: "name",
    dispName: "이름",
    featureType: NexFeatureType.STRING,
    uxSize: 6,
  },
  {
    name: "dispName",
    dispName: "출력이름",
    featureType: NexFeatureType.STRING,
    uxSize: 6,
  },
  {
    name: "description",
    dispName: "설명",
    featureType: NexFeatureType.STRING,
    uxSize: 12,
  },
  {
    name: "type",
    dispName: "타입",
    featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
    uxSize: 12,
    literals: [],
  },
  {
    name: "icon",
    dispName: "아이콘",
    featureType: NexFeatureType.STRING,
    uxSize: 6,
  },
  {
    name: "color",
    dispName: "컬러",
    featureType: NexFeatureType.STRING,
    uxSize: 6,
  },
];

const folderTypeFeatureObject = {
  name: "type",
  dispName: "타입",
  featureType: NexFeatureType.LITERALS, // 기록 유형은 문자열로 처리
  literals: [
    {
      name: NexNodeType.FOLDER,
      dispName: "폴더",
    },
  ],
  uxSize: 12,
};

const featureObjects = {
  [NexNodeType.FOLDER]: folderTypeFeatureObject,
  [NexNodeType.MENU]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.MENU,
        dispName: "메뉴",
      },
    ],
  },
  [NexNodeType.STORAGE]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.STORAGE,
        dispName: "스토리지",
      },
    ],
  },
  [NexNodeType.FORMAT]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.FORMAT,
        dispName: "포맷",
      },
    ],
  },
  [NexNodeType.STORE]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.STORE,
        dispName: "스토어",
      },
    ],
  },

  [NexNodeType.PROCESSOR]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.PROCESSOR,
        dispName: "프로세서",
      },
    ],
  },
  [NexNodeType.SYSTEM]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.SYSTEM,
        dispName: "시스템",
      },
    ],
  },
  [NexNodeType.ELEMENT]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.ELEMENT,
        dispName: "엘리먼트",
      },
    ],
  },
  [NexNodeType.CONTENTS]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.CONTENTS,
        dispName: "컨텐츠",
      },
    ],
  },
  [NexNodeType.APPLET]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.APPLET,
        dispName: "애플릿",
      },
    ],
  },
  [NexNodeType.SECTION]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.SECTION,
        dispName: "섹션",
      },
    ],
  },
  [NexNodeType.THEME]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.THEME,
        dispName: "테마",
      },
    ],
  },
  [NexNodeType.USER]: {
    ...folderTypeFeatureObject,
    literals: [
      {
        name: NexNodeType.USER,
        dispName: "사용자",
      },
    ],
  },
};

const folderNodeDef: any = {
  name: "folder",
  dispName: "폴더",
  description: "폴더 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.FOLDER],
    ...commonFeatures.slice(4),
  ],
};

const featureTypeLiterals = [
  {
    name: NexFeatureType.STRING,
    dispName: "문자열",
  },
  {
    name: NexFeatureType.NUMBER,
    dispName: "정수",
  },
  {
    name: NexFeatureType.INDEX,
    dispName: "자동발행숫자",
  },
  {
    name: NexFeatureType.FLOAT,
    dispName: "32비트 부동소수점",
  },
  {
    name: NexFeatureType.PATH,
    dispName: "경로",
  },
  {
    name: NexFeatureType.JSON,
    dispName: "JSON 객체",
  },
  {
    name: NexFeatureType.JSON,
    dispName: "JSON 객체",
  },
  {
    name: NexFeatureType.BOOLEAN,
    dispName: "불리언",
  },
  {
    name: NexFeatureType.BINARY,
    dispName: "바이너리",
  },
  {
    name: NexFeatureType.BINARY,
    dispName: "바이너리",
  },
  {
    name: NexFeatureType.DATE,
    dispName: "날짜",
  },
  {
    name: NexFeatureType.TIME_SEC,
    dispName: "초 시간",
  },
  {
    name: NexFeatureType.TIME_MSEC,
    dispName: "밀리초 시간",
  },
  {
    name: NexFeatureType.TIME_USEC,
    dispName: "마이크로초 시간",
  },
  {
    name: NexFeatureType.TIME_HOUR,
    dispName: "시각",
  },
  {
    name: NexFeatureType.TIMESTAMP,
    dispName: "타임스탬프",
  },
  {
    name: NexFeatureType.EMAIL,
    dispName: "이메일",
  },
  {
    name: NexFeatureType.PHONE,
    dispName: "전화번호",
  },
  {
    name: NexFeatureType.ADDRESS,
    dispName: "주소",
  },
  { name: NexFeatureType.URL, dispName: "URL" },
  {
    name: NexFeatureType.LITERALS,
    dispName: "리터럴 목록",
  },
  {
    name: NexFeatureType.RECORDS,
    dispName: "레코드 목록",
  },
  {
    name: NexFeatureType.ATTRIBUTES,
    dispName: "속성 목록",
  },
];

const menuNodeDef: NexFormatNode = {
  name: "storage",
  dispName: "저장소",
  description: "저장소 정보",
  type: NexNodeType.MENU,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.MENU],
    ...commonFeatures.slice(4),

    {
      name: "route",
      dispName: "라우트",
      description: "메뉴 라우트 정보",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
      uxSize: 3,
    },
  ],
};

const storageNodeDef: NexFormatNode = {
  name: "storage",
  dispName: "저장소",
  description: "저장소 정보",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.STORAGE],
    ...commonFeatures.slice(4),

    {
      name: "storageType",
      dispName: "저장소 유형",
      icon: null,
      color: null,
      featureType: NexFeatureType.LITERALS, // DB IP 주소는 문자열로 처리
      literals: [
        { name: "disk", dispName: "로컬 디스크", icon: "", color: "" },
        { name: "db", dispName: "데이터베이스", icon: "", color: "" },
        { name: "hdfs", dispName: "HDFS", icon: "", color: "" },
      ],
      uxSize: 3,
    },
    {
      name: "db",
      dispName: "데이터베이스",
      icon: null,
      color: null,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "dbType",
          dispName: "데이터베이스유형",
          icon: null,
          color: null,
          featureType: NexFeatureType.LITERALS, // DB IP 주소는 문자열로 처리
          literals: [
            { name: "mysql", dispName: "MySQL", icon: "", color: "" },
            { name: "oracle", dispName: "Oracle", icon: "", color: "" },
          ],
          uxSize: 3,
        },
        {
          name: "ip",
          dispName: "DB IP 주소",
          icon: null,
          color: null,
          featureType: NexFeatureType.ADDRESS, // DB IP 주소는 문자열로 처리
          uxSize: 3,
        },
        {
          name: "port",
          dispName: "DB 포트 번호",
          icon: null,
          color: null,
          featureType: "UINT32",
          uxSize: 2,
        },
        {
          name: "user",
          dispName: "DB 사용자",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB 사용자 문자열로 처리
          uxSize: 3,
        },
        {
          name: "password",
          dispName: "DB 비밀번호",
          icon: null,
          color: null,
          featureType: NexFeatureType.PASSWORD, // DB 비밀번호는 문자열로 처리
          uxSize: 3,
        },
        {
          name: "name",
          dispName: "데이터베이스 이름",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB 이름은 문자열로 처리
          uxSize: 3,
        },
      ],
    },
    {
      name: "hdfs",
      dispName: "HDFS",
      icon: null,
      color: null,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "ip",
          dispName: "HDFS IP 주소",
          icon: null,
          color: null,
          featureType: NexFeatureType.ADDRESS, // HDFS IP 주소는 문자열로 처리
          uxSize: 3,
        },
        {
          name: "port",
          dispName: "HDFS 포트 번호",
          icon: null,
          color: null,
          featureType: "UINT32",
          uxSize: 2,
        },
        {
          name: "path",
          dispName: "HDFS 경로",
          icon: null,
          color: null,
          isKey: false,
          featureType: NexFeatureType.STRING, // HDFS 경로는 문자열로 처리
          uxSize: 6,
        },
      ],
    },
  ],
};

const formatNodeDef: any = {
  name: "format",
  dispName: "포맷",
  description: "데이터 포맷 정보",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.FORMAT],
    ...commonFeatures.slice(4),
    {
      name: "features",
      dispName: "데이터 속성 목록",
      featureType: NexFeatureType.RECORDS,
      records: [
        {
          name: "name",
          dispName: "피처 이름",
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "dispName",
          dispName: "피처 표시 이름",
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "description",
          dispName: "피처 설명",
          featureType: NexFeatureType.STRING,
          uxSize: 6,
        },
        {
          name: "icon",
          dispName: "아이콘",
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "color",
          dispName: "컬러 코드",
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "featureType",
          dispName: "피처 타입",
          featureType: NexFeatureType.LITERALS,
          uxSize: 3,
          literals: featureTypeLiterals,
        },
        {
          name: "isKey",
          dispName: "키",
          featureType: NexFeatureType.BOOLEAN,
          uxSize: 1,
        },
        {
          name: "uxSize",
          dispName: "UX 크기",
          featureType: NexFeatureType.NUMBER,
          uxSize: 2,
        },
      ],
    },
  ],
};

const storeNodeDef: NexFormatNode = {
  name: "store",
  dispName: "저장 정책",
  description: "저장 정책 정보",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.STORE],
    ...commonFeatures.slice(4),
    {
      name: "record",
      dispName: "저장 속성",
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "storage", // 기록 유형
          dispName: "저장 매체",
          featureType: "literals", // 기록 유형은 문자열로 처리
          literals: [
            {
              name: "memory",
              dispName: "메모리",
              icon: "/system/memory",
              color: "",
            },
            {
              name: "disk",
              dispName: "디스크",
              icon: "/system/disk",
              color: "",
            },
            {
              name: "hdfs",
              dispName: "HDFS",
              icon: "/system/hdfs",
              color: "",
            },
          ],
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "nature", // 기록 유형
          dispName: "데이터 성격",
          featureType: "literals", // 기록 유형은 문자열로 처리
          literals: [
            {
              name: "static",
              dispName: "정적데이터",
              icon: "",
              color: "",
            },
            {
              name: "temporary",
              dispName: "시간데이터",
              icon: "",
              color: "",
            },
          ],
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "unit", // 기록 단위
          dispName: "데이터 단위",
          featureType: "literals", // 기록 단위는 문자열로 처리
          // 일반적인 비주기 데이터 : "NONE"
          // 주기 데이터 "MSEC" | "SEC" | "MIN" | "HOUR" | "DAY" | "MONTH" | "YEAR"
          literals: [
            { name: "NONE", dispName: "미지정", icon: "", color: "" },
            {
              name: "MSEC",
              dispName: "Milli-Second",
              icon: "",
              color: "",
            },
            { name: "SEC", dispName: "Second", icon: "", color: "" },
            { name: "MIN", dispName: "Minute", icon: "", color: "" },
            { name: "HOUR", dispName: "Hour", icon: "", color: "" },
            { name: "DAY", dispName: "Day", icon: "", color: "" },
            { name: "MONTH", dispName: "Month", icon: "", color: "" },
            { name: "YEAR", dispName: "Year", icon: "", color: "" },
          ],
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "block", // 블록 단위
          dispName: "저장 단위",
          featureType: "literals", // 블록 단위는 문자열로 처리
          literals: [
            { name: "NONE", dispName: "None", icon: "", color: "" }, // 1파일에 저장 (unit 이 "NONE" 인경우)
            { name: "1M", dispName: "1MB", icon: "", color: "" }, // 1MB 단위로 저장 (unit 이 "NONE" 인경우)
            { name: "100M", dispName: "100MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { name: "500M", dispName: "500MB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { name: "1G", dispName: "1GB", icon: "", color: "" }, //(unit 이 "NONE" 인경우)
            { name: "MIN", dispName: "MIN", icon: "", color: "" }, // "MIN" 단위로 저장 (unit 이 "SEC" 이하이 경우)
            { name: "HOUR", dispName: "HOUR", icon: "", color: "" },
            { name: "DAY", dispName: "DAY", icon: "", color: "" },
            { name: "MONTH", dispName: "MONTH", icon: "", color: "" },
            { name: "YEAR", dispName: "YEAR", icon: "", color: "" },
          ],
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "expire", // 기록 만료 시간(초 단위)
          dispName: "만료시간",
          featureType: "INT64", //   0: 임시 저장(최신값만 저장), -1: 영구 저장(전체 보관),
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "expireUnit", // 기록 단위
          dispName: "만료시간단위",
          featureType: "literals",
          literals: [
            { name: "NONE", dispName: "미지정", icon: "", color: "" },
            { name: "SEC", dispName: "Second", icon: "", color: "" },
            { name: "MIN", dispName: "Minute", icon: "", color: "" },
            { name: "HOUR", dispName: "Hour", icon: "", color: "" },
            { name: "DAY", dispName: "Day", icon: "", color: "" },
            { name: "MONTH", dispName: "Month", icon: "", color: "" },
            { name: "YEAR", dispName: "Year", icon: "", color: "" },
          ],
          isKey: false,
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "allowDuplication", // 중복 허용 여부
          dispName: "중복 허용 여부",
          featureType: "BOOLEAN", // 중복 허용 여부는 불리언으로 처리
          icon: null,
          color: null,
          uxSize: 3,
        },
        {
          name: "allowKeepValue", // 값 유지 여부
          dispName: "값 유지 여부",
          featureType: "BOOLEAN",
          icon: null,
          color: null,
          uxSize: 3,
        },
      ],
    },
  ],
};

const processorNodeDef: NexFormatNode = {
  name: "processor",
  dispName: "데이터 수집 및 처리 모듈",
  description: "데이터 수집 및 처리 모듈 정보",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.PROCESSOR],
    ...commonFeatures.slice(4),
    {
      name: "module",
      dispName: "모듈 정보",
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "version", // 모듈 버전
          dispName: "모듈 버전",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // 모듈 버전은 문자열로 처리
          uxSize: 6,
        },
        {
          name: "history", // 모듈 히스토리
          dispName: "모듈 히스토리",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // 모듈 히스토리는 문자열로 처리
          uxSize: 6,
        },
      ],
    },
  ],
};

const systemNodeDef: NexFormatNode = {
  name: "system",
  dispName: "시스템",
  description: "시스템 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.SYSTEM],
    ...commonFeatures.slice(4),
    {
      name: "address",
      dispName: "주소",
      icon: null,
      color: null,
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "ip",
          dispName: "IP 주소",
          icon: null,
          color: null,
          featureType: NexFeatureType.ADDRESS, // IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "port",
          dispName: "포트 번호",
          icon: null,
          color: null,
          featureType: "UINT32",
          uxSize: 6,
        },
      ],
    },
  ],
};

const elementNodeDef: any = {
  name: "element",
  dispName: "엘리먼트",
  description: "엘리먼트 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    // 엘리먼트의 기본 속성들
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.ELEMENT],
    ...commonFeatures.slice(4),
    {
      name: "storage",
      dispName: "저장소 경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 포맷 경로는 문자열로 처리
      uxSize: 6,
    },
    {
      name: "format",
      dispName: "데이터 포맷 경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 포맷 경로는 문자열로 처리
      uxSize: 6,
    },
    {
      name: "store",
      dispName: "보관 정책 경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING, // 보관 정책 경로는 문자열로 처리
      uxSize: 6,
    },
    {
      name: "processor",
      dispName: "데이터 수집 및 처리 모듈 경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING, // 데이터 수집 및 처리 모듈 경로는 문자열로 처리
      uxSize: 6,
    },
    {
      name: "processingInterval", // 데이터 수집 주기
      dispName: "수집 주기",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.NUMBER,
      uxSize: 6,
    },
    {
      name: "processingUnit", // 데이터 수집 주기 단위
      dispName: "단위",
      icon: null,
      color: null,
      featureType: NexFeatureType.LITERALS, // 수집 주기 단위는 문자열로 처리 (예: "SEC", "MIN", "HOUR")
      uxSize: 6,
      literals: Object.values(NexProcessingUnit).map((unit) => ({
        name: unit,
        dispName: unit,
      })),
    },
    {
      name: "sources",
      dispName: "데이터 소스 경로",
      icon: null,
      color: null,

      featureType: NexFeatureType.STRING_ARRAY, // 데이터 소스 경로는 문자열로 처리
      uxSize: 12,
    },
  ],
};

const sectionNodeDef = {
  name: "section",
  dispName: "웹 섹션",
  description: "웹 섹션 데이터 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.SECTION],
    ...commonFeatures.slice(4),
    {
      name: "isRoutes", // 경로
      dispName: "페이지",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.BOOLEAN, // 경로는 문자열로 처리
      uxSize: 12,
    },
    {
      name: "route", // 경로
      dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING, // 경로는 문자열로 처리
      uxSize: 12,
    },
    {
      name: "direction", // 방향
      dispName: "방향 (예시 : 'column' 또는 'row')",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.LITERALS, // 방향은 문자열로 처리
      literals: [
        { name: "row", dispName: "가로" },
        { name: "column", dispName: "세로" },
      ],
      uxSize: 6,
    },
    {
      name: "size", // 크기
      dispName: "크기 (예시 : '1rem', '1px')",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, // 크기는 문자열로 처리
      uxSize: 6,
    },

    {
      name: "padding",
      dispName: "패딩",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, //문자열로 처리
      uxSize: 6,
    },
    {
      name: "app-padding",
      dispName: "앱 패딩",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, //문자열로 처리
      uxSize: 6,
    },
    {
      name: "applet", // applet 경로
      dispName: "애플릿",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, //
      uxSize: 12,
    },
    {
      name: "contents", // applet 경로
      dispName: "Contents Path List",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING_ARRAY, //
      uxSize: 12,
    },
  ],
};

const contentsNodeDef = {
  name: "contents",
  dispName: "웹 데이터 컨텐츠",
  description: "웹 데이터 컨텐츠 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.CONTENTS],
    ...commonFeatures.slice(4),
    {
      name: "element", // 경로
      dispName: '경로 (예시 : "/home" 또는 "/dashboard")',
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, // 경로는 문자열로 처리
      uxSize: 12,
    },
    {
      name: "conditions",
      dispName: "데이터 출력조건",
      icon: null,
      color: null,
      featureType: NexFeatureType.RECORDS,
      records: [
        {
          name: "key",
          dispName: "키",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "feature",
          dispName: "피처이름",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "method",
          dispName: "메서드",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
      ],
    },
    {
      name: "selections",
      dispName: "데이터 출력조건",
      icon: null,
      color: null,
      featureType: NexFeatureType.RECORDS,
      records: [
        {
          name: "key",
          dispName: "키",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
        {
          name: "feature",
          dispName: "피처이름",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING,
          uxSize: 3,
        },
      ],
    },
  ],
};

const appletNodeDef = {
  name: "applet",
  dispName: "웹애플릿",
  description: "웹애플릿 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.APPLET],
    ...commonFeatures.slice(4),
    {
      name: "applet", // applet 경로
      dispName: "애플릿 경로",
      icon: null,
      color: null,
      featureType: NexFeatureType.STRING, // 경로는 문자열로 처리
      uxSize: 12,
    },
  ],
};

const themeNodeDef = {
  name: "theme",
  dispName: "웹 테마",
  description: "웹 테마 포맷",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.THEME],
    ...commonFeatures.slice(4),
    {
      name: "theme", // 경로
      dispName: "테마",
      icon: null,
      color: null,
      featureType: NexFeatureType.RECORDS, // 경로는 문자열로 처리
      records: [
        {
          name: "name",
          dispName: "스타일",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "gap",
          dispName: "간격",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 3,
        },
        {
          name: "padding",
          dispName: "패딩",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 3,
        },
        {
          name: "border",
          dispName: "테두리",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "borderRadius",
          dispName: "테두리 반경",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "boxShadow",
          dispName: "박스 그림자",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING, // DB IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "colors",
          dispName: "컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY, // DB IP 주소는 문자열로 처리
          uxSize: 6,
        },
        {
          name: "bgColors",
          dispName: "배경컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 6,
        },
        {
          name: "bdColors",
          dispName: "보더컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 6,
        },
        {
          name: "activeColors",
          dispName: "활성화 컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 6,
        },
        {
          name: "activeBgColors",
          dispName: "활성화 배경컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 6,
        },
        {
          name: "hoverColors",
          dispName: "호버 컬러 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 6,
        },
        {
          name: "fontFamily",
          dispName: "폰트",
          icon: null,
          color: null,
          featureType: NexFeatureType.LITERALS,
          literals: [{ name: "Arial, sans-serif", dispName: "Arial" }],
          uxSize: 3,
        },
        {
          name: "fontSize",
          dispName: "폰트크기 셋",
          icon: null,
          color: null,
          featureType: NexFeatureType.STRING_ARRAY,
          uxSize: 3,
        },
      ],
    },
  ],
};

const userNodeDef: NexFormatNode = {
  name: "store",
  dispName: "저장 정책",
  description: "저장 정책 정보",
  type: NexNodeType.FORMAT,
  features: [
    ...commonFeatures.slice(0, 3),
    featureObjects[NexNodeType.USER],
    ...commonFeatures.slice(4),
    {
      name: "user",
      dispName: "사용자 정보",
      featureType: NexFeatureType.ATTRIBUTES,
      attributes: [
        {
          name: "id", // 사용자 ID
          dispName: "아이디",
          featureType: NexFeatureType.EMAIL, // 사용자 ID는 문자열로 처리
          icon: null,
          color: null,
          uxSize: 3,
        },
        {
          name: "password", // 사용자 ID
          dispName: "비밀번호",
          featureType: NexFeatureType.PASSWORD,
          icon: null,
          color: null,
          uxSize: 3,
        },
        {
          name: "level", // 사용자 ID
          dispName: "등급",
          featureType: NexFeatureType.LITERALS,
          literals: [
            { name: "admin", dispName: "어드민", icon: "", color: "" },
            { name: "manager", dispName: "관리자", icon: "", color: "" },
            { name: "user", dispName: "일반사용자", icon: "", color: "" },
            { name: "guest", dispName: "게스트", icon: "", color: "" },
          ],
          icon: null,
          color: null,
          uxSize: 3,
        },
        {
          name: "theme", // 사용자 ID
          dispName: "테마",
          featureType: NexFeatureType.STRING,
          icon: null,
          color: null,
          uxSize: 6,
        },
        {
          name: "themeLevel", // 사용자 ID
          dispName: "테마 레벨",
          featureType: NexFeatureType.NUMBER,
          icon: null,
          color: null,
          uxSize: 2,
        },
      ],
    },
  ],
};

export const adminNodeDefs = {
  [NexNodeType.FOLDER]: folderNodeDef,
  [NexNodeType.MENU]: menuNodeDef,
  [NexNodeType.STORAGE]: storageNodeDef,
  [NexNodeType.FORMAT]: formatNodeDef,
  [NexNodeType.STORE]: storeNodeDef,
  [NexNodeType.PROCESSOR]: processorNodeDef,
  [NexNodeType.SYSTEM]: systemNodeDef,
  [NexNodeType.ELEMENT]: elementNodeDef,
  [NexNodeType.SECTION]: sectionNodeDef,
  [NexNodeType.CONTENTS]: contentsNodeDef,
  [NexNodeType.APPLET]: appletNodeDef,
  [NexNodeType.THEME]: themeNodeDef,
  [NexNodeType.USER]: userNodeDef,
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
  const newNode = getAdminNodeFromFeatures(
    format.features,
    type as NexNodeType
  );
  console.log(
    "getAdminNodeFromType: newNode=",
    JSON.stringify(newNode, null, 2)
  );
  return newNode;
}
