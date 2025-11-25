import NexJsonEditor from "./admin/NexJsonEditor";
import NexNodeEditor from "./admin/NexNodeEditor";
import NexNodeSelctor from "./admin/NexNodeSelector";
import NexNodeTreeApp from "./admin/NexNodeTreeApp";
import NexSectionViewer from "./admin/NexSectionViewer";
import StorageElementGenerator from "./admin/StorageElementGenerator";
import NexLineChartApp from "./chart/NexLineChartApp";
import EMU150TrainLineInfoApp from "./emu150/EMU150TrainLineInfo";
import PXHeadApp from "./head/PHeadApplet";
import NexMenuApp from "./menu/NexMenuApp";
import NexSampleListApp from "./sample/NexSampleListApp";
import NexCountApp from "./status/NexCountApp";
import NexStatusApp from "./status/NexStatusApp";
import NexTableApp from "./table/NexTableApp";

const appletList = [
  {
    name: "head",
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
    type: "folder",
    children: [
      {
        name: "NexMenu",
        dispName: "메뉴",
        type: "applet",
        app: NexMenuApp,
      },
      {
        name: "menu2",
        type: "applet",
        app: NexMenuApp,
      },
    ],
  },
  {
    name: "chart",
    type: "folder",
    children: [
      {
        name: "NexLineChart",
        dispName: "라인 차트",
        type: "applet",
        app: NexLineChartApp,
      },
    ],
  },
  {
    name: "table",
    type: "folder",
    children: [
      {
        name: "NexTable",
        dispName: "테이블",
        type: "applet",
        app: NexTableApp,
      },
    ],
  },
  {
    name: "status",
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
    type: "folder",
    children: [
      {
        name: "NexSampleList",
        dispName: "샘플",
        type: "applet",
        app: NexSampleListApp,
      },
    ],
  },
  {
    name: "cbm",
    type: "folder",
    children: [
      {
        name: "TrainInfoLine",
        dispName: "호선별열차정보",
        type: "applet",
        app: EMU150TrainLineInfoApp,
      },
    ],
  },

  {
    name: "admin",
    type: "folder",
    children: [
      {
        name: "menu",
        dispName: "메뉴",
        type: "applet",
        app: NexMenuApp,
      },
      {
        name: "NexJsonEditor",
        dispName: "JSON 편집기",
        type: "applet",
        app: NexJsonEditor,
      },
      {
        name: "NexNodeEditor",
        dispName: "노드 편집기",
        type: "applet",
        app: NexNodeEditor,
      },
      {
        name: "NexNodeTree",
        dispName: "노드 검색기",
        type: "applet",
        app: NexNodeTreeApp,
      },

      {
        name: "StorageElementGenerator",
        dispName: "DB 엘리먼트 생성기",
        type: "applet",
        app: StorageElementGenerator,
      },
      {
        name: "SectionViewer",
        dispName: "섹션 뷰어",
        type: "applet",
        app: NexSectionViewer,
      },
    ],
  },
];

export const appletPathList: any[] = appletList.reduce((acc: any[], folder) => {
  if (folder.children && Array.isArray(folder.children)) {
    folder.children.forEach((applet, i) => {
      const path = `/${folder.name}/${applet.name}`;
      const name = applet.name;
      const dispName = applet.dispName || applet.name;
      const helper = `${dispName}(${path})`;
      acc.push({
        index: i,
        path: path,
        name: name,
        dispName: dispName,
        helper: helper,
      });
    });
  }
  return acc;
}, []);

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

export default nexApplets;
