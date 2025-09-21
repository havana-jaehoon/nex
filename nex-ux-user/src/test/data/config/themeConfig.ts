import { NexNodeType, NexWebThemeNode } from "type/NexNode";
import { defaultTheme } from "type/NexTheme";

export const themeConfig: NexWebThemeNode[] = [
  {
    name: "default",
    dispName: "Default Theme",
    description: "Default Theme",
    type: NexNodeType.THEME,
    icon: "theme",
    color: "#33A1FF",
    theme: defaultTheme,
  },
];
