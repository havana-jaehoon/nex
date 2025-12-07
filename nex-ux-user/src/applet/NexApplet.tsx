import { observer } from "mobx-react-lite";

import { Alert, AlertTitle } from "@mui/material";
import { NexDiv, NexLabel } from "../component/base/NexBaseComponents";

import { defaultThemeStyle, getThemeStyle, NexTheme } from "type/NexTheme";
import { clamp } from "utils/util";
import NexSelector from "store/NexSelector";
import { NexThemeUser } from "../type/NexTheme";
import { nexIcon, nexNodeIcon } from "icon/NexIcon";
import { NexContents } from "provider/NexAppProvider";

/*
export interface NexAppData {
  store: NexDataStore | null; // Data store for the applet
  conditions: { feature: string }[]; // Conditions for filtering data
  selections: NexSelection[]; // Selections made by the user
}
*/
export interface NexAppProps {
  name?: string; // Optional name for the applet
  icon?: string;

  //Contents of the applet, can be used for rendering
  // store, csv, json, format, 등 통합
  // 모든 applet 보완 이후  datas, stores, selector 등 불필요한 인자 제거 필요
  contents: NexContents[];
  store?: any;
  selector: NexSelector | null; // Optional selector prop for handling selections
  theme?: NexTheme;
  user?: NexThemeUser;
  error?: string | null;
  applet?: any;
  elements?: any[]; // Optional elements prop for additional data
  children?: React.ReactNode;
  onSelect?: (storeIndex: number, curRow: any) => boolean; // Optional onSelect prop for handling selection
  onUpdate?: (storeIndex: number, updatedRow: any) => boolean; // Optional onChange prop for handling changes
  onAdd?: (storeIndex: number, newRow: any) => boolean; // Optional onAdd prop for handling additions
  onRemove?: (storeIndex: number, curRow: any) => boolean; // Optional onDelete prop for handling deletions
}

const NexApplet: React.FC<NexAppProps> = observer(
  ({ name, icon, error, theme, user, applet, children }) => {
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

    const fontLevel = user?.fontLevel || 5; // Default font level if not provided

    const style = getThemeStyle(theme, "applet");
    const fontSize =
      style?.fontSize[clamp(fontLevel, 0, style?.fontSize?.length - 1)] ||
      "1rem";

    const color = style.color || "#000000";
    const bgColor = style.bgColor || "#FFFFFF";
    const contentsBGColor = style.bgColor || "#FFFFFF";

    const padding = style.padding || "8px";

    const fontFamily = style.fontFamily || "Pretendard";
    console.log("NexApplet fontFamily: ", fontFamily);

    return (
      <NexDiv width="100%" height="100%">
        <NexDiv
          direction="column"
          width="100%"
          height="100%"
          color={color}
          bgColor={bgColor}
          fontFamily={fontFamily}
          borderRadius={style?.borderRadius || "8px"}
          padding={padding}
          fontSize={fontSize}
        >
          {nexIcon(icon, fontSize)}
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
