import React, { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import NexNodeItem from "./lib/NexNodeItem";

import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { clamp } from "utils/util";

const NexNodeSelctor: React.FC<NexAppProps> = observer((props) => {
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

  const color = theme?.applet?.colors[0];
  const bgColor = theme?.applet?.bgColors[0];

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (!contents || contents.length < 1)
      return "NexNodeTreeApp must be one more element.";
    return null;
  };

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const features =
    contents?.[0].store.format.features ||
    contents?.[0].store.format.children?.[0].features ||
    [];

  const nameIndex = features.findIndex((f: any) => f.name === "dispName") || 4;

  const handleClick = (storeIndex: number, itemIndex: number, node: any) => {
    if (itemIndex < 0) {
      setSelectedIndex(storeIndex, -1);
      return;
    }
    setSelectedIndex(storeIndex, itemIndex);
    onSelect?.(storeIndex, node);
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv direction="column" width="100%" height="100%">
        {contents &&
          contents.map((content: any, contentsIndex: number) => (
            <NexDiv
              key={contentsIndex}
              flex="1"
              direction="row"
              align="center"
              justify="center"
              width="100%"
              color={color}
              bgColor={bgColor}
              fontSize={fontSize}
            >
              <NexDiv flex="8" justify="end">
                <Button
                  variant="text"
                  onClick={() => handleClick(contentsIndex, -1, null)}
                  sx={{ fontWeight: "bold", fontSize: fontSize }} // 또는 숫자값 사용 가능
                >
                  {contents[contentsIndex].name + " :"}
                </Button>
              </NexDiv>
              <NexDiv flex="92">
                <Stack
                  spacing={0.5}
                  direction="row"
                  width="100%"
                  height={`calc(${fontSize} * 2)`}
                >
                  {content.csv.map((node: any, itemIndex: number) => {
                    return (
                      <Button
                        key={itemIndex}
                        variant={
                          itemIndex === selectedIndexs[contentsIndex]
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          handleClick(contentsIndex, itemIndex, node)
                        }
                      >
                        {node[nameIndex]}
                      </Button>
                    );
                  })}
                </Stack>
              </NexDiv>
            </NexDiv>
          ))}
      </NexDiv>
    </NexApplet>
  );
});

export default NexNodeSelctor;
