import { NexNode, NexNodeType, NexWebSectionNode } from "type/NexNode";

const padding = "8px";

const nodeSelector : NexWebSectionNode = {
  name: "nodeSelector",
  dispName: "",
  description: "노드 선택기 웹 섹션",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeSelector",
  padding: "0",
  contents: ["/admin/project", "/admin/system"],
};

const projectFinder : NexWebSectionNode = {
  name: "projectFinder",
  dispName: "프로젝트",

  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/project"],
};

const projectEditor : NexWebSectionNode = {
  name: "projectEditor",
  dispName: "프로젝트 설정",

  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedProject"],
};

const projectSection : NexWebSectionNode = {
  name: "project",
  dispName: "프로젝트 설정",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [projectFinder, projectEditor],
};

const formatFinder : NexWebSectionNode= {
  name: "formatFinder",
  dispName: "데이터 유형",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/format"],
};

const formatEditor : NexWebSectionNode= {
  name: "formatEditor",
  dispName: "데이터 유형 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedFormat"],
};

const formatSection : NexWebSectionNode= {
  name: "formatConfig",
  dispName: "포맷 설정",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [formatFinder, formatEditor],
};

const storeFinder : NexWebSectionNode= {
  name: "storeFinder",
  dispName: "데이터 저장 정책",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/store"],
};

const storeEditor : NexWebSectionNode= {
  name: "storeEditor",
  dispName: "데이터 저장 정책 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedStore"],
};

const storeSection : NexWebSectionNode= {
  name: "storeConfig",
  dispName: "저장 정책",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [storeFinder, storeEditor],
};

const processorFinder : NexWebSectionNode= {
  name: "processor",
  dispName: "데이터 프로세서",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/processor"],
};

const processorEditor : NexWebSectionNode = {
  name: "processorEditor",
  dispName: "프로세서 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedProcessor"],
};

const processorSection : NexWebSectionNode = {
  name: "processorConfig",
  dispName: "프로세서 설정",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [processorFinder, processorEditor],
};

const systemFinder : NexWebSectionNode = {
  name: "system",
  dispName: "시스템 설정",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/system"],
};

const systemEditor : NexWebSectionNode = {
  name: "systemEditor",
  dispName: "시스템 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedSystem"],
};

const systemSection : NexWebSectionNode = {
  name: "systemConfig",
  dispName: "시스템 설정",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [systemFinder, systemEditor],
};

const elementFinder : NexWebSectionNode = {
  name: "element",
  dispName: "엘리먼트 설정",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/element"],
};

const elementEditor : NexWebSectionNode = {
  name: "elementEditor",
  dispName: "엘리먼트 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedElement"],
};

const elementSection : NexWebSectionNode = {
  name: "elementConfig",
  dispName: "엘리먼트 설정",

  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [elementFinder, elementEditor],
};

const websectionFinder : NexWebSectionNode = {
  name: "websectionFinder",
  dispName: "웹 섹션",
  type: NexNodeType.WEBSECTION,
  size: "3",
  applet: "/admin/NexNodeTree",
  padding: padding,
  contents: ["/admin/websection"],
};

const websectionEditor : NexWebSectionNode = {
  name: "websectionEditor",
  dispName: "웹 섹션 편집",
  type: NexNodeType.WEBSECTION,
  size: "7",
  applet: "/admin/NexJsonEditor",
  padding: padding,
  contents: ["/admin/SelectedWebSection"],
};

const websectionSection : NexWebSectionNode = {
  name: "websectionConfig",
  dispName: "웹 섹션 설정",
  type: NexNodeType.WEBSECTION,
  size: "5",
  direction: "column",
  children: [websectionFinder, websectionEditor],
};

