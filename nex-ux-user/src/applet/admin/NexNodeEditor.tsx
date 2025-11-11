import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";

const NexNodeEditor: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate } = props;

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

  const defaultStyle = getThemeStyle(theme, "default");

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    defaultStyle?.fontSize[
      clamp(fontLevel - 1, 0, defaultStyle?.fontSize?.length - 1)
    ] || "1rem";

  const color = defaultStyle?.colors[0] || "#393c45";
  const bgColor = defaultStyle?.bgColors[0] || "#e8edf7";

  const storeIndex = 0; // only 1 store
  const [data, setData] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  // Memoize derived dependency to satisfy React Hooks lint rule
  const contentsOdata = useMemo(
    () => contents?.map((c) => c.store.odata),
    [contents]
  );

  useEffect(() => {
    const cts = contents?.[storeIndex];
    if (!cts || !cts.store) {
      setFeatures([]);
      setData(null);
      return;
    }

    const tdata = cts.indexes
      ? cts.indexes?.map((i: number) => cts.data[i]) || []
      : cts.data || [];

    //console.log("NexJsonEditor: data=", JSON.stringify(cts, null, 2));
    setFeatures(cts.format.features || []);
    setData(tdata.length > 0 ? tdata[0] : null);
  }, [contents, contentsOdata]);

  const handleApply = (newData: any) => {
    //console.log("onApply : ", JSON.stringify(newData, null, 2));
    const bres = onUpdate?.(0, newData);
    if (!bres) {
      window.alert("Data update failed");
    }
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
          overflow="auto"
        >
          <AdminNodeEditor data={data} mode="edit" onApply={handleApply} />
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexNodeEditor;
