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
import PXIcon from "icon/pxIcon";

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
  const [path, setPath] = useState("");
  const [index, setIndex] = useState(-1);
  const [jsonData, setJsonData] = useState<any>(null);
  const [nodeType, setNodeType] = useState<string | null>(null);

  const [isChildOpened, setChildOpened] = useState<boolean>(false);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [isChildren, setIsChildren] = useState<boolean>(false);
  const [isSelectedRoot, setIsSelectedRoot] = useState<boolean>(false);
  const [isRoute, setIsRoute] = useState<boolean>(false);

  useEffect(() => {
    const record = node.data || node._record;
    if (node && record) {
      setPath(record[1]);
      setIndex(record[0]);
      const objData: any = Object.values(record[4])[0];
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
        selectedPath.startsWith(record[1]) && depts === 0;
      if (bSelectedRoot) {
        setChildOpened(true);
      }

      setSelected(selectedPath === record[1]);
      setIsSelectedRoot(bSelectedRoot);
      setIsRoute(objData.route !== undefined && objData.route !== "");
    }
  }, [node, selectedPath]);

  const defaultStyle = getThemeStyle(theme, "default");
  const menuStyle = getThemeStyle(theme, "menu");

  const selectedColor = menuStyle.activeColor;
  const selectedBgColor = depts !== 0 ? "inherit" : menuStyle.activeBgColor;

  const fontSize = depts === 0 ? `calc(${menuStyle.fontSize} * 1.1)` : menuStyle.fontSize;
  const iconSize = `calc(${fontSize} * 1)`;
  const height = `calc(${fontSize} * 1.8)`;


  // Calculate indentation
  const indentation = `calc(${depts} * 1.0rem)`; // Adjust multiplier as needed

  const handleClick = () => {
    if (isRoute) {
      onSelect(path);
      onClick(jsonData.route || "");
    }
    if (isChildren) setChildOpened(!isChildOpened);
    //console.log("handleClick: route=", node.route);
  };

  const handleChildClick = (route: string) => {
    //console.log("handleChildClick: route=", route);
    onClick(route);
  };

  return (
    <NexDiv
      direction="column"
      width="100%"
      justify="flex-start"
      bgColor={isSelectedRoot || isChildOpened ? selectedBgColor : "inherit"}
      color={isSelectedRoot || isSelected ? selectedColor : "black"}
      fontSize={fontSize}
    >
      <NexDiv
        direction="row"
        width="100%"
        height={height} // Increased height for better touch target
        align="center"
        justify="flex-start"
        onClick={handleClick}
        title={jsonData?.route || ""}
        style={{
          cursor: "pointer",
          paddingLeft: indentation,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ width: "100%", height: "inherit" }}>
          {/* Selection Indicator */}
          <NexDiv width="6px" height="70%" bgColor={isSelected ? selectedColor : "transparent"} style={{ marginRight: "0.5rem", borderRadius: "2px" }} />

          {/* Icon */}
          {jsonData && jsonData.icon && jsonData.icon !== "" && (
            <PXIcon
              path={jsonData?.icon || ""}
              width={iconSize}
              height={iconSize}
            />
          )}

          {/* Label */}
          <NexLabel align="center" width="auto" height="100%" style={{ fontWeight: isSelectedRoot || isSelected ? "bold" : "normal", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {jsonData?.dispName || jsonData?.name || ""}
          </NexLabel>

          {/* Expand/Collapse Icon */}
          <NexDiv justify="center" align="center" width={fontSize} height="100%" color={selectedColor}>
            {isChildren ? (
              isChildOpened ? (
                <MdKeyboardArrowDown size={height} />
              ) : (
                <MdKeyboardArrowRight size={height} />
              )
            ) : null}
          </NexDiv>
        </Stack>
      </NexDiv >

      {/* Children */}
      {
        isChildOpened && isChildren ? (
          <NexDiv direction="row" width="100%">
            <Stack spacing={1} direction="column" width="100%">
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
        ) : null
      }
    </NexDiv >
  );
};

export default NexMenuItem;
