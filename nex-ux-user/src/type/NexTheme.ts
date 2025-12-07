export interface NexThemeStyle {
  name: string;
  color: string; // 여러 색상을 지원하기 위해 배열로 변경
  bgColor: string; // 배경색, 여러 색상을 지원하기 위해 배열로 변경
  activeColor: string; // 활성화 색상, 여러 색상을 지원하기 위해 배열로 변경
  activeBgColor: string; // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
  hoverColor: string; // 호버 색상, 여러 색상을 지원하기 위해 배열로 변경
  hoverBgColor: string; // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

  bdColor: string; // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경

  fontFamily: string;
  fontSize: string; //0~N levels of font size

  boxShadow?: string;
  borderRadius?: string;
  border?: string; // 테두리 스타일
  gap?: string; // 영역간 간격 내부적으로  padding 으로 조절함
  padding?: string; // 영역 내에서 의 패딩 값
  margin?: string;

  disabledBackgroundColor?: string;
  disabledColor?: string;
  disabledBgColor?: string; // 여러 색상을 지원하기 위해 배열로 변경
  disabledBdColor?: string;
  disabledBoxShadow?: string;
  focusBdColor?: string; // 포커스 시 테두리(Border) 색상
  focusBoxShadow?: string;
}

export const getThemeStyle = (
  theme: NexTheme | null | undefined,
  themeName: string
): NexThemeStyle => {
  return theme?.find((t) => t.name === themeName) ?? defaultThemeStyle;
};

export type NexTheme = NexThemeStyle[];

export interface NexThemeUser {
  id: string; // User ID associated with the theme
  theme: string; // The theme Name from NexTheme
  fontLevel: number; // Font size level for the user, default is 5 (0~9)
}

export const defaultThemeUser: NexThemeUser = {
  id: "default",
  theme: "default",
  fontLevel: 5, // Default font level
};

export const defaultThemeStyle: NexThemeStyle = {
  name: "default",
  color: "#393c45",
  bgColor: "#eeeeee",
  bdColor: "#cccccc", // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
  activeColor: "#393c45",
  activeBgColor: "#e8edf7", // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
  hoverColor: "#393c45",
  hoverBgColor: "#e8edf7", // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경
  fontFamily: "Pretendard, Arial, sans-serif",
  gap: "2rem",
  padding: "0.2rem",
  fontSize: "1rem",
};

export const defaultTheme: NexTheme = [
  defaultThemeStyle,
  {
    name: "applet",
    color: "#393c45",
    bgColor: "#e8edf7",
    bdColor: "#cccccc", // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColor: "#393c45",
    activeBgColor: "#e8edf7", // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColor: "#393c45",
    hoverBgColor: "#e8edf7", // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Pretendard, Arial, sans-serif",
    borderRadius: "0.5rem", // all | top right bottom left
    padding: "0rem", // all | top right bottom left
    gap: "0rem",
    fontSize: "1rem",
  },
  {
    name: "button",
    color: "#393c45",
    bgColor: "#e8edf7",
    bdColor: "#cccccc", // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColor: "#393c45",
    activeBgColor: "#e8edf7", // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColor: "#393c45",
    hoverBgColor: "#e8edf7", // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Pretendard, Arial, sans-serif",
    fontSize: "1rem",
    borderRadius: "4px",
  },
];

//대비 컬러 계산 함수
export const contrastColor = (hex: string | null): string => {
  if (!hex || hex === "none") {
    return "#000000"; // 기본값으로 검정색 반환
  }
  const hexColor = hex.replace("#", "");
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  // Luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.8 ? "#222222" : "#FFFFFF"; // 밝은 배경에는 어두운 글씨, 어두운 배경에는 밝은 글씨
};
