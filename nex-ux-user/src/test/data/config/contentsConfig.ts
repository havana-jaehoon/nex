import {
  NexCondition,
  NexContentsNode,
  NexFolderNode,
  NexNode,
  NexNodeType,
  NexSelection,
} from "type/NexNode";

// Common Contents
const menuContents: NexContentsNode = {
  name: "menu",
  dispName: "Menu",
  type: NexNodeType.CONTENTS,
  element: "/common/menu",
  condition: [],
  selection: [],
};

const sampleContents: NexContentsNode = {
  name: "sample",
  dispName: "Sample",
  type: NexNodeType.CONTENTS,
  element: "/cbm/history/LossHistoryPerDevice",
  condition: [],
  selection: [],
};

//cbm Contents
const lineSelection: NexSelection = {
  key: "line",
  feature: "line",
};

const lineCondition: NexCondition = {
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

const cbmConfigContents = [
  {
    name: "Line",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/Line",
    condition: [],
    selection: [lineSelection],
  } as NexContentsNode,
  {
    name: "TrainPerLine",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/TrainPerLine",
    condition: [],
    selection: [trainSelection],
  },
  {
    name: "SelectedTrain",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/TrainPerLine",
    condition: [lineCondition],
    selection: [trainSelection],
  },
  {
    name: "CarPerTrain",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/CarPerTrain",
    condition: [],
    selection: [carSelection],
  },
  {
    name: "SelectedCar",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/CarPerTrain",
    condition: [trainCondition],
    selection: [carSelection],
  },
  {
    name: "Device",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/Device", // Device / car
    condition: [],
    selection: [deviceSelection],
  },
  {
    name: "SelectedDevice",
    type: NexNodeType.CONTENTS,
    element: "/cbm/config/Device",
    condition: [carCondition],
    selection: [],
  },
];

//status
const cbmStatusContents = [
  {
    name: "LossPerLine",
    type: NexNodeType.CONTENTS,
    element: "/cbm/status/LossPerLine",
    condition: [],
    selection: [],
  },
  {
    name: "LossPerDevice",
    type: NexNodeType.CONTENTS,
    element: "/cbm/status/LossPerDevice",
    condition: [],
    selection: [],
  },

  {
    name: "TrainCountPerLine",
    type: NexNodeType.CONTENTS,
    element: "/cbm/status/TrainCountPerLine",
    condition: [],
    selection: [],
  },
];

// history
const cbmHistoryContents = [
  {
    name: "LossHistoryPerLine",
    type: NexNodeType.CONTENTS,
    element: "/cbm/history/LossHistoryPerLine",
    condition: [],
    selection: [],
  },
  {
    name: "LossHistoryPerDevice",
    type: NexNodeType.CONTENTS,
    element: "/cbm/history/LossHistoryPerDevice",
    condition: [],
    selection: [],
  },
  {
    name: "MaintenancePerLineHistory",
    type: NexNodeType.CONTENTS,
    element: "/cbm/history/MaintenanceHistoryPerLine",
    condition: [],
    selection: [],
  },
  {
    name: "DetailLossLevelHistory",
    type: NexNodeType.CONTENTS,
    element: "/cbm/history/DetailLossLevelHistory",
    condition: [],
    selection: [],
  },
  {
    name: "SelectedDetailLossLevelHistory",
    type: NexNodeType.CONTENTS,
    element: "/cbm/history/DetailLossLevelHistory",
    condition: [],
    selection: [],
  },
];

//event
const cbmEventContents = [
  {
    name: "RTMaintenanceInfo",
    type: NexNodeType.CONTENTS,
    element: "/cbm/event/RTMaintenanceInfo",
    condition: [],
    selection: [],
  },
  {
    name: "SystemEventInfo",
    type: NexNodeType.CONTENTS,
    element: "/cbm/event/SystemEventInfo",
    condition: [],
    selection: [],
  },
];

// Admin Contents

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
  feature: "path",
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

const sectionSelection = {
  key: "section-path",
  feature: "path",
};

const sectionCondition = {
  key: "section-path",
  feature: "path",
  method: "pathmatch",
};

const formatContents = {
  name: "format",
  type: NexNodeType.CONTENTS,
  element: "/admin/format",
  conditions: [],
  selections: [formatSelection],
};

const oneFormatContents = {
  name: "SelectedFormat",
  type: NexNodeType.CONTENTS,
  element: "/admin/format",
  conditions: [formatCondition],
  selections: [],
};

const storeContents = {
  name: "store",
  dispName: "저장소",
  type: NexNodeType.CONTENTS,
  element: "/admin/store",
  conditions: [],
  selections: [storeSelection],
};

const oneStoreContents = {
  name: "SelectedStore",
  dispName: "저장소",
  type: NexNodeType.CONTENTS,
  element: "/admin/store",
  conditions: [storeCondition],
  selections: [],
};

const processorContents = {
  name: "processor",
  dispName: "프로세서",
  type: NexNodeType.CONTENTS,
  element: "/admin/processor",
  conditions: [],
  selections: [processorSelection],
};

const oneProcessorContents = {
  name: "SelectedProcessor",
  dispName: "프로세서",
  type: NexNodeType.CONTENTS,
  element: "/admin/processor",
  conditions: [processorCondition],
  selections: [],
};

const systemContents = {
  name: "system",
  dispName: "시스템",
  type: NexNodeType.CONTENTS,
  element: "/admin/system",
  conditions: [],
  selections: [systemSelection],
};

const oneSystemContents = {
  name: "SelectedSystem",
  dispName: "시스템",
  type: NexNodeType.CONTENTS,
  element: "/admin/system",
  conditions: [systemCondition],
  selections: [],
};

const elementContents = {
  name: "element",
  dispName: "엘리먼트",
  type: NexNodeType.CONTENTS,
  element: "/admin/element",
  conditions: [],
  selections: [elementSelection],
};

const oneElementContents = {
  name: "SelectedElement",
  dispName: "엘리먼트",
  type: NexNodeType.CONTENTS,
  element: "/admin/element",
  conditions: [elementCondition],
  selections: [],
};

const sectionContents = {
  name: "section",
  dispName: "웹 섹션",
  type: NexNodeType.CONTENTS,
  element: "/admin/section",
  conditions: [], //[projectCondition],
  selections: [sectionSelection],
};

const oneSectionContents = {
  name: "SelectedSection",
  dispName: "웹 섹션",
  type: NexNodeType.CONTENTS,
  element: "/admin/section",
  conditions: [sectionCondition], //[projectCondition, systemCondition, sectionCondition],
  selections: [],
};

export const contentsConfig: any[] = [
  {
    type: NexNodeType.FOLDER,
    name: "common",
    dispName: "공통",
    description: "공통 폴더",
    children: [menuContents, sampleContents],
  },
  {
    type: NexNodeType.FOLDER,
    name: "cbm",
    dispName: "CBM",
    description: "CBM 용 컨텐츠 폴더",
    children: [
      {
        type: NexNodeType.FOLDER,
        name: "config",
        dispName: "설정 데이터",
        description: "설정 데이터 컨텐츠 폴더",
        children: [...cbmConfigContents],
      },
      {
        type: NexNodeType.FOLDER,
        name: "status",
        dispName: "상태 데이터",
        description: "상태 데이터 컨텐츠 폴더",
        children: [...cbmStatusContents],
      },
      {
        type: NexNodeType.FOLDER,
        name: "history",
        dispName: "이력 데이터",
        description: "이력 데이터 컨텐츠 폴더",
        children: [...cbmHistoryContents],
      },
      {
        type: NexNodeType.FOLDER,
        name: "event",
        dispName: "이벤트 데이터",
        description: "이벤트 데이터 컨텐츠 폴더",
        children: [...cbmEventContents],
      },
    ],
  },
  {
    type: NexNodeType.FOLDER,
    name: "admin",
    dispName: "Admin",
    description: "Admin 용 컨텐츠 폴더",
    children: [
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
      sectionContents,
      oneSectionContents,
    ],
  },
];
