import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import ReactJson from "react-json-view";
import { clamp } from "utils/util";
import { set } from "mobx";
import { Alert, AlertTitle } from "@mui/material";

const NexNodeJsonViewer: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user } = props;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  //console.log("NexNodeJsonViewer: stores=", JSON.stringify(stores, null, 2));
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length !== 1)
      return "NexNodeTreeApp must be one store element.";
    return null;
  };

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel - 1, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const data = contents?.[0]?.json || null;

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv direction="column" width="100%" height="100%" fontSize={fontSize}>
        {data && data.length !== 0 ? (
          <ReactJson
            src={data}
            name={null}
            displayDataTypes={false}
            style={{
              width: "100%",
              fontSize: fontSize,
              textAlign: "left",
            }}
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

export default NexNodeJsonViewer;
