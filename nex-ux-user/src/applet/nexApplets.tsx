import path from "path";
import NexNodeEditor from "./admin/NexNodeEditor";
import NexNodeTreeApp from "./admin/NexNodeTreeApp";
import NexSectionViewer from "./admin/NexSectionViewer";
import NexLineChartApp from "./chart/NexLineChartApp";
import PXHeadApp from "./head/PHeadApplet";
import NexMenuApp from "./menu/NexMenuApp";
import NexSampleListApp from "./sample/NexSampleListApp";
import NexCountApp from "./status/NexCountApp";
import NexStatusApp from "./status/NexStatusApp";
import NexTableApp from "./table/NexTableApp";
import PXBaseTable from "./table/PXBaseTableApp";
import PXCardView from "./table/PXCardView";
import PXLineChartApp from "./chart/PXLineChartApp";
import PXBarChartApp from "./chart/PXBarChartApp";
import PXPieChartApp from "./chart/PXPieChartApp";

import NexConfigDistApp from "./admin/NexConfigDistApp";
import PXJsonEditor from "./admin/PXJsonEditor";
import PXBaseChart from "./chart/PXBaseChart";

const appletList = [
  {
    name: "head",
    dispName: "헤더",
    type: "folder",

    children: [
      {
        name: "PXHeadApplet",
        dispName: "PX Builder",
        type: "applet",
        app: PXHeadApp,
      },
    ],
  },
  {
    name: "menu",
    dispName: "메뉴",
    type: "folder",
    children: [
      {
        name: "NexMenu",
        dispName: "메뉴",
        type: "applet",
        app: NexMenuApp,
      },
    ],
  },
  {
    name: "chart",
    dispName: "차트",
    type: "folder",
    children: [
      {
        name: "NexLineChart",
        dispName: "라인 차트",
        type: "applet",
        app: NexLineChartApp,
      },
      {
        name: "PXLineChartApp",
        dispName: "PX 라인 차트",
        type: "applet",
        app: PXLineChartApp,
      },
      {
        name: "PXBarChartApp",
        dispName: "PX 바 차트",
        type: "applet",
        app: PXBarChartApp,
      },
      {
        name: "PXPieChartApp",
        dispName: "PX 파이 차트",
        type: "applet",
        app: PXPieChartApp,
      },
      {
        name: "PXBaseChart",
        dispName: "PX 기본 차트",
        type: "applet",
        app: PXBaseChart,
      },
    ],
  },
  {
    name: "table",
    dispName: "테이블",
    type: "folder",
    children: [
      {
        name: "NexTable",
        dispName: "테이블",
        type: "applet",
        app: NexTableApp,
      },
      {
        name: "PXSearchingTable",
        dispName: "PX 검색 테이블",
        type: "applet",
        app: PXBaseTable,
      },
    ],
  },
  {
    name: "card",
    dispName: "카드",
    type: "folder",
    children: [
      {
        name: "CardView",
        dispName: "카드뷰",
        type: "applet",
        app: PXCardView,
      },
    ],
  },
  {
    name: "status",
    dispName: "상태",
    type: "folder",
    children: [
      {
        name: "NexStatus",
        dispName: "상태",
        type: "applet",
        app: NexStatusApp,
      },
      {
        name: "NexCount",
        dispName: "카운트",
        type: "applet",
        app: NexCountApp,
      },
    ],
  },
  {
    name: "sample",
    dispName: "샘플",
    type: "folder",
    children: [
      {
        name: "NexSampleList",
        dispName: "샘플 리스트",
        type: "applet",
        app: NexSampleListApp,
      },
    ],
  },

  {
    name: "admin",
    dispName: "관리자",
    type: "folder",
    children: [
      {
        name: "menu",
        dispName: "메뉴",
        type: "applet",
        app: NexMenuApp,
      },
      {
        name: "NexNodeEditor",
        dispName: "노드 편집기",
        type: "applet",
        app: NexNodeEditor,
      },
      {
        name: "PXJsonEditor",
        dispName: "PX JSON 편집기",
        type: "applet",
        app: PXJsonEditor,
      },
      {
        name: "NexNodeTree",
        dispName: "노드 검색기",
        type: "applet",
        app: NexNodeTreeApp,
      },
      {
        name: "SectionViewer",
        dispName: "섹션 뷰어",
        type: "applet",
        app: NexSectionViewer,
      },
      { name: "NexConfigDist", dispName: "설정 파일 배포", type: "applet", app: NexConfigDistApp },
    ],
  },
];

const getAppletInfo: () => { path: any; nodeMap: any } = () => {
  const pathList: any = [{ index: 0, path: "", name: "", dispName: "없음", helper: "None" }];
  const nodeMap: any = {};
  appletList.forEach((folder, index) => {
    pathList.push({
      index: index + 1,
      path: `/${folder.name}`,
      name: folder.name,
      dispName: folder?.dispName || folder.name,
      helper: `${folder?.dispName || folder.name}(/${folder.name})`,
    });

    if (folder.children && Array.isArray(folder.children)) {
      nodeMap[`/${folder.name}`] = [{ index: 0, path: "", name: "", dispName: "없음", helper: "None" }];
      nodeMap[`/${folder.name}`] = folder.children.map(
        (applet: any, i: number) => {
          const path = `/${folder.name}/${applet.name}`;
          const name = applet.name;
          const dispName = applet.dispName || applet.name;
          const helper = `${dispName}(${path})`;
          return {
            index: i + 1,
            path: path,
            name: name,
            dispName: dispName,
            helper: helper,
          };
        }
      );
    }
  });
  return { path: pathList, nodeMap: nodeMap };
};

const appletListInfo = getAppletInfo();

export const appletPathList = appletListInfo.path;
export const appletPathMap = appletListInfo.nodeMap;

const nexApplets = (path: string): React.FC<any> | null => {
  //console.log("findNexApplets1 path:", path);
  if (!path || path === null) return null;
  //console.log("findNexApplets path:", path);
  const pathList = path.split("/").filter(Boolean);

  if (pathList.length === 0) return null;

  //console.log("findNexApplets path:", path);
  let list = appletList;
  let applet: any = null;

  for (let i = 0; i < pathList.length; i++) {
    if (!list) return null;
    applet = list.find(
      (child: any) => child.name === pathList[i] || child.id === pathList[i]
    );
    if (!applet) return null;
    list = (applet.children as any[]) || [];
  }
  //console.log(`# findNexApplets1 path: ${path}, applet: ${applet}`);
  if (!applet || applet.type !== "applet" || !("app" in applet)) return null;

  //console.log("# findNexApplets2 applet:", applet);
  return applet.app;
};

export const nexAppletMap: Record<string, React.FC<any> | null> =
  appletList.reduce((acc: Record<string, React.FC<any> | null>, folder) => {
    if (folder.children && Array.isArray(folder.children)) {
      folder.children.forEach((applet: any) => {
        const appletPath = `/${folder.name}/${applet.name}`;
        acc[appletPath] = applet.app;
      });
    }
    return acc;
  }, {});

export default nexApplets;
