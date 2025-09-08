import { observer } from "mobx-react-lite";

import { Alert, AlertTitle } from "@mui/material";
import { NexDiv, NexLabel } from "../component/base/NexBaseComponents";

import { NexTheme } from "type/NexTheme";
import { clamp } from "utils/util";
import NexSelector from "store/NexSelector";
import { NexThemeUser } from "../type/NexTheme";

/*
export interface NexAppData {
  store: NexDataStore | null; // Data store for the applet
  conditions: { feature: string }[]; // Conditions for filtering data
  selections: NexSelection[]; // Selections made by the user
}
*/
export interface NexAppProps {
  name?: string; // Optional name for the applet

  //Contents of the applet, can be used for rendering
  // store, csv, json, format, 등 통합
  // 모든 applet 보완 이후  datas, stores, selector 등 불필요한 인자 제거 필요
  contents: any[];
  selector: NexSelector | null; // Optional selector prop for handling selections
  theme?: NexTheme;
  themeUser?: NexThemeUser;
  error?: string | null;
  applet?: any;
  elements?: any[]; // Optional elements prop for additional data
  children?: React.ReactNode;
  onSelect?: (storeIndex: number, row: any) => void; // Optional onSelect prop for handling selection
  onChange?: (storeIndex: number, curRow: any, newRow: any) => void; // Optional onChange prop for handling changes
  onAdd?: (storeIndex: number, curRow: any, newRow: any) => void; // Optional onAdd prop for handling additions
  onRemove?: (storeIndex: number, curRow: any) => void; // Optional onDelete prop for handling deletions
}

const NexApplet: React.FC<NexAppProps> = observer(
  ({ name, error, theme, themeUser, applet, children }) => {
    //console.log("NexApplet theme: ", theme);
    // Applet 의 공통 속성을 적용하는 코드

    if (error) {
      return (
        <Alert severity="error" sx={{ textAlign: "left" }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      );
    }

    const fontLevel = themeUser?.fontLevel || 5; // Default font level if not provided

    const fontSize =
      theme?.applet?.fontSize[
        clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
      ] || "1rem";

    const color = theme?.applet?.colors?.[0] || "#000000";
    const bgColor = theme?.applet?.bgColors?.[0] || "#FFFFFF";
    const contentsBGColor = theme?.applet?.bgColors?.[1] || "#FFFFFF";

    const gap = theme?.applet?.gap || "8px";
    const padding = theme?.applet?.padding || "8px";
    return (
      <NexDiv width="100%" height="100%">
        <NexDiv
          direction="column"
          width="100%"
          height="100%"
          color={color}
          bgColor={bgColor}
          fontFamily={theme?.applet?.fontFamily}
          borderRadius={theme?.applet?.borderRadius || "8px"}
          padding={padding}
          fontSize={fontSize}
        >
          {(name || name !== "") && (
            <NexDiv
              fontWeight="bold"
              height={`calc(${fontSize} *2)`} // 0.5rem for padding
            >
              <NexLabel>{name}</NexLabel>
            </NexDiv>
          )}

          <NexDiv width="100%" height="100%" bgColor={contentsBGColor}>
            {children}
          </NexDiv>
        </NexDiv>
      </NexDiv>
    );
  }
);

export default NexApplet;
