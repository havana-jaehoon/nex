import { useEffect, useState } from "react";
import { NexDiv, NexLabel } from "../../../component/base/NexBaseComponents";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineArrowLeft,
} from "react-icons/md";
import { NexTheme, NexThemeUser } from "type/NexTheme";
import { NexNode } from "type/NexNode";
import { Stack } from "@mui/material";
import { clamp } from "utils/util";

interface NexNodeItemProps {
  theme?: NexTheme; // Optional theme prop, can be used for styling
  user?: NexThemeUser; // Optional theme user prop, can be used for user-specific theme settings
  depts: number;
  path: string; // Optional path prop, can be used for routing
  node: any;

  onClick(path: string): void;
  selectedPath: string; // Current path for comparison
}

const NexNodeItem: React.FC<NexNodeItemProps> = ({
  path,
  selectedPath,
  theme,
  user,
  depts,
  node,
  onClick,
}) => {
  const [isChildOpend, setChildOpened] = useState<boolean>(false);

  const isFolder = node.children || node.type === "folder" ? true : false; //node.type === "folder" ;
  const isChildren = node.children && node.children.length > 0;

  //const curPath = path === "/" ? `/${node.name}` : `${path}/${node.name}`;
  const isSelectedRoot = selectedPath?.startsWith(path) && depts === 0;
  const isSelected = selectedPath === path;

  //const nodeWithoutChildren = { ...node, children: undefined };
  const caption = JSON.stringify(node.data, null, 2);
  /*
  useEffect(() => {
    if (!isSelectedRoot) {
      setChildOpened(false);
    }
  }, [isSelectedRoot]);
*/
  const color =
    depts !== 0
      ? "inherit"
      : theme?.menu?.colors[0] || theme?.default.colors[0] || "inherit";
  const bgColor =
    depts !== 0
      ? "inherit"
      : theme?.menu?.bgColors[0] || theme?.default.bgColors[0] || "#FFFFFF";

  const selectedColor = theme?.menu?.activeColors[0] || "blue";
  const selectedBgColor =
    depts !== 0 ? "inherit" : theme?.menu?.activeBgColors[0] || "#444444";

  const fontLevel = (user?.fontLevel || 5) - depts; // Default font level if not provided

  const fontSize =
    theme?.applet?.fontSize[
      clamp(fontLevel, 0, theme.applet?.fontSize?.length - 1)
    ] || "1rem";

  //console.log("theme:", theme)
  //const tabSize = theme && theme.menu.tabSize ? theme.menu.tabSize : "1.5rem";

  const handleClick = () => {
    //if (e) e.stopPropagation();
    //console.log("handleClick: path=", curPath);

    onClick(path);
    if (isFolder) setChildOpened(!isChildOpend);
  };

  const handleChildClick = (childPath: string) => {
    //if (e) e.stopPropagation();
    //console.log("handleChildClick: node=", childPath);
    onClick(childPath);
  };

  return (
    <NexDiv
      direction="column"
      width="100%"
      justify="flex-start"
      bgColor={isSelectedRoot ? selectedBgColor : "inherit"}
      color={isSelectedRoot || isSelected ? selectedColor : "black"}
      fontSize={fontSize}
      title={caption}
    >
      <NexDiv
        direction="row"
        width="100%"
        height={`calc(${fontSize} * 1.5)`}
        align="center"
        justify="flex-start"
        cursor="pointer"
        onClick={handleClick}
      >
        {isSelected ? (
          <NexDiv width="0.5rem" height="100%" bgColor={selectedColor} />
        ) : (
          <NexDiv width="0.5rem" height="100%" bgColor="inherit" />
        )}

        <span style={{ width: `calc(${fontSize} * ${depts})` }} />
        <NexLabel width="1rem" height="100%"></NexLabel>

        <NexLabel width="96%" height="100%">
          {node.data.dispName || node.data.name}
        </NexLabel>
        <NexDiv
          justify="end"
          width="2rem"
          height="100%"
          color={selectedColor}
          cursor="pointer"
        >
          {isFolder ? (
            isChildOpend ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowRight />
            )
          ) : null}
        </NexDiv>
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
                path={child.path}
                selectedPath={selectedPath}
                onClick={handleChildClick}
              />
            ))}
          </Stack>
        </NexDiv>
      ) : null}
    </NexDiv>
  );
};

export default NexNodeItem;
