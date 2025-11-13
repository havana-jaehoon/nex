import { useEffect, useState } from "react";
import { NexDiv, NexLabel } from "../../../component/base/NexBaseComponents";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineArrowLeft,
} from "react-icons/md";
import { defaultThemeStyle, getThemeStyle, NexTheme } from "type/NexTheme";
import { NexMenuNode } from "./NexMenuNode";
import { NexNodeType } from "type/NexNode";
import { Stack } from "@mui/material";
import { json } from "stream/consumers";

interface NexMenuItemProps {
  theme?: NexTheme; // Optional theme prop, can be used for styling
  depts: number;
  node: any;

  onClick(route: string): void;
  selectedPath: string; // Current path for comparison
  onSelect(path: string): void; // Function to set the selected path
}

const NexMenuItem: React.FC<NexMenuItemProps> = ({
  selectedPath,
  theme,
  depts,
  node,
  onClick,
  onSelect,
}) => {
  //const { label, icon, path, children } = item;
  const [path, setPath] = useState("");
  const [index, setIndex] = useState(-1);
  const [jsonData, setJsonData] = useState<any>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);

  const [isChildOpend, setChildOpened] = useState<boolean>(false);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [isChildren, setIsChildren] = useState<boolean>(false);
  const [isSelectedRoot, setIsSelectedRoot] = useState<boolean>(false);
  const [isRoute, setIsRoute] = useState<boolean>(false);
  //const [isSelected, setSelected] = useState<boolean>(false);
  //const color = item[6];

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
          (type === NexNodeType.MENU &&
            node.children &&
            node.children.length > 0)
      );
      const bSelectedRoot =
        selectedPath.startsWith(node.data[1]) && depts === 0;
      if (bSelectedRoot) {
        setChildOpened(true);
      }

      setSelected(selectedPath === node.data[1]);
      setIsSelectedRoot(bSelectedRoot);
      setIsRoute(objData.route !== undefined && objData.route !== "");
    }
  }, [node, selectedPath]);

  const defaultStyle = getThemeStyle(theme, "default");
  //const menuStyle = getThemeStyle(theme, "menu");
  const menuStyle = getThemeStyle(theme, "applet");

  const selectedColor = menuStyle.activeColors[0];
  const selectedBgColor = depts !== 0 ? "inherit" : menuStyle.activeBgColors[0];

  const fontSizeIndex = Math.max(0, defaultStyle.fontSize.length - 3 - depts);
  const fontSize = defaultStyle.fontSize[fontSizeIndex];
  const tabSize = `calc(${fontSize} * ${depts})`;

  const handleClick = () => {
    if (isRoute) {
      onSelect(path);
      onClick(jsonData.route || "");
    }
    if (isChildren) setChildOpened(!isChildOpend);
    console.log("handleClick: route=", node.route);
  };

  const handleChildClick = (route: string) => {
    console.log("handleChildClick: route=", route);
    //onSelect && onSelect(label);

    onClick(route);
  };

  return (
    <NexDiv
      direction="column"
      width="100%"
      justify="flex-start"
      bgColor={isSelectedRoot || isChildOpend ? selectedBgColor : "inherit"}
      color={isSelectedRoot || isSelected ? selectedColor : "black"}
      fontSize={fontSize}
    >
      <NexDiv
        direction="row"
        width="100%"
        height={`calc(${fontSize} * 1.5)`}
        align="center"
        justify="flex-start"
        onClick={handleClick}
        title={jsonData?.route || ""}
      >
        {isSelected ? (
          <NexDiv width="0.5rem" height="80%" bgColor={selectedColor} />
        ) : (
          <NexDiv width="0.5rem" height="90%" bgColor="inherit" />
        )}
        <span style={{ width: tabSize }} />

        <NexLabel width="96%" height="100%">
          {jsonData?.dispName || jsonData?.name || "No Name"}
        </NexLabel>
        <NexDiv justify="end" width="2rem" height="100%" color={selectedColor}>
          {isChildren ? (
            isChildOpend ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowRight />
            )
          ) : null}
        </NexDiv>
      </NexDiv>
      {isChildOpend && isChildren ? (
        <NexDiv direction="row" width="100%">
          <Stack spacing={0.5} direction="column" width="100%">
            {node.children?.map((child: any, index: number) => (
              <NexMenuItem
                key={index}
                depts={depts + 1}
                node={child}
                theme={theme}
                onSelect={onSelect}
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

export default NexMenuItem;
