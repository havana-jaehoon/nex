import React, { useEffect, useMemo, useState } from "react";
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
import { data, Route } from "react-router-dom";
import { getThemeStyle } from "type/NexTheme";

const NexNodeTreeApp: React.FC<NexAppProps> = observer((props) => {
  const { name, contents, theme, user, onSelect, onUpdate, onAdd, onRemove } =
    props;

  const [editingNode, setEditingNode] = useState<any>(null);
  const [curData, setCurData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const style = getThemeStyle(theme, "applet");
  const activeColor = style.activeColors[0];
  const color = style.colors[0];
  const bgColor = style.bgColors[0];

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
    style.fontSize[clamp(fontLevel, 0, style.fontSize?.length - 1)] || "1rem";

  //const treeData = contents?.[0]?.json || [];

  const [nexTree, setNexTree] = useState<any>(null);
  //const [store, setStore] = useState<any>(null);
  //const [format, setFormat] = useState<any>(null);
  //const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!contents || contents.length < 1) return;

    const cts = contents[storeIndex];

    const indexes = cts.indexes;
    let contentsData = [];
    if (!indexes)
      // indexes 가 없으면 전체 데이터
      contentsData = cts.data;
    else {
      contentsData = indexes.map((index: number) => cts.data[index]);
    }

    const tree = buildNexTree(contentsData);
    setNexTree(tree);
    //setStore(cts.store);
    //setFormat(cts.format);
    setSelectedKeys(cts.selectedKeys);
  }, [contents]);

  const handleSelect = (index: number) => {
    const row = nexTree?.getNode(index) || null;

    setCurData(row);

    /*
    console.log(
      `NexNodeTreeApp: onSelect index=${index}, row=`,
      JSON.stringify(row, null, 2)
    );
    */
    if (onSelect) {
      onSelect(0, row); // Assuming single store for now
    }
  };

  const handleRemove = (index: number) => {
    //    setSelectedPath(path);
    const row = nexTree.getNode(index);
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
    if (index === selectedKeys[0]) {
      handleSelect(-1);
    }
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
          handleSelect(-1);
        }}
      >
        <Stack spacing={0.5} direction='column' width='100%'>
          {nexTree &&
            nexTree.data &&
            nexTree.data.map(
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
                    selectedIndex={selectedKeys[0]}
                  />
                )
            )}
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default NexNodeTreeApp;
