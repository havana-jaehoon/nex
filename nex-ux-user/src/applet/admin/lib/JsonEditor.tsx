import { Stack } from "@mui/material";
import { NexDiv, NexInput, NexLabel } from "component/base/NexBaseComponents";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import {
  defaultThemeStyle,
  getThemeStyle,
  NexTheme,
  NexThemeStyle,
} from "type/NexTheme";

const fontSize = "1rem";

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (v: string) => void;
  onFocus: (focus: boolean) => void;
  type?: "text" | "number" | "password";
  color?: string;
  bgColor?: string;
  fontSize?: string;
}

interface JsonEditorProps {
  path?: string;
  depth: number;
  theme?: NexTheme;
  editName?: (name: string, dispName: string) => void; // 이름 변경시 바로 UI 반영
  data: { [key: string]: any };
  onFocus: (focus: boolean) => void;
  onChange: (newData: { [key: string]: any }) => void; // 변경 완료시 데이터 업데이트
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  data,
  path,
  depth,
  theme,
  onFocus,
  editName,
  onChange,
}) => {
  const [localData, setLocalData] = useState(data);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  //console.log("### localData : ", JSON.stringify(localData, null, 2));

  const changeValue = (key: string, value: string) => {
    const newData = { ...localData, [key]: value };
    setLocalData(newData);
    //console.log("changeValue : ", JSON.stringify(newData, null, 2));
  };

  const inputStyle = getThemeStyle(theme, "input");

  const colorInput = inputStyle.colors[0];
  const bgColorInput = inputStyle.bgColors[0];

  const setValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("setValue : ", e.key);
    if (e.key === "Enter") {
      onChange(localData);
    } else if (e.key === "Escape") {
      setLocalData(data);
    }
  };

  const isObject = (value: any) => typeof value === "object" && value !== null;

  const toggleSubItem = (key: string) => {
    const open = !(isOpen[key] !== false);
    setIsOpen({ ...isOpen, [key]: open });
  };

  const iconSubItem = (key: string) => {
    return (
      <NexDiv
        direction="row"
        align="center"
        onClick={() => toggleSubItem(key)}
        cursor="pointer"
      >
        {isOpen[key] !== false ? (
          <MdKeyboardArrowDown />
        ) : (
          <MdKeyboardArrowRight />
        )}
        <NexLabel fontSize={fontSize}>{key}</NexLabel>
        <span style={{ width: fontSize }}>{":"} </span>
      </NexDiv>
    );
  };

  const caption = JSON.stringify(localData, null, 2);

  if (data === null || data === undefined) {
    return null;
  }

  return (
    <NexDiv
      direction="row"
      align="flex-start"
      width="100%"
      fontSize={fontSize}
      title={caption}
    >
      <span
        style={{
          width: `${fontSize}`,
        }}
      />

      <Stack
        spacing={1}
        direction="column"
        width="100%"
        alignContent="center"
        justifyContent="center"
      >
        {Object.entries(localData).map(([key, value]) => (
          <React.Fragment key={key}>
            {!isObject(value) ? (
              <Stack
                spacing={1}
                direction="row"
                width="100%"
                alignItems="center" // 변경: end -> flex-end
                height={`calc(${fontSize} * 1.5)`}
              >
                <NexLabel>{key}</NexLabel>
                <NexLabel> : </NexLabel>
                <NexInput
                  value={value}
                  onChange={(e) => changeValue(key, e.target.value)}
                  onKeyDown={setValue}
                  width="100%"
                  height="100%"
                  borderBottom="1px solid #555"
                  borderRadius="0.2rem"
                  color={colorInput}
                  bgColor={bgColorInput}
                  fontSize={fontSize}
                  onFocus={() => onFocus(true)}
                  onBlur={() => onFocus(false)}
                />
              </Stack>
            ) : (
              <NexDiv direction="column" align="flex-start">
                {iconSubItem(key)}

                {isOpen[key] !== false &&
                  (Array.isArray(value)
                    ? value.map((item, index) => (
                        <JsonEditor
                          key={index}
                          data={item}
                          depth={depth + 1}
                          path={path}
                          onFocus={onFocus}
                          onChange={(newItem) => {
                            const newArray = [...value];
                            newArray[index] = newItem;
                            onChange({ ...localData, [key]: newArray });
                          }}
                        />
                      ))
                    : isObject(value) && (
                        <JsonEditor
                          data={value}
                          depth={depth + 1}
                          path={path}
                          onFocus={onFocus}
                          onChange={(newObj) => {
                            onChange({ ...localData, [key]: newObj });
                          }}
                        />
                      ))}
              </NexDiv>
            )}
          </React.Fragment>
        ))}
      </Stack>
    </NexDiv>
  );
};

export default JsonEditor;
