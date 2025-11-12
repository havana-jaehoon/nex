import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import React, { useContext } from "react";
//import NexAppletStoreTest from "../applet/nexAppletStoreTest";
import { getThemeStyle, NexThemeStyle } from "type/NexTheme";
import { set } from "mobx";

interface NexPagePreviewerProps {
  section: any;
  style: NexThemeStyle;
  isVisibleTitle?: boolean; // Optional prop to control visibility of section title
  isVisibleBorder?: boolean; // Optional prop to control visibility of border
}

const NexPagePreviewer: React.FC<NexPagePreviewerProps> = ({
  section,
  style,
  isVisibleTitle,
  isVisibleBorder,
}) => {
  const [route, setRoute] = React.useState<string>("");

  const isRoutes = section && section.isRoutes === true;
  const isContents = section && section.contents;
  const isApplet = section && section.applet && section.applet !== "";
  //console.log("NexPageViewer section:", JSON.stringify(section, null, 2));

  const gap = style.gap || "0";
  const border = style.border || "none";
  const borderRadius = style.borderRadius || "0";
  const boxShadow = style.boxShadow || "none";
  const appletBgColor = style.bgColors[0] || "#ffffff";

  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  if (!section) return null;
  //console.log("### NexPageViewer:", JSON.stringify(section, null, 2));

  const { children, ...sectionNoChildren } = section;
  const sectionInfo = JSON.stringify(sectionNoChildren, null, 2);

  const contentsView = (
    <NexDiv
      width='100%'
      height='100%'
      direction='column'
      color={color}
      bgColor={bgColor}
      border={border}
      borderRadius={borderRadius}
      padding={gap}
      style={{ boxSizing: "border-box", boxShadow: boxShadow }}
    ></NexDiv>
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

    if (isContents) {
      return contentsView;
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
      align='center'
      justify='center'
      width='100%'
      height='100%'
      flex={section.size || "1"}
      color={color}
      bgColor={bgColor}
      title={sectionInfo}
      border={isVisibleBorder ? "1px solid #333333" : "none"}
    >
      {/* Section Name Label */}
      {isVisibleTitle ? (
        <NexDiv width='100%' height='1em'>
          <NexLabel
            width='100%'
            height='100%'
            align='center'
            justify='center'
            style={{ cursor: "pointer", fontSize: "0.8em" }}
          >
            {section.name || "Unnamed Section"}
          </NexLabel>
        </NexDiv>
      ) : null}
      <NexDiv
        direction={section.direction || "row"}
        width='100%'
        height='100%'
        align='center'
        justify='center'
        overflow='visible'
      >
        {childView()}
      </NexDiv>
    </NexDiv>
  );
};

export default NexPagePreviewer;
