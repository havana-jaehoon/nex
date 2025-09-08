import { Stack } from "@mui/material";
import { NexDiv, NexInput, NexLabel } from "component/base/NexBaseComponents";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const colorSelection = "#0F6CED";
const colorTitle = "#EEEEEE";
const bgColorInput = "#151515";

const bgColorSection = "#222222";
const colorSection = "#EEEEEE";
const borderColorSection = "#555555";
const fontSize = "1rem";

interface JsonEditorProps {
  isForbidden?: boolean;
  path?: string;
  depth: number;
  theme?: any;
  editName?: (name: string, dispName: string) => void; // 이름 변경시 바로 UI 반영
  data: { [key: string]: any };
  onFocus: (focus: boolean) => void;
  onChange: (newData: { [key: string]: any }) => void; // 변경 완료시 데이터 업데이트
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  isForbidden,
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

  const color = theme?.applet?.colors[0] || "#393c45";
  const bgColor = theme?.applet?.bgColors[0] || "#e8edf7";
  const colorInput = theme?.input?.colors[0] || "#393c45";
  const bgColorInput = theme?.input?.bgColors[0] || "#ffffff";

  const setValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("setValue : ", e.key);
    if (e.key === "Enter") {
      onChange(localData);
    } else if (e.key === "Escape") {
      setLocalData(data);
    }
  };

  const isObject = (value: any) => typeof value === "object" && value !== null;
  //const skipKeyPrefix = ["children", "isForbidden", "isOpen"];
  //const skipKeyPrefix = ["children", "isOpen"];
  //const notEditableKeys = ["type", "category"];
  //const selectables = ["unit", "category"];
  //const numberKeys = ["size", "gap"];
  //const isSkipKey = (key: string) => false;
  /*
  const isSkipKey = (key: string) =>
    skipKeyPrefix.some((skipKey) =>
      key.toLowerCase().startsWith(skipKey.toLowerCase())
    );
*/

  const toggleSubItem = (key: string) => {
    const open = !(isOpen[key] !== false);
    setIsOpen({ ...isOpen, [key]: open });
    //setLocalData({ ...localData, ["isOpen" + key]: open });
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

                {isForbidden ? (
                  <NexLabel>{value}</NexLabel>
                ) : (
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
                )}
              </Stack>
            ) : (
              <NexDiv direction="column" align="flex-start">
                {iconSubItem(key)}

                {isOpen[key] !== false &&
                  (Array.isArray(value)
                    ? value.map((item, index) => (
                        <JsonEditor
                          key={index}
                          isForbidden={isForbidden}
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
                          isForbidden={isForbidden}
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
