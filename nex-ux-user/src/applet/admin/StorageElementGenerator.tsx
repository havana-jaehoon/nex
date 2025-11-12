import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import {
  Autocomplete,
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
  const [systemList, setSystemList] = useState<string[]>([]);
  const [storageList, setStorageList] = useState<string[]>([]);

  useEffect(() => {
    // system name 과 storage name 을 contents 에서 가져오기

    const ctsSystem = contents?.[0];
    if (ctsSystem && ctsSystem.store) {
      const tList = ctsSystem.data.map((item: any) => {
        const obj = item[4];
        const node: any = Object.values(obj)[0];
        return node.name;
      });
      setSystemList(tList);
    }

    const ctsStorage = contents?.[1];
    if (ctsStorage && ctsStorage.store) {
      const tList = ctsStorage.data.map((item: any) => {
        const obj = item[4];
        const node: any = Object.values(obj)[0];
        return node.name;
      });
      setStorageList(tList);
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
      <Stack
        direction="column"
        width="100%"
        height="100%"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          style={{ width: "96%" }}
        >
          <Autocomplete
            options={systemList}
            value={systemName}
            onChange={(event, newValue) => {
              setSystemName(newValue || "");
            }}
            id="generate_storage_2_element_system"
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="시스템" variant="outlined" />
            )}
          />

          <Autocomplete
            options={storageList}
            value={storageName}
            onChange={(event, newValue) => {
              setStorageName(newValue || "");
            }}
            id="generate_storage_2_element_storage"
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="스토리지" variant="outlined" />
            )}
          />

          <Button
            title="데이터 생성"
            variant="contained"
            size="large"
            onClick={() => handleGenStorageElement()}
            style={{ width: "100%" }}
            startIcon={<MdGeneratingTokens />}
          >
            데이터 생성
          </Button>
          <Button
            title="설정 적용"
            variant="contained"
            size="large"
            onClick={() => handleApplyConfig()}
            style={{ width: "100%" }}
            startIcon={<MdPlayForWork />}
          >
            설정 적용
          </Button>
        </Stack>
      </Stack>
    </NexApplet>
  );
});

export default StorageElementGenerator;
