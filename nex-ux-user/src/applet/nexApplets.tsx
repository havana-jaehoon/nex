import NexJsonEditor from "./admin/NexJsonEditor";
import NexNodeEditor from "./admin/NexNodeEditor";
import NexNodeSelctor from "./admin/NexNodeSelector";
import NexNodeTreeApp from "./admin/NexNodeTreeApp";
import StorageElementGenerator from "./admin/StorageElementGenerator";
import NexLineChartApp from "./chart/NexLineChartApp";
import EMU150TrainLineInfoApp from "./emu150/EMU150TrainLineInfo";
import NexMenuApp from "./menu/NexMenuApp";
import NexSampleListApp from "./sample/NexSampleListApp";
import NexCountApp from "./status/NexCountApp";
import NexStatusApp from "./status/NexStatusApp";
import NexTableApp from "./table/NexTableApp";

const appletList = [
  {
    name: "menu",
    type: "folder",
    children: [
      {
        name: "NexMenu",
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
        type: "applet",
        app: NexStatusApp,
      },
      {
        name: "NexCount",
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
        type: "applet",
        app: NexSampleListApp,
      },
    ],
  },
  {
    name: "emu150",
    type: "folder",
    children: [
      {
        name: "TrainInfoLine",
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
        name: "NexJsonEditor",
        type: "applet",
        app: NexJsonEditor,
      },
      {
        name: "NexNodeEditor",
        type: "applet",
        app: NexNodeEditor,
      },
      {
        name: "NexNodeTree",
        type: "applet",
        app: NexNodeTreeApp,
      },

      {
        name: "NexNodeSelector",
        type: "applet",
        app: NexNodeSelctor,
      },
      {
        name: "NexNodeSelector",
        type: "applet",
        app: NexNodeSelctor,
      },
      {
        name: "StorageElementGenerator",
        type: "applet",
        app: StorageElementGenerator,
      },
    ],
  },
];

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
