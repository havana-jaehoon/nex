import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import {
  MdAdd,
  MdCreate,
  MdDelete,
  MdDownload,
  MdEdit,
  MdGeneratingTokens,
  MdPlayForWork,
} from "react-icons/md";
import { clamp } from "utils/util";
import { getThemeStyle } from "type/NexTheme";
import axios from "axios";
import { ServerURL } from "nexConfig";

const StorageElementGenerator: React.FC<NexAppProps> = observer((props) => {
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

  const [systemName, setSystemName] = useState<string>("");
  const [storageName, setStorageName] = useState<string>("");

  useEffect(() => {
    // system name 과 storage name 을 contents 에서 가져오기

    const ctsSystem = contents?.[0];
    if (ctsSystem && ctsSystem.store) {
      const tdata = ctsSystem.indexes
        ? ctsSystem.indexes?.map((i: number) => ctsSystem.data[i]) || []
        : ctsSystem.data || [];
      if (tdata.length > 0) {
        const item = tdata[0];
        console.log(
          "StorageElementGenerator: system-item=",
          JSON.stringify(item, null, 2)
        );

        const obj = item[4];
        const node: any = Object.values(obj)[0];
        setSystemName(node.name);
      }
    }

    const ctsStorage = contents?.[1];
    if (ctsStorage && ctsStorage.store) {
      const tdata = ctsStorage.indexes
        ? ctsStorage.indexes?.map((i: number) => ctsStorage.data[i]) || []
        : ctsStorage.data || [];
      if (tdata.length > 0) {
        const item = tdata[0];
        console.log(
          "StorageElementGenerator: storage-item=",
          JSON.stringify(item, null, 2)
        );
        const obj = item[4];
        const node: any = Object.values(obj)[0];
        setStorageName(node.name);
      }
    }
  }, [contents]);

  const handleGenStorageElement = async () => {
    try {
      await axios
        .request({
          method: "get",
          url: ServerURL + "/cmd-api/gen-db-element",
          params: {
            project: "",
            system: systemName,
            storage: storageName,
          },
        })
        .then((response) => {
          console.log("NexConfigDistApp::handleClick() response:", response);
          window.location.reload();
        });
    } catch (error) {
      console.error("Failed to generate storage element:", error);
    }
  };

  const handleApplyConfig = async () => {
    try {
      await axios
        .request({
          method: "get",
          url: ServerURL + "/cmd-api/dist",
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
      <NexDiv direction="column" width="100%" height="100%">
        <Stack direction="row" spacing={1} padding="8px">
          <TextField
            disabled
            size="small"
            variant="standard"
            label={"시스템"}
            value={systemName}
            style={{ width: "100%" }}
          />
          <TextField
            disabled
            size="small"
            variant="standard"
            label={"스토리지"}
            value={storageName}
            style={{ width: "100%" }}
          />
          <IconButton
            title="엘리먼트 생성"
            onClick={() => handleGenStorageElement()}
          >
            <MdGeneratingTokens />
          </IconButton>
          <IconButton title="설정 적용" onClick={() => handleApplyConfig()}>
            <MdPlayForWork />
          </IconButton>
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default StorageElementGenerator;
