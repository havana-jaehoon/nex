import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv } from "../../component/base/NexBaseComponents";
import NexMenuItem from "./lib/NexMenuItem";
import { useNavigate } from "react-router-dom";
import { buildMenuTree } from "./lib/NexMenuNode";
import { clamp } from "utils/util";

// CSV-Style menu data : type(item | folder), path, name, dispName, description, icon, color, route )

const NexMenuApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, user, theme } = props;

  const [selectedPath, setSelectedPath] = useState<string>("");
  const color = theme?.menu?.colors[0];
  const bgColor = theme?.menu?.bgColors[0];

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexLineChartApp requires at least one store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const contentsFontSize =
    theme?.table?.fontSize[
      clamp(fontLevel - 1, 0, theme.table.fontSize?.length - 1)
    ] || "1rem";

  // 1.3 contents 에서 store, data, format 정보 가져오기
  //  Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  const storeIndex = 0; // only 1 store
  const [datas, setDatas] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    const cts = contents?.[storeIndex];
    if (!cts) {
      setFeatures([]);
      setDatas([]);
      return;
    }

    const tdata = cts.indexes
      ? cts.indexes?.map((i: number) => cts.data[i]) || []
      : cts.data || [];

    setFeatures(cts.format.features || []);
    setDatas(tdata);
  }, [contents]);

  const menuData = useMemo(() => buildMenuTree(datas), [datas]);

  const navigate = useNavigate();
  const handleClick = (path: string) => {
    navigate(path);
    //console.log(`NexMenuApplet: handleClick path=${path}`);
  };

  return (
    <NexDiv
      flex="1"
      direction="column"
      align="center"
      justify="flex-start"
      color={color}
      bgColor={bgColor}
      width="100%"
      height="100%"
      overflow="auto"
    >
      {menuData.map((node: any, index: number) => (
        <NexMenuItem
          key={index}
          depts={0}
          node={node}
          theme={theme}
          onClick={handleClick}
          path={`/${node.name}`}
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
        />
      ))}
    </NexDiv>
  );
});

export default NexMenuApp;
