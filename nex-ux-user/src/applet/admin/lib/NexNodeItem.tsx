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
import { NexTheme, NexThemeUser } from "type/NexTheme";
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

  const color =
    depts !== 0
      ? "inherit"
      : theme?.menu?.colors[0] || theme?.default.colors[0] || "inherit";
  const bgColor =
    depts !== 0
      ? "inherit"
      : theme?.menu?.bgColors[0] || theme?.default.bgColors[0] || "#FFFFFF";

  const selectedColor = theme?.menu?.activeColors[0] || "blue";
  const selectedBgColor = theme?.menu?.activeBgColors[0] || "#444444";

  const fontLevel = (user?.fontLevel || 5) - depts; // Default font level if not provided

  const parentFontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel - 1, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  const borderFontSize = `calc(${fontSize} * 1.5)`;

  // 들여쓰기 크기
  const tabFontSize = `calc(${parentFontSize} * 1.5 * ${depts})`;
  //console.log("theme:", theme)
  //const tabSize = theme && theme.menu.tabSize ? theme.menu.tabSize : "1.5rem";

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
      bgColor={isSelected ? selectedBgColor : "inherit"}
      color={isSelected || isSelected ? selectedColor : "black"}
      fontSize={fontSize}
      title={caption}
    >
      <NexDiv
        direction="row"
        width="100%"
        height={borderFontSize}
        align="center"
        justify="flex-start"
        cursor="pointer"
        onClick={(e) => {
          e.preventDefault();
          handleSelect(index);
        }}
      >
        {isSelected ? (
          <NexDiv width="0.5rem" height="100%" bgColor={selectedColor} />
        ) : (
          <NexDiv width="0.5rem" height="100%" bgColor="inherit" />
        )}

        <span style={{ width: tabFontSize }} />
        {isChildren ? (
          <NexDiv
            justify="center"
            align="center"
            width={borderFontSize}
            height="100%"
            color={selectedColor}
            cursor="pointer"
          >
            {isChildOpend ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdChevronRight size={fontSize} />
            )}
          </NexDiv>
        ) : (
          <span style={{ width: fontSize }} />
        )}
        <NexLabel width="96%" height="100%">
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
              fontSize={`calc(${fontSize} * 0.7)`}
              color={selectedColor}
            />
          </IconButton>
        )}
      </NexDiv>
      {isChildOpend && isChildren ? (
        <NexDiv direction="row" width="100%" justify="start">
          <Stack spacing={0.5} direction="column" width="100%">
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
