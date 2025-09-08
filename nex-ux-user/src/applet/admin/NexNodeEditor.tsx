import React, { useEffect, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { Alert, AlertTitle } from "@mui/material";
import {
  JsonEditor,
  githubLightTheme,
  githubDarkTheme,
  monoLightTheme,
  monoDarkTheme,
  candyWrapperTheme,
  psychedelicTheme,
} from "json-edit-react";
import ReactJson from "react-json-view";

const NexNodeEditor: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, themeUser } = props;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  //console.log("NexNodeEditor: stores=", JSON.stringify(stores, null, 2));
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length !== 1)
      return "NexNodeEditor must be one store element.";
    return null;
  };

  const fontLevel = themeUser?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel - 1, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const data = contents?.[0]?.json[0] || null;

  const [node, setNode] = useState<any>(data);
  useEffect(() => {
    setNode(data);
  }, [data]);

  const handleUpdate = (updatedData: any) => {
    console.log("1Updated Data:", JSON.stringify(updatedData, null, 2));
    setNode(updatedData.currentData);
    console.log("2Updated Data:", JSON.stringify(node, null, 2));
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv direction="column" width="100%" height="100%" fontSize={fontSize}>
        {node ? (
          <JsonEditor
            data={node}
            setData={setNode}
            theme={githubLightTheme}
            onUpdate={handleUpdate}
            indent={2}
            rootName=""
          />
        ) : (
          <Alert
            severity="warning"
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <AlertTitle>
              {"No data available to display in JSON format."}
            </AlertTitle>
          </Alert>
        )}
      </NexDiv>
    </NexApplet>
  );
});

export default NexNodeEditor;
