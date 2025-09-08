// Common Contents
const menuContents = {
  name: "menu",
  dispName: "Menu",
  type: "contents",
  element: "/common/menu",
  condition: [],
  selection: [],
};

const sampleContents = {
  name: "sample",
  dispName: "Sample",
  type: "contents",
  element: "/emu150cbm/history/LossHistoryPerDevice",
  condition: [],
  selection: [],
};

//emu150cbm Contents
const lineSelection = {
  key: "line",
  feature: "line",
};

const lineCondition = {
  key: "line",
  feature: "line",
  method: "match",
};

const trainSelection = {
  key: "train",
  feature: "train",
};

const trainCondition = {
  key: "train",
  feature: "train",
  method: "match",
};

const carSelection = {
  key: "car",
  feature: "car",
};

const carCondition = {
  key: "car",
  feature: "car",
  method: "match",
};

const deviceSelection = {
  key: "device",
  feature: "device",
};

const deviceCondition = {
  key: "device",
  feature: "device",
  method: "match",
};

const emu150cbmContents = {
  // config
  config: {
    Line: {
      name: "Line",
      type: "contents",
      element: "/emu150cbm/config/Line",
      condition: [],
      selection: [lineSelection],
    },
    TrainPerLine: {
      name: "TrainPerLine",
      type: "contents",
      element: "/emu150cbm/config/TrainPerLine",
      condition: [],
      selection: [trainSelection],
    },
    SelectedTrain: {
      name: "SelectedTrain",
      type: "contents",
      element: "/emu150cbm/config/TrainPerLine",
      condition: [lineCondition],
      selection: [trainSelection],
    },
    CarPerTrain: {
      name: "CarPerTrain",
      type: "contents",
      element: "/emu150cbm/config/CarPerTrain",
      condition: [],
      selection: [carSelection],
    },
    SelectedCar: {
      name: "SelectedCar",
      type: "contents",
      element: "/emu150cbm/config/CarPerTrain",
      condition: [trainCondition, carSelection],
      selection: [carSelection],
    },
    Device: {
      name: "Device",
      type: "contents",
      element: "/emu150cbm/config/Device", // Device / car
      condition: [],
      selection: [deviceSelection],
    },
    SelectedDevice: {
      name: "SelectedDevice",
      type: "contents",
      element: "/emu150cbm/config/Device",
      condition: [carCondition, deviceCondition],
      selection: [],
    },
  },

  //status
  status: {
    LossPerLine: {
      name: "LossPerLine",
      type: "contents",
      element: "/emu150cbm/status/LossPerLine",
      condition: [],
      selection: [],
    },
    LossPerDevice: {
      name: "LossPerDevice",
      type: "contents",
      element: "/emu150cbm/status/LossPerDevice",
      condition: [],
      selection: [],
    },

    TrainCountPerLine: {
      name: "TrainCountPerLine",
      type: "contents",
      element: "/emu150cbm/status/TrainCountPerLine",
      condition: [],
      selection: [],
    },
  },

  // history
  history: {
    LossHistoryPerLine: {
      name: "LossHistoryPerLine",
      type: "contents",
      element: "/emu150cbm/history/LossHistoryPerLine",
      condition: [],
      selection: [],
    },
    LossHistoryPerDevice: {
      name: "LossHistoryPerDevice",
      type: "contents",
      element: "/emu150cbm/history/LossHistoryPerDevice",
      condition: [],
      selection: [],
    },
    MaintenancePerLineHistory: {
      name: "MaintenancePerLineHistory",
      type: "contents",
      element: "/emu150cbm/history/MaintenanceHistoryPerLine",
      condition: [],
      selection: [],
    },
    DetailLossLevelHistory: {
      name: "DetailLossLevelHistory",
      type: "contents",
      element: "/emu150cbm/history/DetailLossLevelHistory",
      condition: [],
      selection: [],
    },
    SelectedDetailLossLevelHistory: {
      name: "SelectedDetailLossLevelHistory",
      type: "contents",
      element: "/emu150cbm/history/DetailLossLevelHistory",
      condition: [],
      selection: [],
    },
  },

  //event
  event: {
    RTMaintenanceInfo: {
      name: "RTMaintenanceInfo",
      type: "contents",
      element: "/emu150cbm/event/RTMaintenanceInfo",
      condition: [],
      selection: [],
    },
    SystemEventInfo: {
      name: "SystemEventInfo",
      type: "contents",
      element: "/emu150cbm/event/SystemEventInfo",
      condition: [],
      selection: [],
    },
  },
};

// Admin Contents
const projectSelection = {
  key: "project-path",
  feature: "path",
};

const projectCondition = {
  key: "project-path",
  feature: "project",
  method: "pathmatch",
};

const formatSelection = {
  key: "format-path",
  feature: "path",
};

const formatCondition = {
  key: "format-path",
  feature: "path",
  method: "pathmatch",
};

const storeSelection = {
  key: "store-path",
  feature: "path",
};

const storeCondition = {
  key: "store-path",
  feature: "path",
  method: "pathmatch",
};

const processorSelection = {
  key: "processor-path",
  feature: "path",
};

const processorCondition = {
  key: "processor-path",
  feature: "path",
  method: "pathmatch",
};

const systemSelection = {
  key: "system-path",
  feature: "path",
};

const systemCondition = {
  key: "system-path",
  feature: "system",
  method: "pathmatch",
};

const elementSelection = {
  key: "element-path",
  feature: "path",
};

