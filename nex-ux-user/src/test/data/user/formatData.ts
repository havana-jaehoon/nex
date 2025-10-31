// format, folder, project
// CSV-like array: [type, project-path, system-path, path, name, dispName, description, icon, color]

import { NexFeatureType, NexNodeType } from "type/NexNode";

const webFormatData = [
  [
    "/web",
    {
      name: "web",
      dispName: "Web",
      description: "Web용 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/web/menu",
    {
      name: "menu",
      dispName: "메뉴항목",
      description: "메뉴 항목 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: "",
      color: "",
    },
  ],
  [
    "/web/menu/path",
    {
      name: "path",
      dispName: "Path",
      description: "메뉴 경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/web/menu/item",
    {
      name: "item",
      dispName: "메뉴 아이템",
      description: "메뉴 아이템",
      icon: null,
      color: null,
      featureType: NexFeatureType.JSON,
    },
  ],
];

const adminFormatData = [
  [
    "/admin",
    {
      name: "admin",
      dispName: "Admin",
      description: "Admin 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/admin/node",
    {
      name: "node",
      dispName: "Admin Node",
      description: "Admin Node 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: "",
      color: "",
    },
  ],
  [
    "/admin/node/path",
    {
      name: "path",
      dispName: "경로",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/admin/node/data",
    {
      name: "data",
      dispName: "노드 데이터",
      description: "노드 데이터",
      icon: null,
      color: null,
      featureType: NexFeatureType.JSON,
    },
  ],
];

const cbmFormatData = [
  [
    "/cbm",
    {
      name: "cbm",
      dispName: "CBM",
      description: "CBM용 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/cbm/config",
    {
      name: "config",
      dispName: "설정",
      description: "CBM용 설정 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/cbm/config/Line",
    {
      name: "Line",
      dispName: "호선",
      description: "호선 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config/Line/name",
    {
      name: "name",
      dispName: "호선명",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.LITERALS, // 호선명은 문자열로 처리
      literals: [
        {
          name: "경부선",
          dispName: "경부선",
          icon: "",
          color: "#003da5",
        }, // blue
        {
          name: "호남선",
          dispName: "호남선",
          icon: "",
          color: "#d50032",
        }, // red
        {
          name: "전라선",
          dispName: "전라선",
          icon: "",
          color: "#73c42d",
        }, // green
        {
          name: "동해선",
          dispName: "동해선",
          icon: "",
          color: "#d96b80",
        }, // pink
        {
          name: "태백선",
          dispName: "태백선",
          description: "태백선",
          icon: "",
          color: "#7ba05b",
        }, // orange
        {
          name: "미배치",
          dispName: "미배치",
          icon: "",
          color: "#adb81d",
        }, // yellow
      ],
    },
  ],
  [
    "/cbm/config/TrainPerLine",
    {
      name: "TrainPerLine",
      dispName: "노선별편성정보",
      description: "노선별편성정보 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config/TrainPerLine/line",
    {
      name: "line",
      dispName: "호선명",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],
  [
    "/cbm/config/TrainPerLine/train",
    {
      name: "train",
      dispName: "편성번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],

  [
    "/cbm/config/CarPerTrain",
    {
      name: "CarPerTrain",
      dispName: "편성별차량정보",
      description: "편성별차량정보 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config/CarPerTrain/line",
    {
      name: "line",
      dispName: "호선명",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],
  [
    "/cbm/config/CarPerTrain/train",

    {
      name: "train",
      dispName: "편성번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],
  [
    "/cbm/config/CarPerTrain/car",
    {
      name: "car",
      dispName: "차량번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 차량번호는 문자열로 처리
    },
  ],
  [
    "/cbm/config/DevicePerCar",
    {
      name: "DevicePerCar",
      dispName: "차량별장치정보",
      description: "차량별장치정보 데이터 포맷",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/config/DevicePerCar/line",
    {
      name: "line",
      dispName: "호선명",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],
  [
    "/cbm/config/DevicePerCar/train",
    {
      name: "train",
      dispName: "편성번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
    },
  ],
  [
    "/cbm/config/DevicePerCar/car",
    {
      name: "car",
      dispName: "차량번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 차량번호는 문자열로 처리
    },
  ],
  [
    "/cbm/config/DevicePerCar/device",
    {
      name: "device",
      dispName: "장치번호",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING, // 장치번호는 문자열로 처리
    },
  ],
  [
    "/cbm/status",
    {
      name: "status",
      dispName: "상태",
      description: "CBM용 상태 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/cbm/status/AlertCount",
    {
      name: "AlertCount",
      dispName: "주의 경고 건수",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/status/AlertCount/label",
    {
      name: "label",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/status/AlertCount/alert",
    {
      name: "alert",
      dispName: "경고",
      icon: null,
      color: "#f0142f",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/AlertCount/warning",
    {
      name: "warning",
      dispName: "주의",
      icon: null,
      color: "#feb200", // 찐 노랑색 #
      isKey: false,
      featureType: "UINT32",
    },
  ],
  [
    "/cbm/status/Counting",
    {
      name: "Counting",
      dispName: "건수",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/status/Counting/label",
    {
      name: "label",
      dispName: "라벨",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/status/Counting/count",
    {
      name: "count",
      dispName: "건수",
      icon: null,
      color: "#f0142f",
      isKey: false,
      featureType: "UINT32",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine",
    {
      name: "TrainCountPerLine",
      dispName: "건수",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line1",
    {
      name: "line1",
      dispName: "경부선",
      icon: null,
      color: "#003da5", //blue
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line2",

    {
      name: "line2",
      dispName: "호남선",
      icon: null,
      color: "#d50032",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line3",
    {
      name: "line3",
      dispName: "동해선",
      icon: null,
      color: "#d96b80",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line4",
    {
      name: "line4",
      dispName: "전라선",
      icon: null,
      color: "#73c42d",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line5",
    {
      name: "line5",
      dispName: "태백선",
      icon: null,
      color: "#7ba05b",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/status/TrainCountPerLine/line6",
    {
      name: "line6",
      dispName: "미배치",
      icon: null,
      color: "#adb81d",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/event",
    {
      name: "event",
      dispName: "이벤트",
      description: "CBM용 이벤트 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo",
    {
      name: "RTMaintenanceInfo",
      dispName: "실시간 유지보수 정보",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo/date",
    {
      name: "date",
      dispName: "날짜",
      icon: null,
      color: null,
      isKey: false,
      featureType: "DATE",
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo/train",
    {
      name: "train",
      dispName: "편성번호",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo/car",
    {
      name: "car",
      dispName: "차량",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo/device",
    {
      name: "device",
      dispName: "장치",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/RTMaintenanceInfo/recommendation",
    {
      name: "recommendation",
      dispName: "권장조치",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/SystemEventInfo",
    {
      name: "SystemEventInfo",
      dispName: "시스템 이벤트 정보",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/event/SystemEventInfo/date",
    {
      name: "date",
      dispName: "날짜",
      icon: null,
      color: null,
      isKey: false,
      featureType: "DATE_SEC",
    },
  ],
  [
    "/cbm/event/SystemEventInfo/system",
    {
      name: "system",
      dispName: "시스템",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/SystemEventInfo/event",
    {
      name: "event",
      dispName: "이벤트명",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/event/SystemEventInfo/log",
    {
      name: "log",
      dispName: "시스템로그",
      icon: null,
      color: null,
      isKey: false,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/history",
    {
      name: "history",
      dispName: "이력",
      description: "CBM용 이력 데이터 포맷 폴더",
      type: NexNodeType.FOLDER,
      icon: "",
      color: "",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine",
    {
      name: "LossHistoryPerLine",
      dispName: "호선별 손실 이력",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/date",
    {
      name: "date",
      dispName: "날짜",
      icon: null,
      color: null,
      isKey: true,
      featureType: "DATE",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line1",
    {
      name: "line1",
      dispName: "경부선",
      icon: null,
      color: "#0000FF",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line2",
    {
      name: "line2",
      dispName: "호남선",
      icon: null,
      color: "#FF0000", //red
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line3",
    {
      name: "line3",
      dispName: "전라선",
      icon: null,
      color: "#FF00FF", //pink
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line4",
    {
      name: "line4",
      dispName: "동해선",
      icon: null,
      color: "#00FF00",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line5",
    {
      name: "line5",
      dispName: "태백선",
      icon: null,
      color: "#FFA500", //orange
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerLine/line6",
    {
      name: "line6",
      dispName: "미배치",
      icon: null,
      color: "#6A5ACD", //보라색
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice",
    {
      name: "LossHistoryPerDevice",
      dispName: "장치별 열화 이력",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/date",
    {
      name: "date",
      dispName: "날짜",
      icon: null,
      color: null,
      isKey: true,
      featureType: "DATE",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/main-transformer",
    {
      name: "main-transformer",
      dispName: "주변압기",
      icon: null,
      color: "#FF0000",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/main-air-compressor",
    {
      name: "main-air-compressor",
      dispName: "주공기압축기",
      icon: null,
      color: "#00BFFF", //skyblue
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/aux-air-compressor",
    {
      name: "aux-air-compressor",
      dispName: "보조공기압축기",
      icon: null,
      color: "#6A5ACD", //보라색 orange
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/door",
    {
      name: "door",
      dispName: "승강문",
      icon: null,
      color: "#FF00FF",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/hvac",
    {
      name: "hvac",
      dispName: "HAVC",
      icon: null,
      color: "#00FF00",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/traction-motor",
    {
      name: "traction-motor",
      dispName: "견인전동기",
      icon: null,
      color: "#FFA500",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/fire-detector",
    {
      name: "fire-detector",
      dispName: "화제감지기",
      icon: null,
      color: "#FF1493", //deep pink
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/axle-bearing",
    {
      name: "axle-bearing",
      dispName: "차축베어링",
      icon: null,
      color: "#0000FF", //blue
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/LossHistoryPerDevice/broadcast-device",
    {
      name: "broadcast-device",
      dispName: "방송장치",
      icon: null,
      color: "#FF4500", //orange red
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine",
    {
      name: "MaintenanceHistoryPerLine",
      dispName: "노선별 유지보수 이력",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/date",
    {
      name: "date",
      icon: null,
      color: null,
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line1",
    {
      name: "line1",
      dispName: "경부선",
      icon: null,
      color: "#0000FF",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line2",
    {
      name: "line2",
      dispName: "호남선",
      icon: null,
      color: "#FF0000", //red
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line3",
    {
      name: "line3",
      dispName: "전라선",
      icon: null,
      color: "#FF00FF", //pink
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line4",
    {
      name: "line4",
      dispName: "동해선",
      icon: null,
      color: "#00FF00",
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line5",
    {
      name: "line5",
      dispName: "태백선",
      icon: null,
      color: "#FFA500", //orange
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/MaintenanceHistoryPerLine/line6",
    {
      name: "line6",
      dispName: "미배치",
      icon: null,
      color: "#6A5ACD", //보라색
      isKey: false,
      featureType: "UINT16",
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory",
    {
      name: "DetailLossLevelHistory",
      dispName: "상세 열화등급 이력",
      type: NexNodeType.FORMAT,
      icon: null,
      color: null,
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/date",
    {
      name: "date",
      dispName: "날짜",
      icon: null,
      color: null,
      isKey: true,
      featureType: "DATE",
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/line",
    {
      name: "line",
      dispName: "노선",
      icon: null,
      color: "#FF0000",
      isKey: true,
      featureType: "literals",
      literals: [
        {
          name: "경부선",
          dispName: "경부선",
          icon: "",
          color: "#003da5",
        }, // blue
        {
          name: "호남선",
          dispName: "호남선",
          icon: "",
          color: "#d50032",
        }, // red
        {
          name: "전라선",
          dispName: "전라선",
          icon: "",
          color: "#73c42d",
        }, // green
        {
          name: "동해선",
          description: "동해선",
          icon: "",
          color: "#d96b80",
        }, // pink
        {
          name: "태백선",
          dispName: "태백선",
          icon: "",
          color: "#7ba05b",
        }, // orange
        {
          name: "미배치",
          dispName: "미배치",
          icon: "",
          color: "#adb81d",
        }, // yellow
      ],
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/train",
    {
      name: "train",
      dispName: "편성",
      icon: null,
      color: "#00BFFF", //skyblue
      isKey: true,
      featureType: NexFeatureType.STRING,
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/car",
    {
      name: "car",
      dispName: "차량",
      icon: null,
      color: "#6A5ACD", //보라색 orange
      isKey: true,
      featureType: NexFeatureType.LITERALS,
      literals: [
        { name: "TC1", dispName: "TC1", icon: "", color: "#FF6347" }, // tomato
        { name: "M1", dispName: "M1", icon: "", color: "#40E0D0" }, // turquoise
        { name: "M2", dispName: "M2", icon: "", color: "#8A2BE2" }, // blueviolet
        { name: "TC2", dispName: "TC2", icon: "", color: "#FFD700" }, // gold
      ],
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/device",
    {
      name: "device",
      dispName: "장치",
      icon: null,
      color: "#FF00FF",
      isKey: true,
      featureType: NexFeatureType.LITERALS,
      literals: [
        { name: "승강문", dispName: "승강문", icon: "", color: "#FF69B4" }, // hotpink
        { name: "주변압기", dispName: "주변압기", icon: "", color: "#FF4500" }, // orangered
        {
          name: "주공기압축기",
          dispName: "주공기압축기",
          icon: "",
          color: "#1E90FF",
        }, // dodgerblue
        {
          name: "보조공기압축기",
          dispName: "보조공기압축기",
          icon: "",
          color: "#9370DB",
        }, // mediumpurple
        { name: "HAVC", dispName: "HAVC", icon: "", color: "#32CD32" }, // limegreen
        {
          name: "화제감지기",
          dispName: "화제감지기",
          icon: "",
          color: "#FF1493",
        }, // deep pink
        {
          name: "차축베어링",
          dispName: "차축베어링",
          icon: "",
          color: "#0000FF",
        }, // blue
        { name: "방송장치", dispName: "방송장치", icon: "", color: "#FF8C00" }, // darkorange
      ],
    },
  ],
  [
    "/cbm/history/DetailLossLevelHistory/loss-level",
    {
      name: "loss-level",
      dispName: "등급",
      icon: null,
      color: "#00FF00",
      isKey: false,
      featureType: NexFeatureType.LITERALS,
      literals: [
        { name: "정상", dispName: "정상", icon: "", color: "#00FF00" },
        { name: "주의", dispName: "주의", icon: "", color: "#FFFF00" },
        { name: "경고", dispName: "경고", icon: "", color: "#FF0000" },
      ],
    },
  ],
];

export const formatData = [
  // web 메뉴 데이터 포맷
  ...webFormatData,

  // admin용 데이터 포맷 폴더
  ...adminFormatData,
  //...adminElementFormatData,

  ...cbmFormatData,
];
