import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import React, { useContext, useEffect } from "react";
//import NexAppletStoreTest from "../applet/nexAppletStoreTest";
import { getThemeStyle, NexThemeStyle } from "type/NexTheme";
import { set } from "mobx";
import { Icon, IconButton } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { MdCancel, MdRemove } from "react-icons/md";

interface NexPagePreviewerProps {
  isPreview: boolean;
  path: string;
  selectedRoute: string;
  route: string;
  section: any;
  style: NexThemeStyle;
  selectedIndex: number;
  onSelect: (path: string, index: number) => void;
  onRemove?: (index: number) => void;
  isVisibleTitle?: boolean; // Optional prop to control visibility of section title
  isVisibleBorder?: boolean; // Optional prop to control visibility of border
}

const NexPagePreviewer: React.FC<NexPagePreviewerProps> = ({
  isPreview,
  path,
  selectedRoute,
  route,
  section,
  style,
  selectedIndex,
  onSelect,
  onRemove,
  isVisibleTitle,
  isVisibleBorder,
}) => {
  //const [route, setRoute] = React.useState<string>("");

  const [hovered, setHovered] = React.useState(false);
  const isRoutes = section && Boolean(section.isRoutes) === true;
  //const isContents = section && section.applet !== undefined && section.applet !== "";
  // && section.contents && isCon;
  const isLastSection = section && !section.children;
  const isApplet = section && section.applet && section.applet !== "";
  const isSelected =
    section && section._record && section._index === selectedIndex;

  const gap = style.gap || "4px";
  const border = style.border || "none";
  const borderRadius = style.borderRadius || "0";
  const boxShadow = style.boxShadow || "none";


  const color = style.color;
  const bgColor = style.bgColor;
  const activeColor = style.activeColor;

  const fontSize = style.fontSize || "1rem";
  const height = `calc(${fontSize} * 1.5)`;

  if (!section) return null;

  const sectionInfo = JSON.stringify(section.name, null, 2);

  const lastView = isApplet ? (
    <NexDiv
      width="100%"
      height="100%"
      direction="column"
      bgColor={"#e7f5ff"}
      border={border}
      borderRadius={borderRadius}
      padding={gap}
      style={{
        boxSizing: "border-box",
        boxShadow: boxShadow,
        position: "relative",
      }}
    >
      {section.dispName || section.name}
      {/*resizeButtones()*/}
    </NexDiv>
  ) : (
    <NexDiv
      width="100%"
      height="100%"
      color="gray"
      style={{ position: "relative" }}
    >
      {section.dispName || section.name}
      {/*resizeButtones()*/}
    </NexDiv>
  );

  const routeView = () => {
    if (!Array.isArray(section.children) || section.children.length === 0)
      return null;

    let childSection = (section.children as any[]).find((child) => {
      const childRoute = `${route}/${child.route}`;

      const clean = (p: string) =>
        (p || "")
          .replace(/\/+$/g, "") // remove trailing slashes
          .replace(/\/\*$/g, ""); // remove trailing /*
      const sr = clean(selectedRoute);
      const cr = clean(childRoute);
      const isRouteMatch = sr === cr || sr.startsWith(cr + "/");
      if (isRouteMatch) {
        return true;
      }
      return false;
    });

    // route 에서 childSection 의 route 를 제거 하여 나머지 경로로 다시 찾기
    // 맨 앞 뒤의 / 는 제거, 맨 마지막 * 도 제거

    if (!childSection) return null;
    //console.log("NexPagePreviewer: routeView - childSection:", childSection);
    return (
      <NexPagePreviewer
        isPreview={isPreview}
        path={path + "/" + childSection.name}
        selectedRoute={selectedRoute}
        route={`${route}/${childSection.route}`}
        section={childSection}
        selectedIndex={selectedIndex}
        style={style}
        isVisibleBorder={isVisibleBorder}
        isVisibleTitle={isVisibleTitle}
        onSelect={onSelect}
      />
    );
  };

  const childView = () => {
    if (isRoutes) {
      return routeView();
    } else {
      if (isLastSection) {
        return lastView;
      }

      if (!Array.isArray(section.children) || section.children.length === 0)
        return null;

      return (section.children as any[]).map((child, index) => {
        //console.log("NexPagePreviewer child:", JSON.stringify(child, null, 2));
        return (
          <NexPagePreviewer
            isPreview={isPreview}
            path={path + "/" + child.name}
            route={
              child.route && child.route !== ""
                ? `${route}/${child.route}`
                : route
            }
            selectedRoute={selectedRoute}
            key={`${child.name}-${index}`}
            section={child}
            selectedIndex={selectedIndex}
            style={style}
            isVisibleBorder={isVisibleBorder}
            isVisibleTitle={isVisibleTitle}
            onSelect={onSelect}
          />
        );
      });
    }
  };

  return (
    <NexDiv
      direction={"column"}
      align="center"
      justify="center"
      width="100%"
      height="100%"
      flex={section.size || "1"}
      color={isSelected ? activeColor : color}
      bgColor={bgColor}
      fontWeight={isSelected ? "bold" : "normal"}
      fontSize={fontSize}
      border={
        isSelected
          ? "3px solid " + activeColor
          : hovered
            ? "1px solid lightblue"
            : "1px solid lightgray"
      }
      title={sectionInfo}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        console.log(
          "NexPagePreviewer: onClick - path=",
          path,
          " section=",
          section._record
        );
        //return true;
        onSelect?.(path, section._index);
      }}
    >
      {/* Section Name Label */}
      {!isPreview && !isLastSection ? (
        <NexDiv
          width="100%"
          height="1.5rem"
          align="center"
          justify="center"
        >
          {section.dispName || section.name}\
        </NexDiv>
      ) : null}
      <NexDiv
        direction={section.direction || "row"}
        width="100%"
        height="100%"
        align="center"
        justify="center"
        overflow="visible"
      >
        {childView()}
      </NexDiv>
    </NexDiv>
  );
};

export default NexPagePreviewer;