const elementCondition = {
  key: "element-path",
  feature: "path",
  method: "pathmatch",
};

const websectionSelection = {
  key: "websection-path",
  feature: "path",
};

const websectionCondition = {
  key: "websection-path",
  feature: "path",
  method: "pathmatch",
};

const projectContents = {
  name: "project",
  dispName: "프로젝트",
  type: "contents",
  element: "/admin/project",
  conditions: [],
  selections: [projectSelection],
};

const oneProjectContents = {
  name: "SelectedProject",
  dispName: "프로젝트",
  type: "contents",
  element: "/admin/project",
  conditions: [projectCondition],
  selections: [],
};

const formatContents = {
  name: "format",
  type: "contents",
  element: "/admin/format",
  conditions: [projectCondition],
  selections: [formatSelection],
};

const oneFormatContents = {
  name: "SelectedFormat",
  type: "contents",
  element: "/admin/format",
  conditions: [projectCondition, formatCondition],
  selections: [],
};

const storeContents = {
  name: "store",
  dispName: "저장소",
  type: "contents",
  element: "/admin/store",
  conditions: [projectCondition],
  selections: [storeSelection],
};

const oneStoreContents = {
  name: "SelectedStore",
  dispName: "저장소",
  type: "contents",
  element: "/admin/store",
  conditions: [projectCondition, storeCondition],
  selections: [],
};

const processorContents = {
  name: "processor",
  dispName: "프로세서",
  type: "contents",
  element: "/admin/processor",
  conditions: [projectCondition],
  selections: [processorSelection],
};

const oneProcessorContents = {
  name: "SelectedProcessor",
  dispName: "프로세서",
  type: "contents",
  element: "/admin/processor",
  conditions: [projectCondition, processorCondition],
  selections: [],
};

const systemContents = {
  name: "system",
  dispName: "시스템",
  type: "contents",
  element: "/admin/system",
  conditions: [projectCondition],
  selections: [systemSelection],
};

const oneSystemContents = {
  name: "SelectedSystem",
  dispName: "시스템",
  type: "contents",
  element: "/admin/system",
  conditions: [projectCondition, systemCondition],
  selections: [],
};

const elementContents = {
  name: "element",
  dispName: "엘리먼트",
  type: "contents",
  element: "/admin/element",
  conditions: [projectCondition, systemCondition],
  selections: [elementSelection],
};

const oneElementContents = {
  name: "SelectedElement",
  dispName: "엘리먼트",
  type: "contents",
  element: "/admin/element",
  conditions: [projectCondition, systemCondition, elementCondition],
  selections: [],
};

const websectionContents = {
  name: "websection",
  dispName: "웹 섹션",
  type: "contents",
  element: "/admin/websection",
  conditions: [], //[projectCondition],
  selections: [websectionSelection],
};

const oneWebsectionContents = {
  name: "SelectedWebsection",
  dispName: "웹 섹션",
  type: "contents",
  element: "/admin/websection",
  conditions: [websectionCondition], //[projectCondition, systemCondition, websectionCondition],
  selections: [],
};

export const contentsConfig = [
  {
    type: "folder",
    name: "common",
    dispName: "공통",
    description: "공통 폴더",
    children: [menuContents, sampleContents],
  },
  {
    type: "folder",
    name: "emu150cbm",
    dispName: "emu150cbm",
    description: "emu150cbm 용 컨텐츠 폴더",
    children: [
      {
        type: "folder",
        name: "config",
        dispName: "설정 데이터",
        description: "설정 데이터 컨텐츠 폴더",
        children: [
          emu150cbmContents.config.Line,
          emu150cbmContents.config.TrainPerLine,
          emu150cbmContents.config.CarPerTrain,
          emu150cbmContents.config.SelectedTrain,
          emu150cbmContents.config.SelectedCar,
          emu150cbmContents.config.Device,
          emu150cbmContents.config.SelectedDevice,
        ],
      },
      {
        type: "folder",
        name: "status",
        dispName: "상태 데이터",
        description: "상태 데이터 컨텐츠 폴더",
        children: [
          emu150cbmContents.status.LossPerLine,
          emu150cbmContents.status.LossPerDevice,
          emu150cbmContents.status.TrainCountPerLine,
        ],
      },
      {
        type: "folder",
        name: "history",
        dispName: "이력 데이터",
        description: "이력 데이터 컨텐츠 폴더",
        children: [
          emu150cbmContents.history.LossHistoryPerLine,
          emu150cbmContents.history.LossHistoryPerDevice,
          emu150cbmContents.history.DetailLossLevelHistory,
          emu150cbmContents.history.SelectedDetailLossLevelHistory,
          emu150cbmContents.history.MaintenancePerLineHistory,
        ],
      },
      {
        type: "folder",
        name: "event",
        dispName: "이벤트 데이터",
        description: "이벤트 데이터 컨텐츠 폴더",
        children: [
          emu150cbmContents.event.RTMaintenanceInfo,
          emu150cbmContents.event.SystemEventInfo,
        ],
      },
    ],
  },
  {
    type: "folder",
    name: "admin",
    dispName: "Admin",
    description: "Admin 용 컨텐츠 폴더",
    children: [
      projectContents,
      oneProjectContents,
      formatContents,
      oneFormatContents,
      storeContents,
      oneStoreContents,
      processorContents,
      oneProcessorContents,
      systemContents,
      oneSystemContents,
      elementContents,
      oneElementContents,
      websectionContents,
      oneWebsectionContents,
    ],
  },
];
