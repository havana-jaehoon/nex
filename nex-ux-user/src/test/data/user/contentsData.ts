import {
  NexCondition,
  NexContentsNode,
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

export const commonContents = [
  [
    "/common",
    {
      type: NexNodeType.FOLDER,
      name: "common",
      dispName: "공통",
      description: "공통 폴더",
    },
  ],
  [
    "/common/menu",
    {
      name: "menu",
      dispName: "Menu",
      type: NexNodeType.CONTENTS,
      element: "/common/menu",
      condition: [],
      selection: [],
    },
  ],
  [
    "/common/sample",
    {
      name: "sample",
      dispName: "Sample",
      type: NexNodeType.CONTENTS,
      element: "/cbm/history/LossHistoryPerDevice",
      condition: [],
      selection: [],
    },
  ],
];

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

const cbmContents = [
  [
    "/cbm",
    {
      name: "cbm",
      dispName: "CBM",
      description: "CBM 용 컨텐트 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config",
    {
      name: "config",
      dispName: "설정",
      description: "CBM 용 설정 컨텐트 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config/Line",
    {
      name: "Line",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/Line",
      condition: [],
      selection: [lineSelection],
    },
  ],
  [
    "/cbm/config/TrainPerLine",
    {
      name: "TrainPerLine",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/TrainPerLine",
      condition: [],
      selection: [trainSelection],
    },
  ],

  [
    "/cbm/config/SelectedTrain",
    {
      name: "SelectedTrain",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/TrainPerLine",
      condition: [lineCondition],
      selection: [trainSelection],
    },
  ],
  [
    "/cbm/config/CarPerTrain",
    {
      name: "CarPerTrain",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/CarPerTrain",
      condition: [],
      selection: [carSelection],
    },
  ],
  [
    "/cbm/config/SelectedCar",
    {
      name: "SelectedCar",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/CarPerTrain",
      condition: [trainCondition],
      selection: [carSelection],
    },
  ],
  [
    "/cbm/config/Device",
    {
      name: "Device",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/Device", // Device / car
      condition: [],
      selection: [deviceSelection],
    },
  ],
  [
    "/cbm/config/SelectedDevice",
    {
      name: "SelectedDevice",
      type: NexNodeType.CONTENTS,
      element: "/cbm/config/Device",
      condition: [carCondition],
      selection: [],
    },
  ],
  [
    "/cbm/status",
    {
      name: "status",
      dispName: "상태",
      description: "CBM 용 상태 컨텐트 폴더",
      type: NexNodeType.FOLDER,
      icon: null,
      color: null,
    },
  ],
];

const contentsData = [...commonContents, ...cbmContents];
