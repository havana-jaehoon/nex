// common => csv : type, project, system, path, name, dispName, description, icon, color
//websection => csv : ...common, isRoutes, route, direction, size, appletPath
//contents => csv : ...common, elementPath,
//selector per contents => csv : ...common, key1, featureName1, ...
//conditioner per contents  => csv : ...common, slectorKey1, featureName1, method1, ...

import { NexNodeType } from "type/NexNode";

// path, itemType, type, project, system, route, name, dispName, description, icon, color, isRoutes, appletPath, direction, size, elementPath
const padding = "8px";

export const sectionData = [
  [
    "/home",
    {
      name: "home",
      dispName: "Home",
      description: "Home",
      type: NexNodeType.SECTION,
      isRoutes: true,
    },
  ],
  [
    "/home/cbm",
    {
      name: "cbm",
      dispName: "CBM",
      description: "CBM",
      type: NexNodeType.SECTION,
      route: "cbm/*",
      direction: "column",
    },
  ],
  [
    "/home/cbm/head",
    {
      name: "head",
      dispName: "Head",
      description: "Head View",
      type: NexNodeType.SECTION,
      size: "10",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid",
    {
      name: "mid",
      dispName: "Mid",
      description: "Mid View",
      type: NexNodeType.SECTION,
      size: "10",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid/left",
    {
      name: "left",
      dispName: "Left",
      description: "Left View",
      type: NexNodeType.SECTION,
      size: "10",
      direction: "column",
    },
  ],
  [
    "/home/cbm/mid/left/menu",
    {
      name: "menu",
      dispName: "메뉴섹션",
      type: NexNodeType.SECTION,
      size: "1",
      padding: padding,
      applet: "/menu/NexMenu",
      contents: ["/common/menu"],
    },
  ],
  [
    "/home/cbm/mid/left/sample",
    {
      name: "sample",
      dispName: "샘플",
      type: NexNodeType.SECTION,
      size: "1",
      padding: padding,
      applet: "/sample/NexSampleList",
      contents: ["/common/sample"],
    },
  ],
  [
    "/home/cbm/mid/main",
    {
      name: "main",
      dispName: "Main",
      description: "Main View",
      type: NexNodeType.SECTION,
      size: "10",
      direction: "column",
      isRoutes: true,
    },
  ],
  [
    "/home/cbm/mid/main/dashboard",
    {
      name: "dashboard",
      dispName: "Dashboard",
      description: "Dashboard",
      type: NexNodeType.SECTION,
      size: "",
      direction: "column",
      route: "dashboard",
    },
  ],
  [
    "/home/cbm/mid/main/dashboard/up",
    {
      name: "up",
      type: NexNodeType.SECTION,
      size: "2",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid/main/dashboard/up/1",
    {
      name: "1",
      type: NexNodeType.SECTION,
      size: "1",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid/main/dashboard/up/1/1",
    {
      name: "1",
      type: NexNodeType.SECTION,
      size: "1",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid/main/dashboard/up/1/1/LossPerLine",
    {
      name: "LossPerLine",
      dispName: "노선별 열화 현황",

      type: NexNodeType.SECTION,
      size: "4",
      padding: padding,
      applet: "/status/NexStatus",
      contents: ["/cbm/status/LossPerLine"],
    },
  ],
  [
    "/home/cbm/mid/main/dashboard/down",
    {
      name: "down",
      type: NexNodeType.SECTION,
      size: "1",
      direction: "row",
    },
  ],
  [
    "/home/cbm/mid/main/admin",
    {
      name: "admin",
      dispName: "Admin",
      description: "Admin",
      type: NexNodeType.SECTION,
      size: "",
      direction: "column",
      route: "admin",
    },
  ],
  [
    "/home/cbm/mid/main/admin/formatFinder",
    {
      name: "formatFinder",
      dispName: "데이터 유형",
      type: NexNodeType.SECTION,
      size: "3",
      applet: "/admin/NexNodeTree",
      padding: padding,
      contents: ["/admin/format"],
    },
  ],
  [
    "/home/cbm/mid/main/admin/storeFinder",
    {
      name: "storeFinder",
      dispName: "데이터 저장 정책",
      type: NexNodeType.SECTION,
      size: "3",
      applet: "/admin/NexNodeTree",
      padding: padding,
      contents: ["/admin/store"],
    },
  ],
  [
    "/home/cbm/mid/main/admin/processorFinder",
    {
      name: "processorFinder",
      dispName: "데이터 프로세서",
      type: NexNodeType.SECTION,
      size: "3",
      applet: "/admin/NexNodeTree",
      padding: padding,
      contents: ["/admin/processor"],
    },
  ],
  [
    "/home/cbm/mid/main/admin/systemFinder",
    {
      name: "systemFinder",
      dispName: "데이터 시스템",
      type: NexNodeType.SECTION,
      size: "3",
      applet: "/admin/NexNodeTree",
      padding: padding,
      contents: ["/admin/system"],
    },
  ],
];
