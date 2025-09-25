import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { Alert, IconButton, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import { MdCreateNewFolder, MdEdit, MdNewLabel } from "react-icons/md";
import { clamp } from "utils/util";
import NexModalNodeEditer from "modal/NexModalNodeEditer";
import { buildNexTree } from "utils/NexTreeNode";
import { getAdminNodeFromType } from "./lib/adminDataFormat";
import { NexNodeType } from "type/NexNode";
import { set } from "mobx";
import { data } from "react-router-dom";

const NexNodeTreeApp: React.FC<NexAppProps> = observer((props) => {
  const { name, contents, theme, user, onSelect, onUpdate, onAdd, onRemove } =
    props;

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

    setIsAdding(true);
    setIsEditing(true);
  };

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

    let parentNodePath = "";
    if (!curData) {
      window.alert("편집할 노드를 선택하세요.");
      return;
    }

    console.log("# parentNodePath=", parentNodePath);

    setEditingNode([
      curData[0],
      curData[1].substring(0, curData[1].lastIndexOf("/")) + "/",
      curData[2],
    ]);

    setIsEditing(true);
  };

  const handleApply = (mode: "add" | "edit", node: any) => {
    if (mode === "add") {
      console.log("NexNodeTreeApp: handleApply - add", node);
      if (onAdd && onAdd(storeIndex, node)) {
        // 추가가 성공한 경우
        setIsAdding(false);
        setIsEditing(false);

        const nodePath = node[1];
        handleSelect(nodePath);
        setCurData(null);
      }
    } else if (mode === "edit") {
      console.log("NexNodeTreeApp: handleApply - edit", node);
      if (onUpdate && onUpdate(storeIndex, node)) {
        setIsEditing(false);
        const nodePath = node[1];
        handleSelect(nodePath);
      }
    }
  };

  const handleCancel = () => {
    console.log("NexNodeTreeApp: handleCancel");
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleRemove = (node: any) => {
    if (!node) {
      window.alert("삭제할 노드를 선택하세요.");
      return;
    }
    console.log(`NexNodeTreeApp: removeNode path=${selectedPath}`);

    // 정말로 삭제할까요?
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    onRemove && onRemove(storeIndex, node);
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv
        flex='1'
        direction='column'
        align='center'
        justify='flex-start'
        color={color}
        bgColor={bgColor}
        width='100%'
        height='100%'
        overflow='auto'
        fontSize={fontSize}
        onClick={(e) => {
          // 컨테이너 자신을 직접 클릭한 경우(빈 영역)만 선택 해제
          // 자식 요소를 클릭한 경우(e.target !== e.currentTarget)에는 무시
          if (e.currentTarget !== e.target) return;
          handleSelect("");
        }}
      >
        {/* Add & Delete & Edit */}
        <Stack spacing={0.5} direction='row' justifyContent='end' width='100%'>
          <IconButton
            title='폴더 추가'
            color='primary'
            onClick={handleAddFolder}
          >
            <MdCreateNewFolder />
          </IconButton>
          <IconButton title='Add' color='primary' onClick={handleAddEntity}>
            <MdNewLabel />
          </IconButton>
          <IconButton title='Edit' color='primary' onClick={handleEdit}>
            <MdEdit />
          </IconButton>
        </Stack>
        <Stack spacing={0.5} direction='column' width='100%'>
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
      {isEditing && (
        <NexModalNodeEditer
          label={`${name} ${isAdding ? "추가" : "편집"} `}
          isOpen={isEditing}
          data={editingNode}
          mode={isEditing ? "add" : "edit"}
          onApply={(data) => handleApply(isEditing ? "add" : "edit", data)}
          onCancel={() => handleCancel()}
        />
      )}
    </NexApplet>
  );
});

export default NexNodeTreeApp;
