import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import React, { useContext, useEffect } from "react";
//import NexAppletStoreTest from "../applet/nexAppletStoreTest";
import { getThemeStyle, NexThemeStyle } from "type/NexTheme";
import { set } from "mobx";
import { IconButton } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

interface NexPagePreviewerProps {
  isLastRoute: boolean;
  isPreview: boolean;
  path: string;
  route: string;
  section: any;
  style: NexThemeStyle;
  selectedIndex: number;
  onSelect: (path: string, index: number) => void;
  isVisibleTitle?: boolean; // Optional prop to control visibility of section title
  isVisibleBorder?: boolean; // Optional prop to control visibility of border
}

const NexPagePreviewer: React.FC<NexPagePreviewerProps> = ({
  isLastRoute,
  isPreview,
  path,
  route,
  section,
  style,
  selectedIndex,
  onSelect,
  isVisibleTitle,
  isVisibleBorder,
}) => {
  //const [route, setRoute] = React.useState<string>("");

  const [hovered, setHovered] = React.useState(false);
  const isRoutes = section && Boolean(section.isRoutes) === true;
  const isContents = section && section.contents;
  const isLastSection = section && !section.children;
  const isApplet = section && section.applet && section.applet !== "";
  const isSelected =
    section && section._record && section._index === selectedIndex;

  const gap = style.gap || "4px";
  const border = style.border || "none";
  const borderRadius = style.borderRadius || "0";
  const boxShadow = style.boxShadow || "none";
  const appletBgColor = style.bgColors[0] || "#ffffff";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];
  const activeColor1 = style.activeColors[0];
  const activeColor2 = style.activeColors[1];

  if (!section) return null;

  const sectionInfo = JSON.stringify(section.name, null, 2);

  const resizeButtones = () => {
    return (
      <>
        <style>
          {`
        .hover-controls .hover-btn {
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease-in-out;
        }
        .hover-controls:hover .hover-btn {
        opacity: 1;
        pointer-events: auto;
        }
      `}
        </style>

        {/* Up */}
        <IconButton
          aria-label="up"
          size="small"
          className="hover-btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // handle up
          }}
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          <ArrowUpward />
        </IconButton>

        {/* Down */}
        <IconButton
          aria-label="down"
          size="small"
          className="hover-btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // handle down
          }}
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          <ArrowDownward />
        </IconButton>

        {/* Left */}
        <IconButton
          aria-label="left"
          size="small"
          className="hover-btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // handle left
          }}
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          <ArrowBack />
        </IconButton>

        {/* Right */}
        <IconButton
          aria-label="right"
          size="small"
          className="hover-btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // handle right
          }}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          <ArrowForward />
        </IconButton>
      </>
    );
  };
  const lastView = isContents ? (
    <NexDiv
      width="100%"
      height="100%"
      direction="column"
      color={color}
      bgColor={bgColor}
      border={border}
      borderRadius={borderRadius}
      padding={gap}
      className="hover-controls"
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

    let curRoute = route.replace(/^\/+|\/+$/g, "").replace(/\*+$/g, "");
    console.log("NexPagePreviewer: routeView - route=", route);

    let childSection = (section.children as any[]).find((child) => {
      const childRoute = child.route
        .replace(/^\/+|\/+$/g, "")
        .replace(/\*+$/g, "");

      console.log(
        `NexPagePreviewer: routeView - curRoute=${curRoute}, childRoute=${childRoute}`
      );
      const isRouteMatch = curRoute.startsWith(childRoute);
      if (isRouteMatch) {
        curRoute = curRoute.substring(childRoute.length);
        return true;
      }
      return false;
    });

    // route 에서 childSection 의 route 를 제거 하여 나머지 경로로 다시 찾기
    // 맨 앞 뒤의 / 는 제거, 맨 마지막 * 도 제거

    //childSection = childSection || (section.children as any[])[0];
    if (!childSection) return null;
    console.log("NexPagePreviewer: routeView - childSection:", childSection);
    return (
      <NexPagePreviewer
        isLastRoute={curRoute === ""}
        isPreview={isPreview}
        path={path + "/" + childSection.name}
        route={curRoute}
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
      if (isLastRoute) return null;
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
            isLastRoute={false}
            isPreview={isPreview}
            path={path + "/" + child.name}
            route={route}
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
      color={color}
      bgColor={isSelected ? activeColor2 : hovered ? "lightblue" : "lightgray"}
      border={isSelected ? "5px solid " + activeColor2 : "none"}
      title={sectionInfo}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          height="20px"
          border={isSelected ? "none" : "1px solid white"}
          bgColor={
            isSelected ? activeColor2 : hovered ? "lightblue" : "lightgray"
          }
        >
          {" "}
          {section.dispName || section.name}
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
