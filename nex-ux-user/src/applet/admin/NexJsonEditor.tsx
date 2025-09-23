import React, { useEffect, useState } from "react";
import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import { nexNodeIcon } from "icon/NexIcon";
import JsonEditor from "./lib/JsonEditor";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { Stack } from "@mui/material";
import { clamp } from "utils/util";
import { defaultThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";
import { NexFeatureType, NexNodeType } from "type/NexNode";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

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
  const csvData = contents?.[0]?.csv || [];
  //const data = contents?.[0]?.json[0] || null;

  const data = csvData.length > 0 ? csvData[0][1] : null;
  //console.log(`NexNodeEditor: csvData=${JSON.stringify(data, null, 2)}`);

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const style = theme?.default || defaultThemeStyle;
  const fontSize =
    style?.fontSize[clamp(fontLevel - 1, 0, style?.fontSize?.length - 1)] ||
    "1rem";

  const color = style?.colors[0] || "#393c45";
  const bgColor = style?.bgColors[0] || "#e8edf7";

  const [node, setNode] = useState<any>(data);
  useEffect(() => {
    setNode(data);
  }, [data]);

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

          <AdminNodeEditor
            nodeType={data.type}
            node={data}
            type="add"
            onApply={() => {}}
            onCancel={() => {}}
            onSetValue={(key, value) => {}}
          />
        </NexDiv>
      ) : (
        <AdminNodeEditor
          nodeType={NexNodeType.FEATURE}
          type="add"
          onApply={() => {}}
          onCancel={() => {}}
          onSetValue={(key, value) => {}}
        />
      )}
    </NexApplet>
  );
});

export default NexJsonEditor;
