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

  const appletStyle = getThemeStyle(theme, "applet");
  const menuStyle = getThemeStyle(theme, "menu");

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

  const selectedColor = appletStyle.activeColors[0];
  const selectedBgColor = appletStyle.activeBgColors[0];

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const fontSize =
    appletStyle.fontSize[
      clamp(fontLevel - 1, 0, appletStyle.fontSize?.length - 1)
    ];

  const borderFontSize = `calc(${fontSize} * 1.5)`;

  // 들여쓰기 크기
  const tabSize = `calc(${fontSize} * ${depts})`;

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

        <span style={{ width: tabSize }} />
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
