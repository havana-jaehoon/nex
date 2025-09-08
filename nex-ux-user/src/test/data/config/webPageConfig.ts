import { NexNode } from "type/NexNode";

const padding = "8px";

const nodeSelector = {
  name: "nodeSelector",
  dispName: "",
  description: "노드 선택기 웹 섹션",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeSelector",
  padding: "0",
  contents: ["/admin/project", "/admin/system"],
};

const projectFinder = {
  name: "projectFinder",
  dispName: "프로젝트",

  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/project"],
};

const projectEditor = {
  name: "projectEditor",
  dispName: "프로젝트 설정",

  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedProject"],
};

const projectSection = {
  name: "project",
  dispName: "프로젝트 설정",

  type: "websection",
  size: "5",
  direction: "column",
  children: [projectFinder, projectEditor],
};

const formatFinder = {
  name: "formatFinder",
  dispName: "데이터 유형",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/format"],
};

const formatEditor = {
  name: "formatEditor",
  dispName: "데이터 유형 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedFormat"],
};

const formatSection = {
  name: "formatConfig",
  dispName: "포맷 설정",

  type: "websection",
  size: "5",
  direction: "column",
  children: [formatFinder, formatEditor],
};

const storeFinder = {
  name: "storeFinder",
  dispName: "데이터 저장 정책",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/store"],
};

const storeEditor = {
  name: "storeEditor",
  dispName: "데이터 저장 정책 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedStore"],
};

const storeSection = {
  name: "storeConfig",
  dispName: "저장 정책",

  type: "websection",
  size: "5",
  direction: "column",
  children: [storeFinder, storeEditor],
};

const processorFinder = {
  name: "processor",
  dispName: "데이터 프로세서",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/processor"],
};

const processorEditor = {
  name: "processorEditor",
  dispName: "프로세서 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedProcessor"],
};

const processorSection = {
  name: "processorConfig",
  dispName: "프로세서 설정",

  type: "websection",
  size: "5",
  direction: "column",
  children: [processorFinder, processorEditor],
};

const systemFinder = {
  name: "system",
  dispName: "시스템 설정",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/system"],
};

const systemEditor = {
  name: "systemEditor",
  dispName: "시스템 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedSystem"],
};

const systemSection = {
  name: "systemConfig",
  dispName: "시스템 설정",

  type: "websection",
  size: "5",
  direction: "column",
  children: [systemFinder, systemEditor],
};

const elementFinder = {
  name: "element",
  dispName: "엘리먼트 설정",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/element"],
};

const elementEditor = {
  name: "elementEditor",
  dispName: "엘리먼트 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedElement"],
};

const elementSection = {
  name: "elementConfig",
  dispName: "엘리먼트 설정",

  type: "websection",
  size: "5",
  direction: "column",
  children: [elementFinder, elementEditor],
};

const websectionFinder = {
  name: "websectionFinder",
  dispName: "웹 섹션",
  type: "websection",
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/websection"],
};

const websectionEditor = {
  name: "websectionEditor",
  dispName: "웹 섹션 편집",
  type: "websection",
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedWebSection"],
};

const websectionSection = {
  name: "websectionConfig",
  dispName: "웹 섹션 설정",
  type: "websection",
  size: "5",
  direction: "column",
  children: [websectionFinder, websectionEditor],
};

