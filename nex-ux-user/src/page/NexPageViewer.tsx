import React, { useContext } from "react";
import { NexDiv, NexLabel } from "../component/base/NexBaseComponents";
//import NexAppletStoreTest from "../applet/nexAppletStoreTest";
import { Route, Routes } from "react-router-dom";
import { NexStoreContext } from "provider/NexStoreProvider";
import NexAppProvider from "applet/NexAppProvider";
import { defaultThemeStyle } from "type/NexTheme";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// 스와이퍼 CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface NexPageViewerProps {
  section: any;
  isVisibleTitle?: boolean; // Optional prop to control visibility of section title
  isVisibleBorder?: boolean; // Optional prop to control visibility of border
}

const NexPageViewer: React.FC<NexPageViewerProps> = ({
  section,
  isVisibleTitle,
  isVisibleBorder,
}) => {
  const context = useContext(NexStoreContext);
  const { theme } = context;

  const isRoutes = section && section.isRoutes === true;
  const isContents = section && section.contents;
  //console.log("NexPageViewer section:", JSON.stringify(section, null, 2));

  const style = theme?.default || defaultThemeStyle;
  const color = style.colors[0];
  const bgColor = style.bgColors[0];

  if (!section) return null;
  //console.log("### NexPageViewer:", JSON.stringify(section, null, 2));

  const { children, ...sectionNoChildren } = section;
  const sectionInfo = JSON.stringify(sectionNoChildren, null, 2);

  const contentsView = isContents && (
    <NexDiv width='100%' height='100%' direction='column'>
      <NexAppProvider section={section} context={context} />
    </NexDiv>
  );

  const sliderSettings = {
    className: "",
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const pageView = isRoutes && (
    <Routes>
      {section.children && Array.isArray(section.children)
        ? (section.children as any[]).map((child, index) => (
            <Route
              key={index}
              path={
                child.route && child.route !== ""
                  ? child.route
                  : `${child.name}`
              }
              element={
                <NexPageViewer
                  key={index}
                  section={child}
                  isVisibleBorder={isVisibleBorder}
                  isVisibleTitle={isVisibleTitle}
                />
              }
            />
          ))
        : null}
    </Routes>
  );

  const pageView2 = isRoutes && (
    <Swiper style={{ width: "90%", height: "90%" }}>
      {section.children && Array.isArray(section.children) ? (
        <SwiperSlide>
          {(section.children as any[]).map((child, index) => (
            <NexPageViewer
              key={index}
              section={child}
              isVisibleBorder={isVisibleBorder}
              isVisibleTitle={isVisibleTitle}
            />
          ))}
        </SwiperSlide>
      ) : null}
    </Swiper>
  );

  const childView =
    !isContents &&
    !isRoutes &&
    section.children &&
    Array.isArray(section.children) &&
    (section.children as any[]).map((child, index) => (
      <NexPageViewer
        key={`${child.name}-${index}`}
        section={child}
        isVisibleBorder={isVisibleBorder}
        isVisibleTitle={isVisibleTitle}
      />
    ));

  return (
    <NexDiv
      direction={"column"}
      align='center'
      justify='center'
      width='100%'
      height='100%'
      flex={section.size || "1"}
      overflow='auto'
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
        {contentsView}
        {pageView}

        {childView}
      </NexDiv>
    </NexDiv>
  );
};

export default NexPageViewer;
