import { NexNodeType, NexWebThemeUserNode } from "type/NexNode";

export const themeUserConfig: NexWebThemeUserNode[] = [
  // Default user for testing purposes
  {
    name: "default",
    dispName: "Default User Theme",
    description: "Default User Theme",
    type: NexNodeType.USER,
    icon: "user",
    color: "#33A1FF",
    user: {
      id: "default",
      fontLevel: 6,
      theme: "default",
    },
  },
];