const dashboardPage = {
  name: "dashboard",
  dispName: "Dashboard",
  description: "Dashboard",
  type: "websection",
  route: "emu150cbm/*",
  direction: "column",
  children: [
    {
      name: "Head",
      dispName: "Head",
      description: "Head View",
      type: "websection",
      size: "10",
      direction: "row",
      children: [
        {
          name: "HeadLeft",
          type: "websection",
          size: "10",
          applet: "",
          contents: [],
        },
        {
          name: "HeadMain",
          type: "websection",
          size: "80",
          applet: "",
          contents: [],
        },
        {
          name: "HeadRight",
          type: "websection",
          size: "10",
          applet: "",
          contents: [],
        },
      ],
    },
    {
      name: "Body",
      dispName: "Body",
      description: "Body View",
      type: "websection",
      size: "90",
      direction: "row",
      children: [
        {
          name: "left-side",
          dispName: "Left Side",
          description: "Left Side View",
          type: "websection",
          size: "5",
          direction: "column",
          children: [
            {
              name: "menu",
              dispName: "메뉴섹션",
              type: "websection",
              size: "1",
              padding: padding,
              applet: "/menu/NexMenu",
              contents: ["/common/menu"],
            },
            {
              name: "Sample",
              dispName: "샘플",
              type: "websection",
              size: "1",
              padding: padding,
              applet: "/sample/NexSampleList",
              contents: ["/common/sample"],
            },
          ],
        },
        {
          name: "Main",
          type: "websection",
          size: "24",
          direction: "column",
          route: "/*",
          isRoutes: true,
          children: [
            {
              name: "dashboard",
              type: "websection",
              size: "1",
              direction: "column",
              route: "dashboard",
              children: [
                {
                  name: "MainUp",
                  type: "websection",
                  size: "2",
                  direction: "row",
                  children: [
                    {
                      name: "MainLeftUp",
                      type: "websection",
                      size: "1",
                      direction: "column",
                      children: [
                        {
                          name: "loss",
                          type: "websection",
                          size: "1",
                          direction: "row",
                          children: [
                            {
                              name: "LossPerLine",
                              dispName: "노선별 열화 현황",

                              type: "websection",
                              size: "4",
                              padding: padding,
                              applet: "/status/NexStatus",
                              contents: ["/emu150cbm/status/LossPerLine"],
                            },
                            {
                              name: "LossHistoryPerLine",
                              dispName: "노선별 열화 이력",
                              type: "websection",
                              size: "8",
                              padding: padding,
                              applet: "/chart/NexLineChart",
                              contents: [
                                "/emu150cbm/history/LossHistoryPerLine",
                              ],
                            },
                          ],
                        },
                        {
                          name: "maintenance",
                          type: "websection",
                          size: "1",
                          direction: "row",
                          children: [
                            {
                              name: "TrainCountPerLine",
                              dispName: "노선별 평성 수",
                              type: "webcontents",
                              size: "4",
                              applet: "/status/NexCount",
                              padding: padding,
                              contents: ["/emu150cbm/status/TrainCountPerLine"],
                            },
                            {
                              name: "MaintenancePerLineHistory",
                              dispName: "노선별 유지보수 이력",
                              type: "webcontents",
                              size: "8",
                              applet: "/chart/NexLineChart",
                              padding: padding,
                              contents: [
                                "/emu150cbm/history/MaintenancePerLineHistory",
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "MainRightUp",
                      type: "websection",
                      size: "1",
                      direction: "row",
                      children: [
                        {
                          name: "LossPerDevice",
                          dispName: "장치별 열화 현황",
                          type: "webcontents",
                          size: "2",
                          padding: padding,
                          applet: "/status/NexStatus",
                          contents: ["/emu150cbm/status/LossPerDevice"],
                        },
                        {
                          name: "LossHistoryPerDevice",
                          dispName: "장치별 열화 이력",
                          type: "webcontents",
                          size: "4",
                          padding: padding,
                          applet: "/chart/NexLineChart",
                          contents: ["/emu150cbm/history/LossHistoryPerDevice"],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "MainDown",
                  type: "websection",
                  size: "1",
                  direction: "row",
                  children: [
                    {
                      name: "RTMaintenanceInfo",
                      dispName: "실시간 유지보수 정보",
                      type: "webcontents",
                      size: "1",
                      applet: "/table/NexTable",
                      padding: padding,
                      contents: ["/emu150cbm/event/RTMaintenanceInfo"],
                    },
                    {
                      name: "SystemEventInfo",
                      dispName: "시스템 이벤트 정보",
                      type: "webcontents",
                      size: "1",
                      applet: "/table/NexTable",
                      padding: padding,
                      contents: ["/emu150cbm/event/SystemEventInfo"],
                    },
                  ],
                },
              ],
            },
            {
              name: "TrainInfoPerLine",
              dispName: "노선별 편성 정보",
              type: "webcontents",
              size: "1",
              direction: "column",
              route: "train-info/line",
              applet: "/emu150/train-info-line",
              padding: padding,
              contents: [
                "/emu150cbm/config/Line",
                "/emu150cbm/config/TrainPerLine",
                "/emu150cbm/config/CarPerTrain",
                "/emu150cbm/status/LossPerLine",
                "/emu150cbm/history/DetailLossLevelHistory",
              ],
            },
            {
              name: "train-info-line-chart",
              type: "webcontents",
              size: "2",
              padding: padding,
              applet: "/chart/NexLineChart",
              contents: ["/emu150cbm/history/SelectedDetailLossLevelHistory"],
            },
          ],
        },
      ],
    },
  ],
};

const adminPage = {
  name: "Admin",
  type: "websection",
  size: "1",
  direction: "column",
  route: "admin",
  children: [
    {
      name: "Top",
      type: "websection",
      size: "5",
      direction: "row",
    },
    {
      name: "Mid",
      type: "websection",
      size: "90",
      direction: "row",
      children: [
        {
          name: "MainLeftUp",
          type: "websection",
          size: "1",
          direction: "column",
          children: [
            {
              name: "project",
              type: "websection",
              size: "1",
              direction: "row",

              children: [
                projectSection,
                formatSection,
                storeSection,
                processorSection,
                systemSection,
              ],
            },
          ],
        },
      ],
    },
  ],
};

const adminSystemPage = {
  name: "AdminSystemConfig",
  type: "websection",
  size: "1",
  direction: "column",
  route: "admin/system",
  children: [
    {
      name: "Head",
      type: "websection",
      size: "6",
      direction: "column",
      children: [nodeSelector],
    },
    {
      name: "MainUp",
      type: "websection",
      size: "94",
      direction: "row",
      children: [
        {
          name: "MainLeftUp",
          type: "websection",
          size: "1",
          direction: "column",
          children: [
            {
              name: "project",
              type: "websection",
              size: "1",
              direction: "row",

              children: [websectionSection],
            },
          ],
        },
      ],
    },

    /*
          {
            name: "MainDown",
            type: "websection",
            size: "1",
            direction: "row",
            children: [
              {
                name: "format",
                type: "websection",
                size: "2",
                applet: "/admin/NexJsonEditor",
                padding : padding, contents: [
                  {
                    name: "websection",
                    type: "contents",
                    element: "/admin/websection", // elements path
                    condition: {
                      key: "project",
                      value: "project",
                      method: "pathmatch",
                    },
                    selection: { key: "format", feature: "name" },
                  },
                ],
              },
              {
                name: "system-event-info",
                type: "webcontents",
                size: "1",
                applet: "/table/NexTable",
                padding : padding, contents: [
                  {
                    name: "system-event-info",
                    type: "contents",
                    element: "/EMU150CBM-WEBUI/dashboard/system-event-info", // elements path
                    condition: {},
                    selection: {},
                  },
                ],
              },
            ],
          },
*/
  ],
};

export const webPageConfig: NexNode[] = [
  {
    name: "root",
    dispName: "root",
    description: "root",
    type: "websection",
    isRoutes: true,
    children: [dashboardPage, adminPage, adminSystemPage],
  },
];
