import React, { useEffect, useState } from "react";
import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import { nexNodeIcon } from "icon/NexIcon";
import JsonEditor from "./lib/JsonEditor";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { Stack } from "@mui/material";
import { clamp } from "utils/util";
import { defaultThemeStyle } from "type/NexTheme";

const colorSelection = "#0F6CED";

const borderColorSection = "#555555";

const NexJsonEditor: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user } = props;

  const [isMouseEnter, setMouseEnter] = useState(false);
  const [isFocus, setFocus] = useState(false);

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  //console.log("NexNodeEditor: stores=", JSON.stringify(stores, null, 2));
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length !== 1)
      return "NexNodeEditor must be one store element.";
    return null;
  };
  const data = contents?.[0]?.json[0] || null;

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const style = theme?.default || defaultThemeStyle;
  const fontSize =
    style?.fontSize[
      clamp(fontLevel - 1, 0, style?.fontSize?.length - 1)
    ] || "1rem";

  const color = style?.colors[0] || "#393c45";
  const bgColor = style?.bgColors[0] || "#e8edf7";

  const [node, setNode] = useState<any>(data);
  useEffect(() => {
    setNode(data);
  }, [data]);

  /*
  const handleUpdatePath = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChangePath(editingPath);
    } else if (e.key === "Escape") {
      setEditingPath(path);
    }
  };
*/

  //onChange: (newData: { [key: string]: any }) => void; // 변경 완료시 데이터 업데이트
  const handleChange = (newData: { [key: string]: any }) => {
    console.log("onChange : ", JSON.stringify(newData, null, 2));
    //setNode(newData);
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      {data ? (
        <NexDiv
          direction="column"
          align="center"
          width="100%"
          height="100%"
          color={color}
          bgColor={bgColor}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
        >
          <NexDiv
            direction="row"
            align="flex-start"
            width="100%"
            height={`calc(${fontSize} * 2)`}
            borderTop={
              isMouseEnter || isFocus ? `4px solid ${colorSelection}` : "none"
            }
            borderBottom={`1px solid ${borderColorSection}`}
            fontSize={`calc(${fontSize} * 1.3)`}
          >
            <Stack
              title={data?.name || ""}
              spacing={1}
              direction="row"
              width="100%"
              style={isMouseEnter || isFocus ? { fontWeight: "bold" } : {}}
            >
              <NexLabel>{nexNodeIcon(data?.type, "1.2em")}</NexLabel>
              <NexLabel>{data?.type?.toUpperCase() + " 노드 편집"}</NexLabel>
            </Stack>
          </NexDiv>
          <NexDiv
            direction="column"
            align="flex-start"
            justify="flex-start"
            width="100%"
            height="100%"
            overflow="auto"
            padding="1rem 0rem"
          >
            <Stack flex="2" spacing={0.5} direction="column" width="100%">
              <NexDiv direction="row" width="100%">
                <JsonEditor
                  isForbidden={data?.isForbidden || false}
                  depth={0}
                  data={data}
                  theme={theme}
                  onFocus={setFocus}
                  onChange={handleChange}
                />
              </NexDiv>
            </Stack>
          </NexDiv>
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexJsonEditor;
