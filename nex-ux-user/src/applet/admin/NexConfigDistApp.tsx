import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import { MdAdd, MdCloudUpload, MdDelete, MdDownload, MdEdit } from "react-icons/md";
import { clamp } from "utils/util";
import { getThemeStyle } from "type/NexTheme";
import axios from "axios";
import pxConfig from "config/px-config.json";

const NexConfigDistApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onSelect } = props;

  const [selectedIndexs, setSelectedIndexs] = useState<number[]>([]);

  // storeIndex 위치에 itemIndex 값을 세팅
  const setSelectedIndex = (storeIndex: number, itemIndex: number) => {
    setSelectedIndexs((prev) => {
      const next = [...prev];
      next[storeIndex] = itemIndex;
      return next;
    });
  };

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    return null;
  };

  // 1.2 Theme 속성
  const appletStyle = getThemeStyle(theme, "applet");

  const color = appletStyle.color;
  const bgColor = appletStyle.bgColor;
  const fontSize = appletStyle.fontSize || "1rem";



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
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv width="100%" height="100%" direction="row">

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<MdCloudUpload />}
          onClick={handleClick}
        >
          설정 데이터 적용
        </Button>
      </NexDiv>
    </NexApplet>
  );
});

export default NexConfigDistApp;
