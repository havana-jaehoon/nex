import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv } from "../../component/base/NexBaseComponents";
import NexMenuItem from "./lib/NexMenuItem";
import { useNavigate } from "react-router-dom";
import { getThemeStyle } from "type/NexTheme";
import { buildAdminConfig } from "store/NexConfigStore";
import { Stack } from "@mui/material";

// CSV-Style menu data : type(item | folder), path, name, dispName, description, icon, color, route )

const NexMenuApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, user, theme } = props;

  const [selectedPath, setSelectedPath] = useState<string>("");

  const style = getThemeStyle(theme, "applet");

  const color = style.color;
  const bgColor = style.bgColor;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexLineChartApp requires at least one store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기

  const contentsFontSize = `calc(${style.fontSize} * 1.1)`;

  // 1.3 contents 에서 store, data, format 정보 가져오기
  //  Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  const storeIndex = 0; // only 1 store
  const [nexTree, setNexTree] = useState<any>(null);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    if (!contents || contents.length < 1) return;

    const cts = contents[storeIndex];

    const indexes = cts.indexes;
    let contentsData = [];
    if (!indexes)
      // indexes 가 없으면 전체 데이터
      contentsData = cts.data;
    else {
      contentsData = indexes.map((index: number) => cts.data[index]);
    }

    const tree = buildAdminConfig(contentsData);
    //console.log("NexMenuApp: nexTree=", JSON.stringify(tree, null, 2));
    setNexTree({ data: tree });
    setStore(cts.store);
    //setFormat(cts.format);
    //setSelectedKeys(cts.selectedKeys);
  }, [contents]);

  const navigate = useNavigate();
  const handleClick = (path: string) => {
    navigate(path);
    //console.log(`NexMenuApplet: handleClick path=${path}`);
  };

  return (
    <NexDiv
      color={color}
      bgColor={bgColor}
      width="100%"
      height="100%"
      overflow="auto"
      fontSize={contentsFontSize}
    >
      <Stack
        direction="column"
        spacing={2}
        justifyContent="flex-start"
        alignContent="flex-start"
        alignItems="flex-start"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {nexTree &&
          nexTree.data &&
          nexTree.data.map((node: any, index: number) => (
            <NexMenuItem
              key={index}
              depts={0}
              node={node}
              theme={theme}
              onClick={handleClick}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
            />
          ))}
      </Stack>
    </NexDiv>
  );
});

export default NexMenuApp;
