// common => csv : type, project, system, path, name, dispName, description, icon, color
//websection => csv : ...common, isRoutes, route, direction, size, appletPath
//contents => csv : ...common, elementPath,
//selector per contents => csv : ...common, key1, featureName1, ...
//conditioner per contents  => csv : ...common, slectorKey1, featureName1, method1, ...

// path, itemType, type, project, system, route, name, dispName, description, icon, color, isRoutes, appletPath, direction, size, elementPath

export const websectionData = [
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin",
    "admin",
    "Admin",
    "Admin 페이지",
    "",
    "",
    false,
    "/admin",
    "column",
    100,
    "",
    "",
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/top",
    "top",
    "Top",
    "Top of section",
    "",
    "",
    false,
    "",
    "column",
    5,
    "",

    "",
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid",
    "mid",
    "Mid",
    "Mid of section",
    "",
    "",
    false,
    "",
    "column",
    95,
    "",

    "",
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/1",
    "1",
    "1",
    "1 of mid",
    "",
    "",
    false,
    "",
    "row",
    20,
    "",

    "",
  ],

  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/1/menu",
    "menu",
    "메뉴",
    "메뉴",
    "",
    "#FF33A1",
    false, // isRoute
    "", // route-path
    "column", // direction
    100, // size
    "",
    "/common/menu", //applet  - path
    "/common/menu", //content - path
  ],

  // main section
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/2",
    "2",
    "",
    "",
    "",
    "",
    false,
    "",
    "column",
    100,
    "",
    "", // applet - path
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/2/projectSection",
    "projectSection",
    "",
    "",
    "",
    "",
    false,
    "",
    "column",
    100,
    "",
    "", // applet - path
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/2/projectSection/projectFinder",
    "projectFinder",
    "",
    "",
    "",
    "",
    false,
    "",
    "column",
    100,
    "",
    "/admin/NexNodeTree", // applet - path
    "/admin/project", // content - path
  ],
  [
    "websection",
    "/nex-admin",
    "/webclient",
    "/admin/mid/2/projectSection/projectEditor",
    "projectEditor",
    "",
    "",
    "",
    "",
    false,
    "",
    "column",
    100,
    "",
    "/admin/NexJsonEditor", // applet - path
    "/admin/oneproject", // content - path
  ],

  [
    "websection",
    "/emu150cbm",
    "/webclient",
    "/dashboard",
    "dashboard",
    "대시보드",
    "대시보드페이지",
    "",
    "",
    false,
    "/dashboard",
    "column",
    100,
    "",
    "",
  ],
];
