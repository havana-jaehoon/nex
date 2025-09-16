export interface NexThemeStyle {
  colors: string[]; // 여러 색상을 지원하기 위해 배열로 변경
  bgColors: string[]; // 배경색, 여러 색상을 지원하기 위해 배열로 변경
  activeColors: string[]; // 활성화 색상, 여러 색상을 지원하기 위해 배열로 변경
  activeBgColors: string[]; // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
  hoverColors: string[]; // 호버 색상, 여러 색상을 지원하기 위해 배열로 변경
  hoverBgColors: string[]; // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

  bdColors: string[]; // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경

  fontFamily: string;
  fontSize: string[]; //0~N levels of font size

  boxShadow?: string;
  borderRadius?: string;
  gap?: string; // 영역간 간격 내부적으로  padding 으로 조절함
  padding?: string; // 영역 내에서 의 패딩 값
  margin?: string;

  disabledBackgroundColor?: string;
  disabledColor?: string[];
  disabledBgColors?: string[]; // 여러 색상을 지원하기 위해 배열로 변경
  disabledBdColor?: string[];
  disabledBoxShadow?: string;
  focusBdColor?: string; // 포커스 시 테두리(Border) 색상
  focusBoxShadow?: string;
}

export interface NexTheme {
  default: NexThemeStyle;
  applet?: NexThemeStyle; // Optional applet style, can be used for specific applet themes
  button?: NexThemeStyle;
  input?: NexThemeStyle;
  menu?: NexThemeStyle;
  table?: NexThemeStyle;
  chart?: NexThemeStyle;
}

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
  colors: ["#393c45", "#03dac6"],
  bgColors: ["#eeeeee", "#e8edf7"],
  bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
  activeColors: ["#393c45", "#045bac"],
  activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
  hoverColors: ["#393c45", "#045bac"],
  hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경
  fontFamily: "Arial, sans-serif",
  gap: "1rem",
  padding: "0.2rem",
  fontSize: [
    "0.5rem",
    "0.6rem",
    "0.7rem",
    "0.8rem",
    "0.9rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "1.75rem",
    "2rem",
  ], // 0~N levels of font size
};

export const defaultTheme: NexTheme = {
  default: defaultThemeStyle,
  applet: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#393c45", "#045bac"],
    activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    borderRadius: "0.5rem", // all | top right bottom left
    padding: "0rem", // all | top right bottom left
    gap: "0rem",
    fontSize: [
      "0.5rem",
      "0.6rem",
      "0.7rem",
      "0.8rem",
      "0.9rem",
      "1rem",
      "1.25rem",
      "1.5rem",
      "1.75rem",
      "2rem",
    ], // 0~N levels of font size
  },
  button: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#393c45", "#045bac"],
    activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    fontSize: ["1.5rem", "1.25rem", "1rem", "0.875rem"], // 0~N levels of font size
    borderRadius: "4px",
  },
  input: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#393c45", "#045bac"],
    activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    fontSize: ["1.25rem", "1rem", "0.875rem", "0.8rem"], // 0~N levels of font size
    borderRadius: "4px",
  },
  menu: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#045bac", "#045bac"],
    activeBgColors: ["#FFFFFF", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    fontSize: [
      "0.5rem",
      "0.6rem",
      "0.7rem",
      "0.8rem",
      "0.9rem",
      "1rem",
      "1.25rem",
      "1.5rem",
      "1.75rem",
      "2rem",
    ], // 0~N levels of font size
    borderRadius: "1px",
    padding: "1px",
  },
  table: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#393c45", "#045bac"],
    activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    fontSize: [
      "0.5rem",
      "0.6rem",
      "0.7rem",
      "0.8rem",
      "0.9rem",
      "1rem",
      "1.25rem",
      "1.5rem",
      "1.75rem",
      "2rem",
    ], // 0~N levels of font size
  },
  chart: {
    colors: ["#393c45", "#045bac"],
    bgColors: ["#e8edf7", "#ffffff"],
    bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
    activeColors: ["#393c45", "#045bac"],
    activeBgColors: ["#e8edf7", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
    hoverColors: ["#393c45", "#045bac"],
    hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

    fontFamily: "Arial, sans-serif",
    fontSize: [
      "0.5rem",
      "0.6rem",
      "0.7rem",
      "0.8rem",
      "0.9rem",
      "1rem",
      "1.25rem",
      "1.5rem",
      "1.75rem",
      "2rem",
    ], // 0~N levels of font size
  },
};

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
