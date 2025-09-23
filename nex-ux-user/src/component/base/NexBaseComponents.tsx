import styled from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

interface NexDivProps {
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "flex-end" | "flex-start" | "stretch";
  justify?:
    | "start"
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
  flex?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  height?: string;
  width?: string;
  display?: string;
  bgColor?: string;
  color?: string;
  gap?: string;
  margin?: string;
  padding?: string;
  borderRadius?: string;
  overflow?: string;
  fontSize?: string; // Added fontSize property
  fontFamily?: string; // Added fontFamily property
  fontWeight?: string; // Added fontWeight property
  cursor?: string;
}
export const NexDiv = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    isPropValid(prop) &&
    !["flex", "align", "direction", "justify", "bgColor", "gap"].includes(prop),
})<NexDivProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  flex: ${(props) => props.flex || "0 1 auto"};
  border: ${(props) =>
    props.borderTop ||
    props.borderBottom ||
    props.borderLeft ||
    props.borderRight
      ? "none"
      : props.border || "none"};
  border-top: ${(props) => props.borderTop || props.border || "none"};
  border-bottom: ${(props) => props.borderBottom || props.border || "none"};
  border-left: ${(props) => props.borderLeft || props.border || "none"};
  border-right: ${(props) => props.borderRight || props.border || "none"};
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
  background-color: ${(props) => props.bgColor || "inherit"};
  color: ${(props) => props.color || "inherit"};
  gap: ${(props) => props.gap || "0"};
  margin: ${(props) => props.margin || "0"};
  padding: ${(props) => props.padding || "0"};
  border-radius: ${(props) => props.borderRadius || "0"};
  box-sizing: border-box;
  overflow: ${(props) => props.overflow || "hidden"};
  font-size: ${(props) => props.fontSize || "inherit"}; // Added fontSize style
  font-family: ${(props) =>
    props.fontFamily || "inherit"}; // Added fontFamily style
  font-weight: ${(props) =>
    props.fontWeight || "inherit"}; // Added fontWeight style
  min-width: 0; /* Prevents flex items from overflowing */
  min-height: 0; /* Prevents flex items from overflowing */
  cursor: ${(props) => props.cursor || "inherit"}; // Added cursor style
`;

export const NexResizableDiv = styled.div<NexDivProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  flex: ${(props) => props.flex || "0 1 auto"};
  display: ${(props) => props.display || "flex"};
  border: ${(props) => props.border || "0"};
  justify-content: ${(props) => props.align || "stretch"};
  align-items: ${(props) => props.align || "stretch"};
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color || "inherit"};
  gap: ${(props) => props.gap || "0"};
  margin-left: ${(props) => props.margin || "0"};
  box-sizing: border-box;
  overflow: hidden;
  resize: both;
  & .resizable-content {
    min-width: 30px;
    resize: both;
    overflow: hidden;
    max-height: fit-content;
    max-width: fit-content;
    box-sizing: border-box;
  }
`;

interface NexButtonProps {
  bgColor?: string;
  color?: string;
  hoverColor?: string;
  hoverBgColor?: string;
  fontSize?: string;
  borderRadius?: string;
  fontStyle?: string;
  border?: string;
  cursor?: string;
  display?: string;
  width?: string;
  height?: string;
  flex?: string;
}

export const NexButton = styled.button.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    isPropValid(prop) &&
    ![
      "flex",
      "align",
      "direction",
      "justify",
      "bgColor",
      "hoverBgColor",
    ].includes(prop),
})<NexButtonProps>`
  background-color: ${(props) => props.bgColor || "#252525"};
  color: ${(props) => props.color || "#ffffff"};
  border: ${(props) => props.border || "1px solid transparent"};
  font-size: ${(props) => props.fontSize || "1em"};
  border-radius: ${(props) => props.borderRadius || "0"};
  cursor: ${(props) => props.cursor || "pointer"};
  transition: background-color 0.3s;
  display: ${(props) => props.display || "flex"};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  flex: ${(props) => props.flex || "0 1 auto"};
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    background-color: ${(props) => props.hoverBgColor || "#555"};
    color: ${(props) => props.hoverColor || props.color || "#ffffff"};
  }
`;

interface NexInputProps {
  bgColor?: string;
  color?: string;
  fontSize?: string;
  borderColor?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderRadius?: string;
  cursor?: string;
  display?: string;
  width?: string;
  height?: string;
  padding?: string;
  align?: string;
  flex?: string;
  margin?: string;
  justify?: string;
}

export const NexInput = styled.input.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    isPropValid(prop) &&
    ![
      "flex",
      "align",
      "direction",
      "justify",
      "bgColor",
      "hoverBgColor",
    ].includes(prop),
})<NexInputProps>`
  background-color: ${(props) => props.bgColor || "white"};
  color: ${(props) => props.color || "#117"};
  padding: ${(props) => props.padding || "0"};
  border: ${(props) =>
    props.borderTop ||
    props.borderBottom ||
    props.borderLeft ||
    props.borderRight
      ? "none"
      : props.border || `1px solid ${props.borderColor || "grey"}`};
  border-top: ${(props) => props.borderTop || "none"};
  border-bottom: ${(props) => props.borderBottom || "none"};
  border-left: ${(props) => props.borderLeft || "none"};
  border-right: ${(props) => props.borderRight || "none"};
  font-size: ${(props) => props.fontSize || "1em"};
  border-radius: ${(props) => props.borderRadius || "0"};
  cursor: ${(props) => props.cursor || "text"};
  display: ${(props) => props.display || "flex"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  align-items: ${(props) => props.align || "flex-end"};
  justify-content: ${(props) => props.justify || "flex-end"};
  flex: ${(props) => props.flex || "0 1 auto"};
  box-sizing: border-box;
  overflow: visible;

  &:focus {
    outline: none;
    box-shadow: 0 2px 0 0 ${(props) => props.borderColor || "#0F6CED"};
  }

  &::selection {
    background-color: #333333ff;
  }
`;

NexInput.defaultProps = {
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
};

interface NexLabelProps {
  bgColor?: string;
  color?: string;
  fontSize?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  borderRadius?: string;
  cursor?: string;
  width?: string;
  display?: string;
  height?: string;
  padding?: string;
  align?: string;
  justify?: string;
  flex?: string;
  direction?: string;
  margin?: string;
  overflow?: string;
}
export const NexLabel = styled.label.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    isPropValid(prop) &&
    ![
      "flex",
      "align",
      "direction",
      "justify",
      "bgColor",
      "hoverBgColor",
    ].includes(prop),
})<NexLabelProps>`
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color || "inherit"};
  font-size: ${(props) => props.fontSize || "inherit"};
  border: ${(props) => props.border || "none"};
  border-top: ${(props) => props.borderTop || props.border || "none"};
  border-bottom: ${(props) => props.borderBottom || props.border || "none"};
  border-left: ${(props) => props.borderLeft || props.border || "none"};
  border-right: ${(props) => props.borderRight || props.border || "none"};
  border-radius: ${(props) => props.borderRadius || "0"};
  cursor: ${(props) => props.cursor || "inherit"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  padding: ${(props) => props.padding || "0"};
  display: ${(props) => props.display || "flex"};
  align-items: ${(props) => props.align || "flex-start"};
  justify-content: ${(props) => props.justify || "flex-start"};
  flex: ${(props) => props.flex || "0 1 auto"};
  flex-direction: ${(props) => props.direction || "row"};
  margin: ${(props) => props.margin || "0"};
  box-sizing: border-box;
  overflow: ${(props) => props.overflow || "visible"};
`;
