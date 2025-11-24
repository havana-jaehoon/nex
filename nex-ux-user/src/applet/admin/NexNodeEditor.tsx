import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";
import { set } from "mobx";

const NexNodeEditor: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate, onAdd } = props;

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
  const [record, setRecord] = useState<any>(null);
  const [node, setNode] = useState<any>(null);
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
      setRecord(null);
      setNode(null);
      return;
    }

    setFeatures(cts.format.features || []);

    const tdata = cts.indexes
      ? cts.indexes?.map((i: number) => cts.data[i]) || []
      : cts.data || [];

    let curRecord = null;
    let curNode = null;
    if (tdata.length > 0) {
      curRecord = tdata[0];
      curNode = Object.values(tdata[0][4])[0];
    }

    setRecord(curRecord);
    setNode(curNode);
  }, [contents, contentsOdata]);

  const handleUpdate = (newNode: any) => {
    //console.log("handleUpdate : ", JSON.stringify(newNode, null, 2));

    if (!record || record.length !== 5) return;
    const keys = Object.keys(record[4] || {});
    if (keys.length !== 1) return;
    const key = keys[0];
    const path = record[1];

    const parentPath = (() => {
      if (!path) return "";
      const trimmed = path.replace(/\/+$/, "");
      const idx = trimmed.lastIndexOf("/");
      return idx <= 0 ? "" : trimmed.slice(0, idx);
    })();

    const newRecord = [
      record[0],
      `/${parentPath}/${newNode.name}`,
      record[2],
      record[3],
      { [key]: newNode },
    ];

    const bres = onUpdate?.(0, newRecord);
    if (!bres) {
      window.alert("Data update failed");
    }
  };

  
  return (
    <NexApplet {...props} error={errorMsg()}>
      {node ? (
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
          <AdminNodeEditor node={node} onUpdate={handleUpdate} />
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexNodeEditor;
