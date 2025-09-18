import { NexNodeType } from "type/NexNode";

export const elementData = [
  [
    "/common/menu",
    {
      name: "menu",
      dispName: "메뉴",
      description: "메뉴 테스트",
      type: NexNodeType.ELEMENT,
      format: "/web/menu", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "",
    },
  ],
  [
    "/admin/format",
    {
      name: "format",
      dispName: "데이터 포맷",
      description: "데이터 포맷",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/format",
    },
  ],
  [
    "/admin/store",
    {
      name: "store",
      dispName: "데이터 저장 정책",
      description: "데이터 저장 정책",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/store",
    },
  ],
  [
    "/admin/processor",
    {
      name: "processor",
      dispName: "데이터 프로세서",
      description: "데이터 프로세서",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/processor",
    },
  ],
  [
    "/admin/system",
    {
      name: "system",
      dispName: "시스템",
      description: "시스템",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/system",
    },
  ],
  [
    "/admin/element",
    {
      name: "element",
      dispName: "데이터 엘리먼트",
      description: "데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/element",
    },
  ],
  [
    "/admin/source",
    {
      name: "source",
      dispName: "데이터 소스",
      description: "데이터 소스",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/source",
    },
  ],
  [
    "/admin/contents",
    {
      name: "contents",
      dispName: "컨텐츠",
      description: "컨텐츠",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/contents",
    },
  ],
  [
    "/admin/applet",
    {
      name: "applet",
      dispName: "애플릿",
      description: "애플릿",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/applet",
    },
  ],
  [
    "/admin/section",
    {
      name: "section",
      dispName: "웹섹션",
      description: "웹섹션",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/section",
    },
  ],
  [
    "/admin/user",
    {
      name: "user",
      dispName: "사용자",
      description: "사용자",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/user",
    },
  ],
  [
    "/admin/theme",
    {
      name: "theme",
      dispName: "테마",
      description: "테마",
      type: NexNodeType.ELEMENT,
      format: "/admin/node", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/config/admin/theme",
    },
  ],

  [
    "/cbm/config/Line",
    {
      name: "Line",
      dispName: "노선정보",
      description: "노선정보",
      type: NexNodeType.ELEMENT,
      format: "/config/Line", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/config/Line",
    },
  ],
  [
    "/cbm/config/TrainPerLine",
    {
      name: "TrainPerLine",
      dispName: "노선별편성정보",
      description: "노선별 편성정보",
      type: NexNodeType.ELEMENT,
      format: "/config/TrainPerLine", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/config/TrainPerLine",
    },
  ],
  [
    "/cbm/config/CarPerTrain",
    {
      name: "CarPerTrain",
      dispName: "편성별차량정보",
      description: "편성별차량정보",
      type: NexNodeType.ELEMENT,
      format: "/config/CarPerTrain", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/config/CarPerTrain",
    },
  ],
  [
    "/cbm/config/DevicePerCar",
    {
      name: "DevicePerCar",
      dispName: "차량별장치정보",
      description: "차량별장치정보",
      type: NexNodeType.ELEMENT,
      format: "/config/DevicePerCar", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로)
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/config/DevicePerCar",
    },
  ],
  [
    "/cbm/status/LossPerLine",
    {
      name: "LossPerLine",
      dispName: "노선별 열화 현황",
      description: "노선별 열화 현상 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/status/alert-warning", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "",
    },
  ],
  [
    "/cbm/status/LossPerDevice",

    {
      name: "LossPerDevice",
      dispName: "장치별 열화 현상",
      description: "장치치별 열화 현상 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/status/alert-warning", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine",

    {
      name: "TrainCountPerLine",
      dispName: "노선별 편성 수",
      description: "노선별 편성 수 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/status/TrainCountPerLine", // 데이터 유형 (경로)
      store: "/memory/static", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "",
    },
  ],

  [
    "/cbm/event/RTMaintenanceInfo",
    {
      name: "RTMaintenanceInfo",
      dispName: "실시간 유지보수 정보",
      description: "실시간 유지보수 정보 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/event/RTMaintenanceInfo", // 데이터 유형 (경로)
      store: "/memory/1year", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/event/RTMaintenanceInfo",
    },
  ],
  [
    "/cbm/event/SystemEventInfo",
    {
      name: "SystemEventInfo",
      dispName: "시스템 이벤트 정보",
      description: "시스템 이벤트 정보 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/event/SystemEventInfo", // 데이터 유형 (경로)
      store: "/memory/1year", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/event/SystemEventInfo",
    },
  ],

  [
    "/cbm/history/LossHistory",
    {
      name: "LossHistoryPerLine",
      dispName: "노선별 열화 이력",
      description: "노선별 열화 이력 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/history/LossHistoryPerLine", // 데이터 유형 (경로)
      store: "/memory/7day", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/history/LossHistoryPerLine",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice",
    {
      name: "LossHistoryPerDevice",
      dispName: "장치별 열화 이력",
      description: "장치치별 열화 이력 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/history/LossHistoryPerDevice", // 데이터 유형 (경로)
      store: "/memory/7day", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/history/LossHistoryPerDevice",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine",

    {
      name: "MaintenanceHistoryPerLine",
      dispName: "노선별 유지보수 이력",
      description: "노선선별 유지보수 이력 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/history/MaintenanceHistoryPerLine", // 데이터 유형 (경로)
      store: "/memory/1year", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/history/MaintenanceHistoryPerLine",
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory",
    {
      name: "DetailLossLevelHistory",
      dispName: "상세 열화등급 이력",
      description: "상세 열화등급 이력 데이터 엘리먼트",
      type: NexNodeType.ELEMENT,
      format: "/history/DetailLossLevelHistory", // 데이터 유형 (경로)
      store: "/memory/1year", // 보관 정책 (경로) => status
      processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
      processingInterval: "10", // 0: 초기 한번 수집
      processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
      sources: "/webserver/history/DetailLossLevelHistory",
    },
  ],
];
