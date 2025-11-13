import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import React, { useContext } from "react";
//import NexAppletStoreTest from "../applet/nexAppletStoreTest";
import { getThemeStyle, NexThemeStyle } from "type/NexTheme";
import { set } from "mobx";
import { IconButton } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

interface NexPagePreviewerProps {
  section: any;
  style: NexThemeStyle;
  onSelect?: (row: any) => void;
  isVisibleTitle?: boolean; // Optional prop to control visibility of section title
  isVisibleBorder?: boolean; // Optional prop to control visibility of border
}

const NexPagePreviewer: React.FC<NexPagePreviewerProps> = ({
  section,
  style,
  onSelect,
  isVisibleTitle,
  isVisibleBorder,
}) => {
  const [route, setRoute] = React.useState<string>("");

  const isRoutes = section && section.isRoutes === true;
  const isContents = section && section.contents;
  const isLastSection = section && !section.children;
  const isApplet = section && section.applet && section.applet !== "";
  //console.log("NexPageViewer section:", JSON.stringify(section, null, 2));

  const gap = style.gap || "4px";
  const border = style.border || "none";
  const borderRadius = style.borderRadius || "0";
  const boxShadow = style.boxShadow || "none";
  const appletBgColor = style.bgColors[0] || "#ffffff";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

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
      onClick={() => onSelect?.(section._record)}
    >
      {section.name}
      {resizeButtones()}
    </NexDiv>
  ) : (
    <NexDiv
      width="100%"
      height="100%"
      color="gray"
      onClick={() => onSelect?.(section._record)}
      style={{ position: "relative" }}
    >
      {section.name}
      {resizeButtones()}
    </NexDiv>
  );

  const routeView = () => {
    if (!Array.isArray(section.children) || section.children.length === 0)
      return null;
    let childSection = (section.children as any[]).find(
      (child) => child.route === route
    );

    childSection = childSection || (section.children as any[])[0];
    //if (!childSection) return null;
    return (
      <NexPagePreviewer
        section={childSection}
        style={style}
        isVisibleBorder={isVisibleBorder}
        isVisibleTitle={isVisibleTitle}
      />
    );
  };

  const childView = () => {
    if (isRoutes) {
      return routeView();
    }

    if (isLastSection) {
      return lastView;
    }

    if (!Array.isArray(section.children) || section.children.length === 0)
      return null;

    return (section.children as any[]).map((child, index) => {
      //console.log("NexPagePreviewer child:", JSON.stringify(child, null, 2));
      return (
        <NexPagePreviewer
          key={`${child.name}-${index}`}
          section={child}
          style={style}
          isVisibleBorder={isVisibleBorder}
          isVisibleTitle={isVisibleTitle}
        />
      );
    });
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
      bgColor={bgColor}
      title={sectionInfo}
      border={isVisibleBorder ? "1px solid #333333" : "none"}
    >
      {/* Section Name Label */}
      {isVisibleTitle ? (
        <NexDiv width="100%" height="1em">
          <NexLabel
            width="100%"
            height="100%"
            align="center"
            justify="center"
            style={{ cursor: "pointer", fontSize: "0.8em" }}
          >
            {section.name || "Unnamed Section"}
          </NexLabel>
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
