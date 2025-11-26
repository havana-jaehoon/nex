import { ReactComponent as PIconApplet } from "icon/svg/config/applet.svg";
import { ReactComponent as PIconContents } from "icon/svg/config/contents.svg";
import { ReactComponent as PIconElement } from "icon/svg/config/element.svg";
import { ReactComponent as PIconNewFolder } from "icon/svg/config/new-folder.svg";
import { ReactComponent as PIconNewEntity } from "icon/svg/config/new-entity.svg";
import { ReactComponent as PIconFormat } from "icon/svg/config/format.svg";
import { ReactComponent as PIconProcessor } from "icon/svg/config/processor.svg";
import { ReactComponent as PIconStorage } from "icon/svg/config/storage.svg";
import { ReactComponent as PIconStore } from "icon/svg/config/store.svg";
import { ReactComponent as PIconSystem } from "icon/svg/config/system.svg";
import { ReactComponent as PIconMenu } from "icon/svg/config/menu.svg";
import { ReactComponent as PIconTheme } from "icon/svg/config/theme.svg";
import { ReactComponent as PIconUser } from "icon/svg/config/user.svg";
import { ReactComponent as PIconSection } from "icon/svg/config/section.svg";
import { NexDiv } from "component/base/NexBaseComponents";

const pxIcons: any = {
  config: {
    applet: { name: "applet", dispName: "애플릿", icon: PIconApplet },
    contents: { name: "contents", dispName: "콘텐츠", icon: PIconContents },
    element: { name: "element", dispName: "엘리먼트", icon: PIconElement },
    "new-folder": {
      name: "new-folder",
      dispName: "새 폴더",
      icon: PIconNewFolder,
    },
    "new-entity": {
      name: "new-entity",
      dispName: "새 엔티티",
      icon: PIconNewEntity,
    },
    format: { name: "format", dispName: "포맷", icon: PIconFormat },
    processor: {
      name: "processor",
      dispName: "프로세서",
      icon: PIconProcessor,
    },
    storage: { name: "storage", dispName: "스토리지", icon: PIconStorage },
    store: { name: "store", dispName: "저장정책", icon: PIconStore },
    system: { name: "system", dispName: "시스템", icon: PIconSystem },
    menu: { name: "menu", dispName: "메뉴", icon: PIconMenu },
    theme: { name: "theme", dispName: "테마", icon: PIconTheme },
    user: { name: "user", dispName: "사용자", icon: PIconUser },
    section: { name: "section", dispName: "섹션", icon: PIconSection },
  },
};

// pxIcons 를
// pxIconMap 으로 변환
// { "/config/applet" : { name: "applet", dispName: "애플릿", icon: PIconApplet }, ... }
export const pxIconMap: Record<
  string,
  {
    name: string;
    dispName: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = Object.keys(pxIcons).reduce(
  (
    acc: Record<
      string,
      {
        name: string;
        dispName: string;
        icon: React.FC<React.SVGProps<SVGSVGElement>>;
      }
    >,
    category
  ) => {
    const items = pxIcons[category];
    Object.keys(items).forEach((itemKey) => {
      const path = `/${category}/${itemKey}`;
      acc[path] = items[itemKey];
    });
    return acc;
  },
  {}
);

const iconList: any[] = Object.keys(pxIconMap).map((key) => ({
  path: key,
  name: pxIconMap[key].name,
  dispName: pxIconMap[key].dispName,
  helper: `${pxIconMap[key].dispName}(${key})`,
}));

export const pxIconList: any[] = [
  {
    path: "",
    name: "none",
    dispName: "없음",
    helper: "없음",
  },
  ...iconList,
];

interface PXIconProps extends React.SVGProps<SVGSVGElement> {
  path: string;
}

const PXIcon: React.FC<PXIconProps> = ({ path, ...svgProps }) => {
  const IconComponent = pxIconMap[path]?.icon;
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...svgProps} />;
};

export default PXIcon;
