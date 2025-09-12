import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { Button, ButtonGroup, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { clamp } from "utils/util";
import NexModalNodeEditer from "modal/NexModalNodeEditer";

const NexNodeTreeApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, themeUser, onSelect, onChange, onAdd, onRemove } =
    props;

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

  const fontLevel = themeUser?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const treeData = contents?.[0]?.json || [];

  const store = contents[0].store;

  const format = contents[0].format;

  const handleClick = (path: string) => {
    setSelectedPath(path);
    if (onSelect) {
      const row = store.findRowFromPath(path);

      if (row) {
        onSelect(0, row); // Assuming single store for now
      }
    }
  };

  const addNode = () => {
    if (!onAdd) {
      console.warn("NexNodeTreeApp: addNode - onAdd is not provided");
      return;
    }
    setIsAdding(true);
    const curRow = store.findRowFromPath(selectedPath);
    const newRow = store.getNewRowFromPath(selectedPath);

    console.log(
      `NexNodeTreeApp: addNode curRow=${JSON.stringify(curRow, null, 2)}`
    );
    console.log(
      `NexNodeTreeApp: addNode newRow=${JSON.stringify(newRow, null, 2)}`
    );
    if (newRow) {
      onAdd(0, curRow, newRow);
      console.log(`NexNodeTreeApp: addNode path=${selectedPath}`);
    }
  };

  const editNode = () => {
    console.log(`NexNodeTreeApp: editNode path=${selectedPath}`);
  };

  const removeNode = () => {
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
      >
        {/* Add & Delete & Edit */}
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button title="Add" onClick={addNode}>
            <MdAdd />
          </Button>
          <Button title="Edit" onClick={editNode}>
            <MdEdit />
          </Button>
          <Button title="Remove" onClick={removeNode}>
            <MdDelete />
          </Button>
        </ButtonGroup>
        <Stack spacing={0.5} direction="column" width="100%">
          {treeData.map((node: any, index: number) => (
            <NexNodeItem
              key={index}
              depts={0}
              node={node}
              theme={theme}
              themeUser={themeUser}
              path={node.path}
              onClick={handleClick}
              selectedPath={selectedPath}
            />
          ))}
        </Stack>
      </NexDiv>
      {isAdding && (
        <NexModalNodeEditer
          isOpen={isAdding}
          format={format}
          type="add"
          node={null}
          onSetValue={(key, value) => {}}
          onApply={() => setIsAdding(false)}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </NexApplet>
  );
});

export default NexNodeTreeApp;
