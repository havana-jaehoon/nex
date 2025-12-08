import React, { useContext, useEffect, useState } from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
//import { NexFeature } from "../nexAppletStore";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { clamp } from "../../utils/util";
import { Box, Button, Stack } from "@mui/material";
import { getThemeStyle } from "type/NexTheme";
import PXIcon from "icon/pxIcon";
import axios from "axios";
import pxConfig from "config/px-config.json";
import { MdCloudUpload } from "react-icons/md";
//import { fieldPaths } from "test/data/testProjects";

const PXHeadApp: React.FC<NexAppProps> = observer((props) => {
  const { name, user, theme } = props;
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const style = getThemeStyle(theme, "applet");
  const contentsFontSize = `calc(${style.fontSize ?? "1rem"} * 1.4)`;
  const color = style.color ?? "#000000";


  const handleClick = async () => {
    try {
      await axios
        .request({
          method: "get",
          url: pxConfig["command-url"] + "/dist",
        })
        .then((response) => {
          console.log("NexConfigDistApp::handleClick() response:", response);
          window.location.reload();
        });
    } catch (error) {
      console.error("Failed to apply config:", error);
    }
  };

  return (
    <NexDiv
      width="100%"
      height="100%"
      align="center"
      justify="center"
      fontSize={contentsFontSize}
      fontWeight="bold"
      color={color}
    >
      <NexLabel flex="9" align="center" > {name} </NexLabel>
      <NexDiv flex="1" width="100%" height="100%" direction="row">

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<MdCloudUpload />}
          onClick={handleClick}
          sx={{ width: "100%", height: "100%" }}
        >
          설정 적용
        </Button>
      </NexDiv>
    </NexDiv>
  );
});

export default PXHeadApp;
