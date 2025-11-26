import React, { useContext, useEffect, useState } from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
//import { NexFeature } from "../nexAppletStore";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { clamp } from "../../utils/util";
import { Box, Button, Stack } from "@mui/material";
import { getThemeStyle } from "type/NexTheme";
import PXIcon from "icon/pxIcon";

//import { fieldPaths } from "test/data/testProjects";

const PXHeadApp: React.FC<NexAppProps> = observer((props) => {
  const { name, user, theme } = props;
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const style = getThemeStyle(theme, "table");
  const contentsFontSize =
    style.fontSize[clamp(fontLevel + 3, 0, style.fontSize?.length - 1)] ||
    "1rem";

  return (
    <NexDiv
      direction="column"
      width="100%"
      height="100%"
      align="flex-start"
      justify="center"
      fontSize={contentsFontSize}
      fontWeight="bold"
      color={style.color}
    >
      <NexLabel> {name} </NexLabel>
    </NexDiv>
  );
});

export default PXHeadApp;
