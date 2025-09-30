import {
  NexFeatureType,
  NexFolderNode,
  NexFormatNode,
  NexNode,
  NexNodeType,
} from "type/NexNode";

// 0, common folder format
// CSV-like array: [type, path, name, dispName, description, icon, color]

const webFormatConfig = {
  name: "web",
  dispName: "web 데이터 포맷",
  description: "WEB UI 용 데이터 유형 폴더",
  type: NexNodeType.FOLDER,
  children: [
    {
      name: "menu",
      dispName: "메뉴",
      description: "메뉴 항목",
      type: NexNodeType.FORMAT,
      features: [
        {
          name: "path",
          dispName: "Type",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING,
        },
        {
          name: "item",
          dispName: "Path",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: true,
          featureType: NexFeatureType.JSON,
        },
      ],
    },
  ],
};

const adminFormatConfig = {
  name: "admin",
  dispName: "admin",
  description: "admin 데이터 유형 폴더",
  type: NexNodeType.FOLDER,
  children: [
    {
      name: "node",
      dispName: "Admin Node",
      description: "Admin Node 데이터 포맷",
      type: NexNodeType.FORMAT,
      isTree: true,
      features: [
        {
          name: "index",
          dispName: "Index",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: true,
          featureType: NexFeatureType.INDEX,
        },
        {
          name: "path",
          dispName: "경로",
          icon: null,
          color: null,
          type: NexNodeType.FEATURE,
          isKey: false,
          featureType: NexFeatureType.STRING,
        },
        {
          name: "data",
          dispName: "노드",
          description: "노드 정보",
          type: NexNodeType.FEATURE,
          icon: null,
          color: null,
          featureType: NexFeatureType.JSON,
        },
      ],
    },
  ],
};

