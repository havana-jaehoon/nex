import { Box } from "@mui/material";
import { ReactComponent as PIconApplet } from "assets/svgs/config/applet.svg";
import { ReactComponent as PIconContents } from "assets/svgs/config/contents.svg";
import { ReactComponent as PIconElement } from "assets/svgs/config/element.svg";
import { ReactComponent as PIconNewFolder } from "assets/svgs/config/new-folder.svg";
import { ReactComponent as PIconNewEntity } from "assets/svgs/config/new-entity.svg";
import { ReactComponent as PIconFormat } from "assets/svgs/config/format.svg";
import { ReactComponent as PIconProcessor } from "assets/svgs/config/processor.svg";
import { ReactComponent as PIconStorage } from "assets/svgs/config/storage.svg";
import { ReactComponent as PIconStore } from "assets/svgs/config/store.svg";
import { ReactComponent as PIconSystem } from "assets/svgs/config/system.svg";
import { ReactComponent as PIconMenu } from "assets/svgs/config/menu.svg";
import { ReactComponent as PIconTheme } from "assets/svgs/config/theme.svg";
import { ReactComponent as PIconUser } from "assets/svgs/config/user.svg";
import { ReactComponent as PIconSection } from "assets/svgs/config/section.svg";

import { ReactComponent as PIconCbmBarChart } from "assets/svgs/cbm/icon-bar-chart.svg";
import { ReactComponent as PIconCbmDashboardList } from "assets/svgs/cbm/icon-dashboard-list.svg";
import { ReactComponent as PIconCbmDashboard } from "assets/svgs/cbm/icon-dashboard.svg";
import { ReactComponent as PIconCbmDeviceInfo } from "assets/svgs/cbm/icon-device-info.svg";
import { ReactComponent as PIconCbmDownload } from "assets/svgs/cbm/icon-download.svg";
import { ReactComponent as PIconCbmGaugeBar } from "assets/svgs/cbm/icon-gauge-bar.svg";
import { ReactComponent as PIconCbmLineChart } from "assets/svgs/cbm/icon-line-chart.svg";
import { ReactComponent as PIconCbmList } from "assets/svgs/cbm/icon-list.svg";
import { ReactComponent as PIconCbmMaintenance } from "assets/svgs/cbm/icon-maintenance.svg";
import { ReactComponent as PIconCbmRemoveCircle } from "assets/svgs/cbm/icon-remove-circle.svg";
import { ReactComponent as PIconCbmSettings } from "assets/svgs/cbm/icon-settings.svg";
import { ReactComponent as PIconCbmTable } from "assets/svgs/cbm/icon-table.svg";
import { ReactComponent as PIconCbmTrain } from "assets/svgs/cbm/icon-train.svg";
import { ReactComponent as PIconCbmTreeCarriage } from "assets/svgs/cbm/icon-tree-carriage.svg";
import { ReactComponent as PIconCbmTreeDeviceType } from "assets/svgs/cbm/icon-tree-device-type.svg";
import { ReactComponent as PIconCbmTreeFormation } from "assets/svgs/cbm/icon-tree-formation.svg";
import { ReactComponent as PIconCbmTreeLine } from "assets/svgs/cbm/icon-tree-line.svg";
import { ReactComponent as PIconCbmLogoKorail } from "assets/svgs/cbm/logo-korail.svg";

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
  cbm: {
    "bar-chart": { name: "bar-chart", dispName: "막대 차트", icon: PIconCbmBarChart },
    "dashboard-list": { name: "dashboard-list", dispName: "대시보드 목록", icon: PIconCbmDashboardList },
    dashboard: { name: "dashboard", dispName: "대시보드", icon: PIconCbmDashboard },
    "device-info": { name: "device-info", dispName: "장치 정보", icon: PIconCbmDeviceInfo },
    download: { name: "download", dispName: "다운로드", icon: PIconCbmDownload },
    "gauge-bar": { name: "gauge-bar", dispName: "게이지 바", icon: PIconCbmGaugeBar },
    "line-chart": { name: "line-chart", dispName: "라인 차트", icon: PIconCbmLineChart },
    list: { name: "list", dispName: "목록", icon: PIconCbmList },
    maintenance: { name: "maintenance", dispName: "유지보수", icon: PIconCbmMaintenance },
    "remove-circle": { name: "remove-circle", dispName: "삭제", icon: PIconCbmRemoveCircle },
    settings: { name: "settings", dispName: "설정", icon: PIconCbmSettings },
    table: { name: "table", dispName: "테이블", icon: PIconCbmTable },
    train: { name: "train", dispName: "열차", icon: PIconCbmTrain },
    "tree-carriage": { name: "tree-carriage", dispName: "트리-객차", icon: PIconCbmTreeCarriage },
    "tree-device-type": { name: "tree-device-type", dispName: "트리-장치유형", icon: PIconCbmTreeDeviceType },
    "tree-formation": { name: "tree-formation", dispName: "트리-편성", icon: PIconCbmTreeFormation },
    "tree-line": { name: "tree-line", dispName: "트리-노선", icon: PIconCbmTreeLine },
    "logo-korail": { name: "logo-korail", dispName: "코레일 로고", icon: PIconCbmLogoKorail },
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
  name: key,
  dispName: pxIconMap[key].dispName,
  helper: `${pxIconMap[key].dispName}(${key})`,
}));

export const pxIconList = [
  {
    path: "",
    name: "",
    dispName: "없음",
    helper: "None",
  },
  ...iconList,
];

interface PXIconProps extends React.SVGProps<SVGSVGElement> {
  path: string;
}



const PXIcon: React.FC<PXIconProps> = ({ path, color, style, ...svgProps }) => {
  const IconComponent = pxIconMap[path]?.icon;
  if (!IconComponent) {
    return null;
  }
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        "& svg": {
          fill: "currentColor",
        },
        "& path": {
          fill: "currentColor !important",
        },
        ...style,
      }}
    >
      <IconComponent {...svgProps} />
    </Box>
  );
};

export default PXIcon;
