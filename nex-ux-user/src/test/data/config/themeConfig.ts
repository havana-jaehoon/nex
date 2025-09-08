import { NexTheme } from "type/NexTheme";

export const themeConfig: NexTheme[] = [
  {
    name: "default",
    common: {
      colors: ["#393c45", "#03dac6"],
      bgColors: ["#EEEEEE", "#DDDDDD"],
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
    applet: {
      colors: ["#393c45", "#045bac"],
      bgColors: ["#FFFFFF", "#ffffff"],
      bdColors: ["#cccccc", "#ccccee"], // 테두리 색상, 여러 색상을 지원하기 위해 배열로 변경
      activeColors: ["#393c45", "#045bac"],
      activeBgColors: ["#2185d0", "#ffffff"], // 활성화 배경색, 여러 색상을 지원하기 위해 배열로 변경
      hoverColors: ["#393c45", "#045bac"],
      hoverBgColors: ["#e8edf7", "#ffffff"], // 호버 배경색, 여러 색상을 지원하기 위해 배열로 변경

      fontFamily: "Arial, sans-serif",
      borderRadius: "0.3rem", // all | top right bottom left
      padding: "0.5rem", // all | top right bottom left
      gap: "0.4rem",
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
      borderRadius: "4px",
      padding: "4px",
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
  },
];
