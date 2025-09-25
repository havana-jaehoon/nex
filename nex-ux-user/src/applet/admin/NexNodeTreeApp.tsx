import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import {
  MdAdd,
  MdCreateNewFolder,
  MdDelete,
  MdEdit,
  MdNewLabel,
} from "react-icons/md";
import { clamp } from "utils/util";
import NexModalNodeEditer from "modal/NexModalNodeEditer";
import { buildNexTree } from "utils/NexTreeNode";
import {
  getAdminNodeFromFeatures,
  getAdminNodeFromType,
} from "./lib/adminDataFormat";
import { set } from "mobx";
import { NexNodeType } from "type/NexNode";

const NexNodeTreeApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onSelect, onUpdate, onAdd, onRemove } = props;

  const [editingNode, setEditingNode] = useState<any>(null);
  const [curData, setCurData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const color = theme?.applet?.colors[0];
  const bgColor = theme?.applet?.bgColors[0];

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length !== 1)
      return "NexNodeTreeApp must be one store element.";
    return null;
  };

  const storeIndex = 0; // only 1 store

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  //const treeData = contents?.[0]?.json || [];
  const csvData = contents?.[storeIndex]?.csv || [];
  const nodeType = contents?.[storeIndex]?.name || "";

  const nexTree = buildNexTree(csvData);

  //console.log(
  //  `NexNodeTreeApp: csvData=${JSON.stringify(contents, null, 2)}`
  //);
  const treeData = nexTree.roots;

  const store = contents[storeIndex].store;

  const format = contents[storeIndex].format;

  const handleSelect = (path: string) => {
    setSelectedPath(path);
    const row = csvData[nexTree.pathMap[path].index];
    setCurData(row);
    console.log(`NexNodeTreeApp: onSelect path=${path}, row=`, row);

    if (onSelect) {
      onSelect(0, row); // Assuming single store for now
    }
  };

  const addNode = (type: NexNodeType) => {
    const newNode = getAdminNodeFromType(type);

    const index = -1;
    let parentNodePath = "";
    if (!curData) {
      parentNodePath = "/";
    } else if (curData[2].type === NexNodeType.FOLDER) {
      parentNodePath = curData[1] + "/";
    } else {
      parentNodePath =
        curData[1].substring(0, curData[1].lastIndexOf("/")) + "/";
    }
    console.log("# parentNodePath=", parentNodePath);

    setEditingNode([index, parentNodePath, newNode]);
    console.log(
      `NexNodeTreeApp: addFolder -> nodeType=${type}, newNode=${JSON.stringify(newNode, null, 2)}`
    );

    setIsAdding(true);
  }

  const handleAddFolder = () => {
    if (!onAdd) {
      console.warn("NexNodeTreeApp: addFolder - onAdd is not provided");
      return;
    }
    //const store.element.name
    const nodeType = "folder";
    addNode(nodeType as NexNodeType);
  };

  const handleAddEntity = () => {
    if (!onAdd) {
      console.warn("NexNodeTreeApp: addNode - onAdd is not provided");
      return;
    }
    const nodeType = store.element.name;
    addNode(nodeType as NexNodeType);
  };

  const handleEdit = () => {
    console.log(`NexNodeTreeApp: editNode path=${selectedPath}`);
  };

  const handleRemove = () => {
    console.log(`NexNodeTreeApp: removeNode path=${selectedPath}`);
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
        overflow="auto"
        fontSize={fontSize}
        onClick={(e) => {
          // 컨테이너 자신을 직접 클릭한 경우(빈 영역)만 선택 해제
          // 자식 요소를 클릭한 경우(e.target !== e.currentTarget)에는 무시
          if (e.currentTarget !== e.target) return;
          handleSelect("");
        }}
      >
        {/* Add & Delete & Edit */}
        <Stack spacing={0.5} direction="row" justifyContent="end" width="100%">
          <IconButton title="폴더 추가" color="primary" onClick={handleAddFolder}>
            <MdCreateNewFolder />
          </IconButton>
          <IconButton title="Add" color="primary" onClick={handleAddEntity}>
            <MdNewLabel />
          </IconButton>
          <IconButton title="Edit" color="primary" onClick={handleEdit}>
            <MdEdit />
          </IconButton>
        </Stack>
        <Stack spacing={0.5} direction="column" width="100%">
          {treeData.map((node: any, index: number) => (
            <NexNodeItem
              key={index}
              depts={0}
              node={node}
              theme={theme}
              user={user}
              path={node.path}
              onSelect={handleSelect}
              selectedPath={selectedPath}
            />
          ))}
        </Stack>
      </NexDiv>
      {isAdding && (
        <NexModalNodeEditer
          isOpen={isAdding}
          data={editingNode}
          mode="add"
          onApply={() => setIsAdding(false)}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </NexApplet>
  );
});

export default NexNodeTreeApp;
