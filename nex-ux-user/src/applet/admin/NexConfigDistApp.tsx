import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { Box, Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import { MdAdd, MdDelete, MdDownload, MdEdit } from "react-icons/md";
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
    if (!contents || contents.length < 1)
      return "NexNodeTreeApp must be one more element.";
    return null;
  };

  // 1.2 Theme 속성
  const appletStyle = getThemeStyle(theme, "applet");

  const color = appletStyle.colors[0];
  const bgColor = appletStyle.bgColors[0];
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    appletStyle.fontSize[
      clamp(fontLevel, 0, appletStyle.fontSize?.length - 1)
    ] || "1rem";

  const features =
    contents?.[0].store.format.features ||
    contents?.[0].store.format.children?.[0].features ||
    [];

  const nameIndex = features.findIndex((f: any) => f.name === "dispName") || 4;

  const handleClick = () => {
    axios
      .request({
        method: "post",
        url: pxConfig["command-url"] + "/dist",
      })
      .then((response) => {
        console.log("NexConfigDistApp::handleClick() response:", response);
      });
    window.location.reload();
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv direction='column' width='100%' height='100%'>
        <IconButton onClick={() => handleClick()}>
          <MdDownload />
        </IconButton>
      </NexDiv>
    </NexApplet>
  );
});

export default NexConfigDistApp;
