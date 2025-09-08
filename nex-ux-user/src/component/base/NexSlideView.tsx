import React, { useState } from "react";
import styled from "styled-components";

interface NexSlideViewProps {
  width?: string;
  height?: string;
  padding?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const SlideContainer = styled.div<{ isOpen: boolean; width: string }>`
  position: relative;
  width: ${({ width }) => width};
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen, width }) =>
    isOpen ? "translateX(0)" : `translateX(-${parseInt(width) - 50}px)`};
`;

const SlideContent = styled.div<{
  height: string;
  padding: string;
  bgColor: string;
  borderColor: string;
}>`
  background-color: ${({ bgColor }) => bgColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  padding: ${({ padding }) => padding};
  height: ${({ height }) => height};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const ToggleButton = styled.button<{
  buttonBgColor: string;
  buttonTextColor: string;
}>`
  position: absolute;
  top: 10px;
  right: -50px;
  background-color: ${({ buttonBgColor }) => buttonBgColor};
  color: ${({ buttonTextColor }) => buttonTextColor};
  border: none;
  padding: 10px;
  cursor: pointer;
`;

const HiddenToggleButton = styled.button<{
  buttonBgColor: string;
  buttonTextColor: string;
}>`
  position: absolute;
  top: 10px;
  left: 0;
  background-color: ${({ buttonBgColor }) => buttonBgColor};
  color: ${({ buttonTextColor }) => buttonTextColor};
  border: none;
  padding: 10px;
  cursor: pointer;
`;

const NexSlideView: React.FC<NexSlideViewProps> = ({
  width = "300px",
  height = "100vh",
  padding = "20px",
  bgColor = "#f4f4f4",
  borderColor = "#ccc",
  textColor = "#000",
  buttonBgColor = "#007bff",
  buttonTextColor = "#fff",
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSlide = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SlideContainer isOpen={isOpen} width={width}>
      <SlideContent
        height={height}
        padding={padding}
        bgColor={bgColor}
        borderColor={borderColor}
      >
        <p style={{ color: textColor }}>여기에 컨텐츠를 넣으세요.</p>
        <ToggleButton
          onClick={toggleSlide}
          buttonBgColor={buttonBgColor}
          buttonTextColor={buttonTextColor}
        >
          {isOpen ? "닫기" : "열기"}
        </ToggleButton>
      </SlideContent>
      {!isOpen && (
        <HiddenToggleButton
          onClick={toggleSlide}
          buttonBgColor={buttonBgColor}
          buttonTextColor={buttonTextColor}
        >
          열기
        </HiddenToggleButton>
      )}
    </SlideContainer>
  );
};

export default NexSlideView;