const dashboardPage : NexWebSectionNode = {
  name: "dashboard",
  dispName: "Dashboard",
  description: "Dashboard",
  type: NexNodeType.WEBSECTION,
  route: "emu150cbm/*",
  direction: "column",
  children: [
    {
      name: "Head",
      dispName: "Head",
      description: "Head View",
      type: NexNodeType.WEBSECTION,
      size: "10",
      direction: "row",
      children: [
        {
          name: "HeadLeft",
          type: NexNodeType.WEBSECTION,
          size: "10",
          applet: "",
          contents: [],
        },
        {
          name: "HeadMain",
          type: NexNodeType.WEBSECTION,
          size: "80",
          applet: "",
          contents: [],
        },
        {
          name: "HeadRight",
          type: NexNodeType.WEBSECTION,
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
      type: NexNodeType.WEBSECTION,
      size: "90",
      direction: "row",
      children: [
        {
          name: "left-side",
          dispName: "Left Side",
          description: "Left Side View",
          type: NexNodeType.WEBSECTION,
          size: "5",
          direction: "column",
          children: [
            {
              name: "menu",
              dispName: "메뉴섹션",
              type: NexNodeType.WEBSECTION,
              size: "1",
              padding: padding,
              applet: "/menu/NexMenu",
              contents: ["/common/menu"],
            },
            {
              name: "Sample",
              dispName: "샘플",
              type: NexNodeType.WEBSECTION,
              size: "1",
              padding: padding,
              applet: "/sample/NexSampleList",
              contents: ["/common/sample"],
            },
          ],
        },
        {
          name: "Main",
          type: NexNodeType.WEBSECTION,
          size: "24",
          direction: "column",
          route: "/*",
          isRoutes: true,
          children: [
            {
              name: "dashboard",
              type: NexNodeType.WEBSECTION,
              size: "1",
              direction: "column",
              route: "dashboard",
              children: [
                {
                  name: "MainUp",
                  type: NexNodeType.WEBSECTION,
                  size: "2",
                  direction: "row",
                  children: [
                    {
                      name: "MainLeftUp",
                      type: NexNodeType.WEBSECTION,
                      size: "1",
                      direction: "column",
                      children: [
                        {
                          name: "loss",
                          type: NexNodeType.WEBSECTION,
                          size: "1",
                          direction: "row",
                          children: [
                            {
                              name: "LossPerLine",
                              dispName: "노선별 열화 현황",

                              type: NexNodeType.WEBSECTION,
                              size: "4",
                              padding: padding,
                              applet: "/status/NexStatus",
                              contents: ["/emu150cbm/status/LossPerLine"],
                            },
                            {
                              name: "LossHistoryPerLine",
                              dispName: "노선별 열화 이력",
                              type: NexNodeType.WEBSECTION,
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
                          type: NexNodeType.WEBSECTION,
                          size: "1",
                          direction: "row",
                          children: [
                            {
                              name: "TrainCountPerLine",
                              dispName: "노선별 평성 수",
                              type: NexNodeType.WEBSECTION,
                              size: "4",
                              applet: "/status/NexCount",
                              padding: padding,
                              contents: ["/emu150cbm/status/TrainCountPerLine"],
                            },
                            {
                              name: "MaintenancePerLineHistory",
                              dispName: "노선별 유지보수 이력",
                              type: NexNodeType.WEBSECTION,
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
                      type: NexNodeType.WEBSECTION,
                      size: "1",
                      direction: "row",
                      children: [
                        {
                          name: "LossPerDevice",
                          dispName: "장치별 열화 현황",
                          type: NexNodeType.CONTENTS,
                          size: "2",
                          padding: padding,
                          applet: "/status/NexStatus",
                          contents: ["/emu150cbm/status/LossPerDevice"],
                        },
                        {
                          name: "LossHistoryPerDevice",
                          dispName: "장치별 열화 이력",
                          type: NexNodeType.WEBSECTION,
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
                  type: NexNodeType.WEBSECTION,
                  size: "1",
                  direction: "row",
                  children: [
                    {
                      name: "RTMaintenanceInfo",
                      dispName: "실시간 유지보수 정보",
                      type: NexNodeType.WEBSECTION,
                      size: "1",
                      applet: "/table/NexTable",
                      padding: padding,
                      contents: ["/emu150cbm/event/RTMaintenanceInfo"],
                    },
                    {
                      name: "SystemEventInfo",
                      dispName: "시스템 이벤트 정보",
                      type: NexNodeType.WEBSECTION,
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
              type: NexNodeType.WEBSECTION,
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
              type: NexNodeType.WEBSECTION,
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

const adminPage : NexWebSectionNode = {
  name: "Admin",
  type: NexNodeType.WEBSECTION,
  size: "1",
  direction: "column",
  route: "admin",
  children: [
    {
      name: "Top",
      type: NexNodeType.WEBSECTION,
      size: "5",
      direction: "row",
    },
    {
      name: "Mid",
      type: NexNodeType.WEBSECTION,
      size: "90",
      direction: "row",
      children: [
        {
          name: "MainLeftUp",
          type: NexNodeType.WEBSECTION,
          size: "1",
          direction: "column",
          children: [
            {
              name: "project",
              type: NexNodeType.WEBSECTION,
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

const adminSystemPage : NexWebSectionNode = {
  name: "AdminSystemConfig",
  type: NexNodeType.WEBSECTION,
  size: "1",
  direction: "column",
  route: "admin/system",
  children: [
    {
      name: "Head",
      type: NexNodeType.WEBSECTION,
      size: "6",
      direction: "column",
      children: [nodeSelector],
    },
    {
      name: "MainUp",
      type: NexNodeType.WEBSECTION,
      size: "94",
      direction: "row",
      children: [
        {
          name: "MainLeftUp",
          type: NexNodeType.WEBSECTION,
          size: "1",
          direction: "column",
          children: [
            {
              name: "project",
              type: NexNodeType.WEBSECTION,
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
            type: NexNodeType.WEBSECTION,
            size: "1",
            direction: "row",
            children: [
              {
                name: "format",
                type: NexNodeType.WEBSECTION,
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
                type: NexNodeType.WEBSECTION,
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
    type: NexNodeType.WEBSECTION,
    isRoutes: true,
    children: [dashboardPage, adminPage, adminSystemPage],
  },
];
