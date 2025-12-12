import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";


import { buildNexTree } from "utils/NexTreeNode";
import { getAdminNodeFromType } from "./lib/adminDataFormat";
import { NexNodeType } from "type/NexNode";

import { getThemeStyle } from "type/NexTheme";
import axios from "axios";
import pxConfig from "config/px-config.json";
import PXIcon from "icon/pxIcon";

const NexNodeTreeApp: React.FC<NexAppProps> = observer((props) => {
  const { name, contents, theme, user, onSelect, onUpdate, onAdd, onRemove } =
    props;

  const [type, setType] = useState<string>(NexNodeType.FOLDER);
  const [nodes, setNodes] = useState<any>({});
  const [systemName, setSystemName] = useState<string>("");
  const [storageName, setStorageName] = useState<string>("");
  const [mainDatas, setMainDatas] = useState<any[]>([]);
  const [curNode, setCurNode] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  //const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const projectName = "";

  const style = getThemeStyle(theme, "applet");
  const activeColor = style.activeColor;
  const activeBgColor = style.activeBgColor;
  const color = style.color;
  const bgColor = style.bgColor;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length < 1)
      return "NexNodeTreeApp must be one store element.";
    return null;
  };

  const storeIndex = 0; // only 1 store

  const fontSize = style.fontSize || "1rem";

  const iconSize = `calc(${fontSize} * 1.1)`;
  const gapSize = `calc(${fontSize} * 0.4)`;

  useEffect(() => {
    if (!contents) return;

    let nodeList: any = {};
    contents.forEach((content, i) => {
      const nodeType = content.store?.element?.name || null;
      if (!nodeType) return;

      // main node 타입
      if (i === 0) {
        const indexes = content.indexes;
        let contentsData = [];
        if (!indexes)
          // indexes 가 없으면 전체 데이터
          contentsData = [...content.data];
        else {
          contentsData = indexes.map((index: number) => content.data[index]);
        }
        setMainDatas(contentsData);
        setType(nodeType);
      }

      if (!nodeList[nodeType]) nodeList[nodeType] = [];

      content.data.forEach((item: any) => {
        const obj = item[4];
        const node: any = Object.values(obj)[0];
        if (node?.type === nodeType) {
          // folder 제외
          nodeList[nodeType].push({
            index: i,
            name: node.name,
            dispName: node.dispName,
          });
        }
      });
    });

    setNodes(nodeList);
  }, [contents, JSON.stringify(contents?.map((cts) => cts.store.odata) || [])]);

  const treeData = useMemo(() => {
    let selectedDatas: any[] = [];
    let isModified = false;
    mainDatas.forEach((row: any) => {
      if (type !== NexNodeType.ELEMENT || row[3] === systemName) {
        selectedDatas.push(row);
      }
      if (selectedIndex === row[0]) {
        isModified = true;
        setSelectedPath(row[1]);
        setCurNode(Object.values(row[4])[0]);
      }
    });
    if (!isModified) {
      setSelectedIndex(-1);
      setSelectedPath("");
    }
    //console.log(`# treeData selectedDatas: ${selectedDatas.length}, ${systemName}, ${JSON.stringify(selectedDatas)}`);
    return buildNexTree(selectedDatas);
  }, [mainDatas, systemName]);

  const handleSelect = (index: number) => {
    const row = treeData?.getNode(index) || null;

    if (!row || row.length !== 5) {
      setSelectedIndex(-1);
      setSelectedPath("");
    } else {
      //console.log(`# handleSelect index: ${index}/${row[0]}/${row[1]}, row: ${row}`);
      setSelectedIndex(index);
      setSelectedPath(row[1]);
      setCurNode(Object.values(row[4])[0]);
    }

    if (onSelect) {
      //console.log(`# handleSelect index: ${index}, row: ${row}`);
      onSelect(0, row); // Assuming single store for now
    }
  };

  const handleApplyConfig = async () => {
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

  const handleAddFolder = async () => {
    const now = new Date();
    const nodeName = `new-folder-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;

    const newNode = {
      ...getAdminNodeFromType(NexNodeType.FOLDER),
      name: nodeName,
    };

    let parentPath = "";
    if (!curNode) {
      parentPath = "";
    } else if (
      curNode.type === NexNodeType.FOLDER ||
      curNode.type === NexNodeType.SECTION
    ) {
      parentPath = selectedPath;
    } else {
      parentPath = (() => {
        if (!selectedPath || selectedPath === "") return "";
        const trimmed = selectedPath.replace(/\/+$/, "");
        const idx = trimmed.lastIndexOf("/");
        return idx <= 0 ? "" : trimmed.slice(0, idx);
      })();
    }

    let newRecord: any = null;

    if (type === NexNodeType.ELEMENT) {
      // include system
      // current system-name
      newRecord = [
        -1,
        `${parentPath}/${newNode.name}`,
        projectName,
        systemName,
        { [-1]: newNode },
      ];
    } else {
      newRecord = [
        -1,
        `${parentPath}/${newNode.name}`,
        projectName,
        "",
        { [-1]: newNode },
      ];
    }
    if (!newRecord) return;

    console.log(
      "handleAddFolder: curNode=",
      selectedPath, selectedIndex,
      "newRecord=",
      JSON.stringify(newRecord, null, 2)
    );
    const bres = await onAdd?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("추가에 실패했습니다.");
    }
  };

  const handleAddEntity = async () => {
    const now = new Date();
    const nodeName = `new-${type}-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;
    const newNode = {
      ...getAdminNodeFromType(type),
      name: nodeName,
    };

    let parentPath = "";
    if (!curNode) {
      parentPath = "";
    } else if (
      curNode.type === NexNodeType.FOLDER ||
      (type === NexNodeType.SECTION &&
        (curNode.applet === undefined || curNode.applet === ""))
    ) {
      parentPath = selectedPath;
    } else {
      parentPath = (() => {
        if (!selectedPath || selectedPath === "") return "";
        const trimmed = selectedPath.replace(/\/+$/, "");
        const idx = trimmed.lastIndexOf("/");
        return idx <= 0 ? "" : trimmed.slice(0, idx);
      })();
    }

    let newRecord: any = null;

    if (type === NexNodeType.ELEMENT) {
      // include system
      // current system-name
      newRecord = [
        -1,
        `${parentPath}/${newNode.name}`,
        projectName,
        systemName,
        { [-1]: newNode },
      ];
    } else {
      newRecord = [
        -1,
        `${parentPath}/${newNode.name}`,
        projectName,
        "",
        { [-1]: newNode },
      ];
    }
    if (!newRecord) return;

    console.log(
      "handleAddEntity: newRecord=",
      JSON.stringify(newRecord, null, 2)
    );
    const bres = await onAdd?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("추가에 실패했습니다.");
    }
  };

  const handleRemove = (index: number) => {
    //    setSelectedPath(path);
    const row = treeData.getNode(index);
    //setCurData(row);

    if (!row) {
      window.alert("삭제할 노드가 올바르지 않습니다.");
      return;
    }

    // onRemove  가 없으면 삭제 불가
    if (!onRemove) {
      console.warn("NexNodeTreeApp: handleRemove - onRemove is not provided");
      return;
    }

    // 정말로 삭제할까요?
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    if (!onRemove(storeIndex, row)) {
      // 삭제가 실패한 경우
      window.alert("삭제에 실패했습니다.");
      return;
    }
    // 삭제한 노드가 선택된 노드인 경우 선택 해제
    if (index === selectedIndex) {
      handleSelect(-1);
    }
  };

  const handleGenDbData = async () => {
    console.log(
      "handleGenDbData: systemName=",
      systemName,
      " storageName=",
      storageName
    );
    try {
      await axios
        .request({
          method: "get",
          url: pxConfig["command-url"] + "/gen-db-element",
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

  const systemSelector = () => {
    if (
      type === NexNodeType.ELEMENT &&
      nodes[NexNodeType.SYSTEM] &&
      nodes[NexNodeType.SYSTEM].length > 0
    ) {
      return (
        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          width="100%"
        >
          <Select
            value={systemName}
            onChange={(e) => { setSystemName(e.target.value as string); handleSelect(-1); }}
            fullWidth={true}
            displayEmpty
            renderValue={(selected) => {
              if (selected === "") return "시스템 선택";
              const item = nodes[NexNodeType.SYSTEM].find(
                (n: any) => n.name === selected
              );
              return item ? item.dispName : selected;
            }}
          >
            {nodes[NexNodeType.SYSTEM].map((node: any, index: number) => (
              <MenuItem key={index} value={node.name}>
                {node.dispName}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={storageName}
            fullWidth={true}
            onChange={(e) => setStorageName(e.target.value as string)}
            displayEmpty
            renderValue={(selected) => {
              if (selected === "") return "스토리지 선택";
              const item = nodes[NexNodeType.SYSTEM].find(
                (n: any) => n.name === selected
              );
              return item ? item.dispName : selected;
            }}
          >
            {nodes[NexNodeType.STORAGE].map((node: any, index: number) => (
              <MenuItem key={index} value={node.name}>
                {node.dispName}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            sx={{ width: "70%" }}
            onClick={(e) => {
              e.stopPropagation();
              handleGenDbData();
            }}
          >
            DB 데이터 생성
          </Button>
        </Stack>
      );
    }
    return null;
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv
        flex="1"
        direction="column"
        align="center"
        justify="flex-start"
        color={color}
        bgColor={bgColor}
        width="100%"
        height="100%"
        fontSize={fontSize}
        onClick={(e) => {
          // 컨테이너 자신을 직접 클릭한 경우(빈 영역)만 선택 해제
          // 자식 요소를 클릭한 경우(e.target !== e.currentTarget)에는 무시
          if (e.currentTarget !== e.target) return;
          handleSelect(-1);
        }}
      >
        <span style={{ height: gapSize }} />


        {systemSelector()}
        <Stack spacing={1} direction="row" justifyContent="end" width="100%">
          {!(type === NexNodeType.SYSTEM || type === NexNodeType.SECTION || type === NexNodeType.STORAGE) && (
            <IconButton
              title="폴더 추가"
              onClick={(e) => {
                e.stopPropagation();
                handleAddFolder();
              }}
              sx={{ color: color, alignItems: "flex-center" }}
            >
              <PXIcon
                path="/config/new-folder"
                width={iconSize}
                height={iconSize}
              />{" "}
              <span style={{ width: gapSize }} />
              <NexLabel fontSize={fontSize}>폴더 추가</NexLabel>
            </IconButton>
          )}
          <IconButton
            title="엔티티 추가"
            sx={{ color: color, alignItems: "flex-center" }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddEntity();
            }}
          >
            <PXIcon
              path="/config/new-entity"
              width={iconSize}
              height={iconSize}
            />{" "}
            <span style={{ width: gapSize }} />
            <NexLabel fontSize={fontSize}>엔티티 추가</NexLabel>
          </IconButton>
        </Stack>

        <span style={{ height: gapSize }} />
        <span style={{ height: gapSize }} />

        <NexDiv width="100%" overflow="auto">
          <Stack spacing={0.5} direction="column" width="100%">
            {treeData &&
              treeData.data &&
              treeData.data.map(
                (obj: any, index: number) =>
                  obj && (
                    <NexNodeItem
                      key={index}
                      depts={0}
                      node={obj}
                      theme={theme}
                      user={user}
                      onSelect={handleSelect}
                      onRemove={handleRemove}
                      selectedIndex={selectedIndex}
                    />
                  )
              )}
          </Stack>
        </NexDiv>
      </NexDiv>
    </NexApplet>
  );
});

export default NexNodeTreeApp;
