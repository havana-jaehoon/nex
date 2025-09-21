export const elementConfig: any[] = [
  {
    name: "common",
    dispName: "공통",
    description: "공통 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "menu",
        dispName: "메뉴",
        description: "메뉴 테스트",
        type: "element",
        format: "/web/menu", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "",
      },
    ],
  },
  {
    name: "cbm",
    dispName: "CBM",
    description: "CBM 전용 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "config",
        dispName: "Config",
        description: "CBM Config 데이터 엘리먼트 폴더",
        type: "folder",
        children: [
          {
            name: "Line",
            dispName: "노선정보",
            description: "노선정보",
            type: "element",
            format: "/config/Line", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로)
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/config/Line",
          },
          {
            name: "TrainPerLine",
            dispName: "노선별편성정보",
            description: "노선별 편성정보",
            type: "element",
            format: "/config/TrainPerLine", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로)
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/config/TrainPerLine",
          },
          {
            name: "CarPerTrain",
            dispName: "편성별차량정보",
            description: "편성별차량정보",
            type: "element",
            format: "/config/CarPerTrain", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로)
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/config/CarPerTrain",
          },
          {
            name: "DevicePerCar",
            dispName: "차량별장치정보",
            description: "차량별장치정보",
            type: "element",
            format: "/config/DevicePerCar", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로)
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/config/DevicePerCar",
          },
        ],
      },
      {
        name: "status",
        dispName: "상태",
        description: "상태 데이터 엘리먼트 폴더",
        type: "folder",
        children: [
          {
            name: "LossPerLine",
            dispName: "노선별 열화 현황",
            description: "노선별 열화 현상 데이터 엘리먼트",
            type: "element",
            format: "/status/alert-warning", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "",
          },
          {
            name: "LossPerDevice",
            dispName: "장치별 열화 현상",
            description: "장치치별 열화 현상 데이터 엘리먼트",
            type: "element",
            format: "/status/alert-warning", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "",
          },
          {
            name: "TrainCountPerLine",
            dispName: "노선별 편성 수",
            description: "노선별 편성 수 데이터 엘리먼트",
            type: "element",
            format: "/status/TrainCountPerLine", // 데이터 유형 (경로)
            store: "/memory/static", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "",
          },
        ],
      },

      {
        name: "event",
        dispName: "이벤트",
        description: "이벤트 데이터 엘리먼트 폴더",
        type: "folder",
        children: [
          {
            name: "RTMaintanaceInfo",
            dispName: "실시간 유지보수 정보",
            description: "실시간 유지보수 정보 데이터 엘리먼트",
            type: "element",
            format: "/event/RTMaintanaceInfo", // 데이터 유형 (경로)
            store: "/memory/1year", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/event/RTMaintanaceInfo",
          },
          {
            name: "SystemEventInfo",
            dispName: "시스템 이벤트 정보",
            description: "시스템 이벤트 정보 데이터 엘리먼트",
            type: "element",
            format: "/event/SystemEventInfo", // 데이터 유형 (경로)
            store: "/memory/1year", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/event/SystemEventInfo",
          },
        ],
      },
      {
        name: "history",
        dispName: "이력",
        description: "이력 데이터 엘리먼트 폴더",
        type: "folder",
        children: [
          {
            name: "LossHistoryPerLine",
            dispName: "노선별 열화 이력",
            description: "노선별 열화 이력 데이터 엘리먼트",
            type: "element",
            format: "/history/LossHistoryPerLine", // 데이터 유형 (경로)
            store: "/memory/7day", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/history/LossHistoryPerLine",
          },
          {
            name: "LossHistoryPerDevice",
            dispName: "장치별 열화 이력",
            description: "장치치별 열화 이력 데이터 엘리먼트",
            type: "element",
            format: "/history/LossHistoryPerDevice", // 데이터 유형 (경로)
            store: "/memory/7day", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/history/LossHistoryPerDevice",
          },

          {
            name: "MaintenanceHistoryPerLine",
            dispName: "노선별 유지보수 이력",
            description: "노선선별 유지보수 이력 데이터 엘리먼트",
            type: "element",
            format: "/history/MaintenanceHistoryPerLine", // 데이터 유형 (경로)
            store: "/memory/1year", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/history/MaintenanceHistoryPerLine",
          },
          {
            name: "DetailLossLevelHistory",
            dispName: "상세 열화등급 이력",
            description: "상세 열화등급 이력 데이터 엘리먼트",
            type: "element",
            format: "/history/DetailLossLevelHistory", // 데이터 유형 (경로)
            store: "/memory/1year", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/history/DetailLossLevelHistory",
          },
        ],
      },
    ],
  },

  {
    name: "admin",
    dispName: "관리자용 데이터",
    description: "관리자용 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "Menu",
        dispName: "메뉴",
        description: "메뉴 테스트",
        type: "element",
        format: "/web/menu", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/common/menu",
      },
      {
        name: "project",
        dispName: "프로젝트 설정",
        description: "프로젝트 데이터 포맷",
        type: "element",
        isTree: "true", // 데이터가 트리구조로 (즉, children이 있는)
        volatility: "static",
        format: "/admin/projectGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/project",
      },
      {
        name: "format",
        dispName: "포맷 설정",
        description: "포맷 데이터 엘리먼트",
        type: "element",
        format: "/admin/formatGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "",
      },

      {
        name: "store",
        dispName: "스토어",
        description: "스토어 데이터 엘리먼트",
        type: "element",
        format: "/admin/storeGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "",
      },
      {
        name: "processor",
        dispName: "프로세서",
        description: "프로세서 데이터 엘리먼트",
        type: "element",
        format: "/admin/processorGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "",
      },
      {
        name: "system",
        dispName: "시스템",
        description: "시스템 데이터 엘리먼트",
        type: "element",
        format: "/admin/systemGroup",
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/system",
      }, // 시스템 데이터 엘리먼트
      {
        name: "element",
        dispName: "엘리먼트",
        description: "엘리먼트 데이터 엘리먼트",
        type: "element",
        format: "/admin/elementsGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/element",
      },
      {
        name: "applet",
        dispName: "애플릿",
        description: "애플릿 데이터 엘리먼트",
        type: "element",
        format: "/admin/applet", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/applet",
      },
      {
        name: "themeUser",
        dispName: "사용자테마",
        description: "사용자테마 데이터 엘리먼트",
        type: "element",
        format: "/admin/themeUser", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/themeUser",
      },
      {
        name: "websection",
        dispName: "웹페이지",
        description: "웹페이지 데이터 엘리먼트",
        type: "element",
        format: "/admin/websectionGroup", // 데이터 유형 (경로)
        store: "/memory/static", // 보관 정책 (경로)
        processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
        processingInterval: "10", // 0: 초기 한번 수집
        processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
        sources: "/webserver/admin/config/webpage",
      },
    ],
  },
];

