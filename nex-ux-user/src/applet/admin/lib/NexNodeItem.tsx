import { useEffect, useState } from "react";
import {
  NexButton,
  NexDiv,
  NexLabel,
} from "../../../component/base/NexBaseComponents";
import {
  MdCancel,
  MdChevronRight,
  MdClear,
  MdClose,
  MdClosedCaption,
  MdFormatClear,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineArrowLeft,
  MdOutlineDeleteForever,
} from "react-icons/md";
import { getThemeStyle, NexTheme, NexThemeUser } from "type/NexTheme";
import { NexNode, NexNodeType } from "type/NexNode";
import { Button, IconButton, Stack } from "@mui/material";
import { clamp } from "utils/util";
import { set } from "mobx";
import NexNodeTreeApp from "../NexNodeTreeApp";

interface NexNodeItemProps {
  theme?: NexTheme; // Optional theme prop, can be used for styling
  user?: NexThemeUser; // Optional theme user prop, can be used for user-specific theme settings
  depts: number;
  node: any;

  onSelect(index: number): void;
  onRemove?(index: number): void;
  selectedIndex: number; // Current index for comparison
}

const NexNodeItem: React.FC<NexNodeItemProps> = ({
  selectedIndex,
  theme,
  user,
  depts,
  node,
  onSelect,
  onRemove,
}) => {
  const [isChildOpend, setChildOpened] = useState<boolean>(false);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [isChildren, setIsChildren] = useState<boolean>(false);
  //const isFolder = node.children ? true : false;
  //const isChildren = node.children && node.children.length > 0;

  //const nodeWithoutChildren = { ...node, children: undefined };
  const caption = JSON.stringify(node, null, 2);

  const [path, setPath] = useState("");
  const [index, setIndex] = useState(-1);
  const [jsonData, setJsonData] = useState<any>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);

  const style = getThemeStyle(theme, "applet");

  const selectedColor = style.activeColor;
  const selectedBgColor = style.activeBgColor;
  /*console.log(
    "NexNodeItem: style=",
    JSON.stringify(style, null, 2),
    "selectedBgColor=",
    selectedBgColor
  );*/

  const fontSize = style.fontSize;
  const height = `calc(${fontSize} * 1.5)`;
  // 들여쓰기 크기
  const indentation = `calc(${fontSize} * 0.8 * ${depts})`;

  useEffect(() => {
    if (node && node.data) {
      setPath(node.data[1]);
      setIndex(node.data[0]);
      const objData: any = Object.values(node.data[4])[0];
      setJsonData(objData);

      const type = objData["type"] || null;

      setNodeType(type);
      setIsChildren(
        type === NexNodeType.FOLDER ||
        (type === NexNodeType.SECTION &&
          node.children &&
          node.children.length > 0)
      );
    }
  }, [node]);

  useEffect(() => {
    setSelected(selectedIndex >= 0 && selectedIndex === index);
  }, [selectedIndex]);

  //console.log("NexNodeItem: theme=", JSON.stringify(theme, null, 2));

  const handleSelect = (i: number) => {
    //console.log("handleClick: path=", curPath);

    onSelect(i);
    if (isChildren) setChildOpened(!isChildOpend);
  };

  const handleChildSelect = (i: number) => {
    onSelect(i);
  };

  return (
    <NexDiv
      direction="column"
      width="100%"
      justify="flex-start"
      align="center"

      title={caption}
    >
      <NexDiv
        direction="row"
        width="100%"
        height={height}
        align="center"
        justify="flex-start"
        cursor="pointer"
        color={isSelected || isSelected ? selectedColor : "black"}
        bgColor={isSelected ? selectedBgColor : "inherit"}
        fontWeight={isSelected || isSelected ? "bold" : "normal"}
        fontSize={fontSize}
        onClick={(e) => {
          e.preventDefault();
          handleSelect(index);
        }}
      >

        <NexDiv width="5px" height="90%" bgColor={isSelected ? selectedColor : "inherit"} style={{ borderRadius: "2px" }} />


        <NexDiv width="100%" height="100%" padding={` 0 0  0 ${indentation}`}>

          <NexDiv
            justify="center"
            align="center"
            width={fontSize}
            height="100%"
            cursor="pointer"
          >
            {isChildren && (isChildOpend ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdChevronRight size={fontSize} />
            ))}
          </NexDiv>

          <NexLabel width="100%" height="100%" style={{ paddingLeft: "2px" }}>
            {jsonData && (jsonData?.dispName || jsonData?.name || "No Name")}
          </NexLabel>

          {isSelected && onRemove && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              title="삭제"
            >
              <MdClose
                fontSize={`calc(${fontSize} * 0.8)`}
                color={selectedColor}
              />
            </IconButton>
          )}
        </NexDiv>

      </NexDiv>
      {isChildOpend && isChildren ? (
        <NexDiv direction="row" width="100%" justify="start">
          <Stack spacing={0.8} direction="column" width="100%">
            {node.children?.map((child: any, index: number) => (
              <NexNodeItem
                key={index}
                depts={depts + 1}
                node={child}
                theme={theme}
                selectedIndex={selectedIndex}
                onSelect={handleChildSelect}
                onRemove={onRemove}
              />
            ))}
          </Stack>
        </NexDiv>
      ) : null}
    </NexDiv>
  );
};

export default NexNodeItem;