const cbmFormatConfig: any = {
  name: "cbm",
  dispName: "CBM 설정 데이터",
  description: "CBM 설정 데이터 엘리먼트 폴더",
  type: NexNodeType.FOLDER,
  children: [
    {
      name: "config",
      dispName: "설정 데이터",
      description: "설정 데이터 엘리먼트 폴더",
      type: NexNodeType.FOLDER,
      children: [
        {
          name: "Line",
          dispName: "호선",
          description: "호선 데이터 포맷",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "name",
              dispName: "호선명",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: "literals", // 호선명은 문자열로 처리
              literals: [
                {
                  value: "경부선",
                  description: "경부선",
                  icon: "",
                  color: "#003da5",
                }, // blue
                {
                  value: "호남선",
                  description: "호남선",
                  icon: "",
                  color: "#d50032",
                }, // red
                {
                  value: "전라선",
                  description: "전라선",
                  icon: "",
                  color: "#73c42d",
                }, // green
                {
                  value: "동해선",
                  description: "동해선",
                  icon: "",
                  color: "#d96b80",
                }, // pink
                {
                  value: "태백선",
                  description: "태백선",
                  icon: "",
                  color: "#7ba05b",
                }, // orange
                {
                  value: "미배치",
                  description: "미배치",
                  icon: "",
                  color: "#adb81d",
                }, // yellow
              ],
            },
          ],
        },
        {
          name: "TrainPerLine",
          dispName: "노선별편성정보",
          description: "노선별편성정보 데이터 포맷",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "line",
              dispName: "호선명",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
          ],
        },
        {
          name: "CarPerTrain",
          dispName: "편성별차량정보",
          description: "편성별차량정보 데이터 포맷",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "line",
              dispName: "호선명",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
            {
              name: "car",
              dispName: "차량번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 차량번호는 문자열로 처리
            },
          ],
        },
        {
          name: "DevicePerCar",
          dispName: "차량별장치정보",
          description: "차량별장치정보 데이터 포맷",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "line",
              dispName: "호선명",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 호선명은 문자열로 처리
            },
            {
              name: "car",
              dispName: "차량번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 차량번호는 문자열로 처리
            },
            {
              name: "device",
              dispName: "장치번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING, // 장치번호는 문자열로 처리
            },
          ],
        },
      ],
    },
    {
      name: "status",
      dispName: "상태 데이터",
      description: "상태 데이터 엘리먼트 폴더",
      type: NexNodeType.FOLDER,
      children: [
        {
          name: "AlertCount",
          dispName: "주의 경고 건수",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "label",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "alert",
              dispName: "경고",
              icon: null,
              color: "#f0142f",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "warning",
              dispName: "주의",
              icon: null,
              color: "#feb200", // 찐 노랑색 #
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT32",
            },
          ],
        },
        {
          name: "Counting",
          dispName: "건수",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "label",
              dispName: "라벨",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "count",
              dispName: "건수",
              icon: null,
              color: "#f0142f",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT32",
            },
          ],
        },
        {
          name: "TrainCountPerLine",
          dispName: "건수",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#003da5", //blue
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#d50032",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "동해선",
              icon: null,
              color: "#d96b80",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "전라선",
              icon: null,
              color: "#73c42d",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#7ba05b",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#adb81d",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
      ],
    },
    {
      name: "event",
      dispName: "이벤트 데이터",
      description: "이벤트 데이터 엘리먼트 폴더",
      type: NexNodeType.FOLDER,
      children: [
        {
          name: "RTMaintenanceInfo",
          dispName: "실시간 유지보수 정보",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "DATE",
            },
            {
              name: "train",
              dispName: "편성번호",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "car",
              dispName: "차량",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "device",
              dispName: "장치",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "recommendation",
              dispName: "권장조치",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
          ],
        },
        {
          name: "SystemEventInfo",
          dispName: "시스템 이벤트 정보",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "DATE_SEC",
            },
            {
              name: "system",
              dispName: "시스템",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "event",
              dispName: "이벤트명",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "log",
              dispName: "시스템로그",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
            },
          ],
        },
      ],
    },
    {
      name: "history",
      dispName: "이력 데이터",
      description: "이력 데이터 엘리먼트 폴더",
      type: NexNodeType.FOLDER,
      children: [
        {
          name: "LossHistoryPerLine",
          dispName: "호선별 손실 이력",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#0000FF",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#FF0000", //red
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "전라선",
              icon: null,
              color: "#FF00FF", //pink
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "동해선",
              icon: null,
              color: "#00FF00",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#FFA500", //orange
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#6A5ACD", //보라색
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "LossHistoryPerDevice",
          dispName: "장치별 열화 이력",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "main-transformer",
              dispName: "주변압기",
              icon: null,
              color: "#FF0000",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "main-air-compressor",
              dispName: "주공기압축기",
              icon: null,
              color: "#00BFFF", //skyblue
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "aux-air-compressor",
              dispName: "보조공기압축기",
              icon: null,
              color: "#6A5ACD", //보라색 orange
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "door",
              dispName: "승강문",
              icon: null,
              color: "#FF00FF",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "hvac",
              dispName: "HAVC",
              icon: null,
              color: "#00FF00",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "traction-motor",
              dispName: "견인전동기",
              icon: null,
              color: "#FFA500",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "fire-detector",
              dispName: "화제감지기",
              icon: null,
              color: "#FF1493", //deep pink
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "axle-bearing",
              dispName: "차축베어링",
              icon: null,
              color: "#0000FF", //blue
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "broadcast-device",
              dispName: "방송장치",
              icon: null,
              color: "#FF4500", //orange red
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "MaintenanceHistoryPerLine",
          dispName: "노선별 유지보수 이력",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "line1",
              dispName: "경부선",
              icon: null,
              color: "#0000FF",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line2",
              dispName: "호남선",
              icon: null,
              color: "#FF0000", //red
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line3",
              dispName: "전라선",
              icon: null,
              color: "#FF00FF", //pink
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line4",
              dispName: "동해선",
              icon: null,
              color: "#00FF00",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line5",
              dispName: "태백선",
              icon: null,
              color: "#FFA500", //orange
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
            {
              name: "line6",
              dispName: "미배치",
              icon: null,
              color: "#6A5ACD", //보라색
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: "UINT16",
            },
          ],
        },
        {
          name: "DetailLossLevelHistory",
          dispName: "상세 열화등급 이력",
          type: NexNodeType.FORMAT,
          features: [
            {
              name: "date",
              dispName: "날짜",
              icon: null,
              color: null,
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: "DATE",
            },
            {
              name: "line",
              dispName: "노선",
              icon: null,
              color: "#FF0000",
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: "literals",
              literals: [
                {
                  value: "경부선",
                  description: "경부선",
                  icon: "",
                  color: "#003da5",
                }, // blue
                {
                  value: "호남선",
                  description: "호남선",
                  icon: "",
                  color: "#d50032",
                }, // red
                {
                  value: "전라선",
                  description: "전라선",
                  icon: "",
                  color: "#73c42d",
                }, // green
                {
                  value: "동해선",
                  description: "동해선",
                  icon: "",
                  color: "#d96b80",
                }, // pink
                {
                  value: "태백선",
                  description: "태백선",
                  icon: "",
                  color: "#7ba05b",
                }, // orange
                {
                  value: "미배치",
                  description: "미배치",
                  icon: "",
                  color: "#adb81d",
                }, // yellow
              ],
            },
            {
              name: "train",
              dispName: "편성",
              icon: null,
              color: "#00BFFF", //skyblue
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
            },
            {
              name: "car",
              dispName: "차량",
              icon: null,
              color: "#6A5ACD", //보라색 orange
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
              categorys: ["TC1", "M1", "M2", "TC2"],
            },
            {
              name: "device",
              dispName: "장치",
              icon: null,
              color: "#FF00FF",
              type: NexNodeType.FEATURE,
              isKey: true,
              featureType: NexFeatureType.STRING,
              categorys: [
                "승강문",
                "주변압기",
                "주공기압축기",
                "보조공기압축기",
                "HAVC",
                "화제감지기",
                "차축베어링",
                "방송장치",
              ],
            },
            {
              name: "loss-level",
              dispName: "등급",
              icon: null,
              color: "#00FF00",
              type: NexNodeType.FEATURE,
              isKey: false,
              featureType: NexFeatureType.STRING,
              categorys: ["정상", "주의", "경고"],
            },
          ],
        },
      ],
    },
  ],
};

export const formatConfig: any[] = [
  webFormatConfig,
  adminFormatConfig,
  cbmFormatConfig,
];

export const getTestFormat = (path: string) => {
  if (!path || path === null) return null;
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("createDataStore path:", pathList);
  //return new NexAppletStoreTest("", path, testMenuElement);

  let list = formatConfig as any[];
  let node = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    node = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!node) return null;
    //console.log("createDataStore node:", node);
    list = (node.children as any[]) || [];
  }

  if (
    !node ||
    !(node.type === NexNodeType.FORMAT || node.type === NexNodeType.FOLDER)
  ) {
    console.error("Invalid format node:", node);
    return null;
  }
  return node;
};

//const testData = testDataList["menu"];
