// CSV-like array: [ type, path, name, dispName, description, icon, color,  ]

import { NexNodeType } from "type/NexNode";

export const appletData = [
  [
    "/common",
    {
      name: "common",
      dispName: "공용",
      description: "공용 애플릿 폴더",
      type: "folder",
      icon: "",
      color: "",
    },
  ],
  [
    "/common/NexMenu",
    {
      name: "NexMenu",
      dispName: "메뉴",
      description: "Nex Menu Applet",
      type: "applet",
      icon: "menu",
      color: "#FF5733",
      applet: "/menu/NexMenu",
    },
  ],
  [
    "/chart",
    {
      name: "chart",
      dispName: "차트",
      description: "차트 애플릿 폴더",
      type: "folder",
      icon: "",
      color: "",
    },
  ],
  [
    "/chart/NexLineChart",
    {
      name: "NexLineChart",
      dispName: "Nex Line Chart",
      description: "Nex Line Chart Applet",
      type: NexNodeType.APPLET,
      icon: "chart",
      color: "#33FF57",
      applet: "/chart/NexLineChart",
    },
  ],
  [
    "/table",
    {
      name: "table",
      dispName: "테이블",
      description: "테이블 애플릿 폴더",
      type: "folder",
      icon: "",
      color: "",
    },
  ],
  [
    "/table/NexTable",
    {
      name: "NexTable",
      dispName: "Nex Table",
      description: "Nex Table Applet",
      type: NexNodeType.APPLET,
      icon: "table",
      color: "#3357FF",
      applet: "/table/NexTable",
    },
  ],
  [
    "/status",
    {
      name: "status",
      dispName: "상태",
      description: "상태 애플릿 폴더",
      type: "folder",
      icon: "",
      color: "",
    },
  ],
  [
    "/status/NexStatus",
    {
      name: "NexStatus",
      dispName: "Nex Status",
      description: "Nex Status Applet",
      type: NexNodeType.APPLET,
      icon: "status",
      color: "#FF33A1",
      applet: "/status/NexStatus",
    },
  ],
  [
    "/status/NexCount",
    {
      name: "NexCount",
      dispName: "Nex Count",
      description: "Nex Count Applet",
      type: NexNodeType.APPLET,
      icon: "",
      color: "#A133FF", // Default color
      applet: "/status/NexCount",
    },
  ],
  [
    "/admin",
    {
      name: "admin",
      dispName: "관리자",
      description: "관리자 애플릿 폴더",
      type: "folder",
      icon: "",
      color: "",
    },
  ],
  [
    "/admin/NexNodeTree",
    {
      name: "NexNodeTree",
      dispName: "Nex Tree",
      description: "Nex Tree Applet",
      type: NexNodeType.APPLET,
      icon: "tree",
      color: "#FF33A1",
      applet: "/admin/NexNodeTree",
    },
  ],
];
