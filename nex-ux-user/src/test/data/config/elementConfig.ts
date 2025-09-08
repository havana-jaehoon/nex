import { NexNode, NexNodeType } from "type/NexNode";

export const elementConfig: NexNode[] = [
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
    name: "emu150cbm",
    dispName: "EMU150-CBM",
    description: "EMU150-CBM 전용 데이터 엘리먼트 폴더",
    type: "folder",
    children: [
      {
        name: "config",
        dispName: "EMU150CBM",
        description: "EMU150-CBM 전용 데이터 엘리먼트 폴더",
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
            name: "RTMaintenanceInfo",
            dispName: "실시간 유지보수 정보",
            description: "실시간 유지보수 정보 데이터 엘리먼트",
            type: "element",
            format: "/event/RTMaintenanceInfo", // 데이터 유형 (경로)
            store: "/memory/1year", // 보관 정책 (경로) => status
            processor: "/common/transparent", // 데이터 수집 및 처리 모듈(경로)
            processingInterval: "10", // 0: 초기 한번 수집
            processingUnit: "SEC", // MSEC, SEC, MIN, SEC, HOUR, DAY, MONTH, YEAR
            sources: "/webserver/event/RTMaintenanceInfo",
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
        dispName: "프로젝트",
        description: "프로젝트 데이터 엘리먼트",
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

export const getTestElement = (path: string) => {
  if (!path || path === null || path === "") return null;
  //console.log("getTestElement path:", path);
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("createDataStore path:", pathList);
  //return new NexAppletStoreTest("", path, testMenuElement);

  let list = elementConfig;
  let element = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    element = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!element) return null;
    //console.log("createDataStore element:", element);
    list = (element.children as any[]) || [];
  }

  if (!element || element.type !== "element") return null;
  return element;
};

//const testData = testDataList["menu"];
