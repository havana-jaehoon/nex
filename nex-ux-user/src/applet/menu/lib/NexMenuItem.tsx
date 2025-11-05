import { useEffect, useState } from "react";
import { NexDiv, NexLabel } from "../../../component/base/NexBaseComponents";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdOutlineArrowLeft,
} from "react-icons/md";
import { defaultThemeStyle, getThemeStyle, NexTheme } from "type/NexTheme";
import { NexMenuNode } from "./NexMenuNode";

interface NexMenuItemProps {
  theme?: NexTheme; // Optional theme prop, can be used for styling
  depts: number;
  path: string; // Optional path prop, can be used for routing
  node: NexMenuNode;

  onClick(route: string): void;
  selectedPath: string; // Current path for comparison
  onSelect(path: string): void; // Function to set the selected path
}

const NexMenuItem: React.FC<NexMenuItemProps> = ({
  path,
  selectedPath,
  theme,
  depts,
  node,
  onClick,
  onSelect,
}) => {
  //const { label, icon, path, children } = item;
  const [isChildOpend, setChildOpened] = useState<boolean>(false);
  //const [isSelected, setSelected] = useState<boolean>(false);
  //const color = item[6];

  const isFolder = node.type === "folder";

  //const children: any[] | null = item[3];
  const isChildren = node.children && node.children.length > 0;

  const isSelectedRoot = selectedPath.startsWith(path) && depts === 0;
  //const isSelectedRouteRoot = isSelectedRoot && path !== selectedPath;
  const isRoute = node.route !== undefined && node.route !== "";
  const isSelected = isRoute && selectedPath === path;

  useEffect(() => {
    if (!isSelectedRoot) {
      setChildOpened(false);
    }
  }, [isSelectedRoot]);



  const defaultStyle = getThemeStyle(theme, "default");
  const menuStyle = getThemeStyle(theme, "menu");

  const selectedColor = menuStyle.activeColors[0];
  const selectedBgColor = depts !== 0 ? "inherit" : menuStyle.activeBgColors[0];

  const fontSizeIndex = Math.max(0, defaultStyle.fontSize.length - 3 - depts);
  const fontSize = defaultStyle.fontSize[fontSizeIndex];

  
  const handleClick = () => {
    if (isRoute) {
      onSelect(path);
      onClick(node.route || "");
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
        title={node.route || ""}
      >
        {isSelectedRoot ? (
          <NexDiv width="0.5rem" height="100%" bgColor={selectedColor} />
        ) : (
          <NexDiv width="0.5rem" height="100%" bgColor="inherit" />
        )}
        <NexLabel width="1rem" height="100%"></NexLabel>

        <NexLabel width="96%" height="100%">
          {node.dispName || node.name}
        </NexLabel>
        <NexDiv justify="end" width="2rem" height="100%" color={selectedColor}>
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
          <NexDiv
            direction="column"
            width={fontSize}
            height="100%"
            align="center"
            justify="center"
          ></NexDiv>
          <NexDiv direction="column" width="100%" height="100%">
            {node.children?.map((child, index) => (
              <NexMenuItem
                key={index}
                depts={depts + 1}
                node={child}
                theme={theme}
                path={path + "/" + child.name}
                onSelect={onSelect}
                selectedPath={selectedPath}
                onClick={handleChildClick}
              />
            ))}
          </NexDiv>
        </NexDiv>
      ) : null}
    </NexDiv>
  );
};

export default NexMenuItem;
