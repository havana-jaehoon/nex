const webcontentsData = [
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/common", //path
    "common", //name
    "Common", //displayName
    "공통 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "contents", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/common/menu", //path
    "Menu", //name
    "메뉴", //displayName
    "메뉴 컨텐트", //description
    "", //icon
    "", //color
    "/common/menu", // element - path
    [], // conditions
    [
      "menu-path", // selection1 - key
      "path", // selection1 - feature name
      "menu-route", // selection2 - key
      "route", // selection2 - feature name
    ], // selections
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/admin", //path
    "admin", //name
    "Admin", //displayName
    "Admin 용 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "contents",
    "/nex-admin",
    "/webclient",
    "/admin/project",
    "project",
    "Project",
    "프로젝트 컨텐트",
    "",
    "",
    "/admin/project",
    [],
    [
      "project-path", // selection - key
      "path", // selection - feature name
    ],
  ],
  [
    "contents",
    "/nex-admin",
    "/webclient",
    "/admin/oneproject", // read - only 사용
    "oneproject",
    "One Project",
    "하나의 프로젝트 컨텐트",
    "",
    "",
    "/admin/project",
    [
      "project-path", // condition - key
      "path", // condition - feature name
      "pathmatch", // condition - method (pathmatch | match | include | startwith | endwith)
    ],
    [],
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/emu150cbm", //path
    "emu150cbm", //name
    "EMU150CBM", //displayName
    "EMU150CBM 용 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/emu150cbm/config", //path
    "config", //name
    "설정 데이터", //displayName
    "설정 데이터 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/emu150cbm/status", //path
    "status", //name
    "상태 데이터", //displayName
    "상태 데이터 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/emu150cbm/event", //path
    "event", //name
    "이벤트 데이터", //displayName
    "이벤트 데이터 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
  [
    "folder", //type
    "/nex-admin", //project-path
    "/webclient", //system-path
    "/emu150cbm/history", //path
    "history", //name
    "이력 데이터", //displayName
    "이력 데이터 컨텐트 폴더", //description
    "", //icon
    "", //color
  ],
];
