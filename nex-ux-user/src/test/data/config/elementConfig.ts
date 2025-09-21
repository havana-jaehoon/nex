import { NexElementNode, NexFolderNode, NexNodeType } from "type/NexNode";

export const elementConfig: (NexFolderNode | NexElementNode)[] = [
  {
    name: "common",
    dispName: "공통",
    description: "공통 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
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
  },
  {
    name: "cbm",
    dispName: "CBM",
    description: "CBM 전용 데이터 엘리먼트 폴더",
    type: NexNodeType.FOLDER,
    children: [
      {
        name: "config",
        dispName: "CBM",
        description: "CBM 전용 데이터 엘리먼트 폴더",
        type: NexNodeType.FOLDER,
        children: [
          {
            name: "Line",
            dispName: "노선정보",
            description: "노선정보",
            type: NexNodeType.ELEMENT,
            format: "/cbm/config/Line", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/config/TrainPerLine", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/config/CarPerTrain", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/config/DevicePerCar", // 데이터 유형 (경로)
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
        type: NexNodeType.FOLDER,
        children: [
          {
            name: "LossPerLine",
            dispName: "노선별 열화 현황",
            description: "노선별 열화 현상 데이터 엘리먼트",
            type: NexNodeType.ELEMENT,
            format: "/cbm/status/AlertCount", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/status/AlertCount", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/status/TrainCountPerLine", // 데이터 유형 (경로)
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
        type: NexNodeType.FOLDER,
        children: [
          {
            name: "RTMaintenanceInfo",
            dispName: "실시간 유지보수 정보",
            description: "실시간 유지보수 정보 데이터 엘리먼트",
            type: NexNodeType.ELEMENT,
            format: "/cbm/event/RTMaintenanceInfo", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/event/SystemEventInfo", // 데이터 유형 (경로)
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
        type: NexNodeType.FOLDER,
        children: [
          {
            name: "LossHistoryPerLine",
            dispName: "노선별 열화 이력",
            description: "노선별 열화 이력 데이터 엘리먼트",
            type: NexNodeType.ELEMENT,
            format: "/cbm/history/LossHistoryPerLine", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/history/LossHistoryPerDevice", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/history/MaintenanceHistoryPerLine", // 데이터 유형 (경로)
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
            type: NexNodeType.ELEMENT,
            format: "/cbm/history/DetailLossLevelHistory", // 데이터 유형 (경로)
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
    type: NexNodeType.FOLDER,
    children: [
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

  if (!element || element.type !== NexNodeType.ELEMENT) return null;
  return element;
};

//const testData = testDataList["menu"];