export const elementData = [
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/common",
    "common",
    "공통",
    "공통 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/common/menu",
    "menu",
    "메뉴",
    "메뉴 데이터 엘리먼트",
    "",
    "",
    "/web/menu",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "",
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/cbm",
    "cbm",
    "CBM",
    "CBM 전용 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/cbm/config",
    "config",
    "Config",
    "CBM 설정 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/config/Line",
    "Line",
    "노선",
    "노선정보 데이터 엘리먼트",
    "",
    "",
    "/config/Line",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/config/Line",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/config/TrainPerLine",
    "TrainPerLine",
    "노선별편성정보",
    "노선별 편성정보 데이터 엘리먼트",
    "",
    "",
    "/config/TrainPerLine",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/config/TrainPerLine",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/config/CarPerTrain",
    "CarPerTrain",
    "편성별차량정보",
    "편성별차량정보 데이터 엘리먼트",
    "",
    "",
    "/config/CarPerTrain",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/config/CarPerTrain",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/config/DevicePerCar",
    "DevicePerCar",
    "차량별장치정보",
    "차량별장치정보 데이터 엘리먼트",
    "",
    "",
    "/config/DevicePerCar",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/config/DevicePerCar",
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/cbm/status",
    "status",
    "상태",
    "상태 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element", // LossPerLine
    "/nex-admin",
    "/webclient", // webclient
    "/cbm/status/LossPerLine", // path
    "LossPerLine", // name
    "노선별 열화 현황", // dispName
    "노선별 열화 현상 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/status/alert-warning", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/status/LossPerLine", // sources
  ],
  [
    "element", // LossPerDevice
    "/nex-admin",
    "/webclient", // webclient
    "/cbm/status/LossPerDevice", // path
    "LossPerDevice", // name
    "장치별 열화 현상", // dispName
    "장치치별 열화 현상 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/status/alert-warning", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/status/LossPerDevice", // sources
  ],
  [
    "element",
    "/nex-admin",
    "/webclient", // webclient
    "/cbm/status/TrainCountPerLine", // path
    "TrainCountPerLine", // name
    "노선별 편성 수", // dispName
    "노선별 편성 수 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/status/TrainCountPerLine", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/status/TrainCountPerLine", // sources
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/cbm/event",
    "event",
    "이벤트",
    "이벤트 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element", // RTMaintanaceInfo
    "/nex-admin",
    "/webclient", // webclient
    "/cbm/event/RTMaintanaceInfo", // path
    "RTMaintanaceInfo", // name
    "실시간 유지보수 정보", // dispName
    "실시간 유지보수 정보 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/event/RTMaintanaceInfo", // format
    "/memory/1year", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/event/RTMaintanaceInfo", // sources
  ],
  [
    "element", // SystemEventInfo
    "/nex-admin",
    "/webclient", // webclient
    "/cbm/event/SystemEventInfo", // path
    "SystemEventInfo", // name
    "시스템 이벤트 정보", // dispName
    "시스템 이벤트 정보 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/event/SystemEventInfo", // format
    "/memory/1year", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/event/SystemEventInfo", // sources
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/cbm/history",
    "history",
    "이력",
    "이력 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/history/LossHistoryPerLine",
    "LossHistoryPerLine",
    "노선별 열화 이력",
    "노선별 열화 이력 데이터 엘리먼트",
    "",
    "",
    "/history/LossHistoryPerLine",
    "/memory/7day",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/history/LossHistoryPerLine",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/history/LossHistoryPerDevice",
    "LossHistoryPerDevice",
    "장치별 열화 이력",
    "장치치별 열화 이력 데이터 엘리먼트",
    "",
    "",
    "/history/LossHistoryPerDevice",
    "/memory/7day",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/history/LossHistoryPerDevice",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/history/MaintenanceHistoryPerLine",
    "MaintenanceHistoryPerLine",
    "노선별 유지보수 이력",
    "노선선별 유지보수 이력 데이터 엘리먼트",
    "",
    "",
    "/history/MaintenanceHistoryPerLine",
    "/memory/1year",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/history/MaintenanceHistoryPerLine",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/cbm/history/DetailLossLevelHistory",
    "DetailLossLevelHistory",
    "상세 열화등급 이력",
    "상세 열화등급 이력 데이터 엘리먼트",
    "",
    "",
    "/history/DetailLossLevelHistory",
    "/memory/1year",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/history/DetailLossLevelHistory",
  ],
  [
    "folder",
    "/nex-admin",
    "/webclient",
    "/admin",
    "admin",
    "관리자",
    "관리자 데이터 엘리먼트 폴더",
    "",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/Menu",
    "Menu",
    "메뉴",
    "어드민 메뉴 데이터 엘리먼트",
    "",
    "",
    "/web/menu",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/common/menu",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/project",
    "project",
    "프로젝트",
    "프로젝트 데이터 엘리먼트",
    "",
    "",
    "/admin/projectGroup",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/admin/config/project",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/format",
    "format",
    "포맷",
    "포맷 데이터 엘리먼트",
    "",
    "",
    "/admin/formatGroup",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/store",
    "store",
    "스토어",
    "스토어 데이터 엘리먼트",
    "",
    "",
    "/admin/storeGroup",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/processor",
    "processor",
    "프로세서",
    "프로세서 데이터 엘리먼트",
    "",
    "",
    "/admin/processorGroup",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "",
  ],
  [
    "element", // system
    "/nex-admin", // project
    "/webclient", // webclient
    "/admin/system", // path
    "system", // name
    "시스템", // dispName
    "시스템 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/admin/systemGroup", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/admin/config/system", // sources
  ],
  [
    "element", // element
    "/nex-admin", // project
    "/webclient", // webclient
    "/admin/element", // path
    "element", // name
    "엘리먼트", // dispName
    "엘리먼트 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/admin/elementsGroup", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/admin/config/element", // sources
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/applet",
    "applet",
    "애플릿",
    "애플릿 데이터 엘리먼트",
    "",
    "",
    "/admin/applet",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/admin/config/applet",
  ],
  [
    "element",
    "/nex-admin",
    "/webclient",
    "/admin/themeUser",
    "themeUser",
    "사용자테마",
    "사용자테마 데이터 엘리먼트",
    "",
    "",
    "/admin/themeUser",
    "/memory/static",
    "/common/transparent",
    "10",
    "SEC",
    "/webserver/admin/config/themeUser",
  ],
  [
    "element", // websection
    "/nex-admin", // project
    "/webclient", // webclient
    "/admin/websection", // path
    "websection", // name
    "웹페이지", // dispName
    "웹페이지 데이터 엘리먼트", // description
    "", // icon
    "", // iconColor
    "/admin/websectionGroup", // format
    "/memory/static", // store
    "/common/transparent", // processor
    "10", // processingInterval
    "SEC", // processingUnit
    "/webserver/admin/config/webpage", // sources
  ],
];
