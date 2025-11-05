import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { observer } from "mobx-react-lite";

import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";

import { clamp } from "../../utils/util";
import { contrastColor, getThemeStyle } from "type/NexTheme";

const NexCountApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, user, theme } = props;
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexLineChartApp requires at least one store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const style = getThemeStyle(theme, "table");
  const contentsFontSize =
    style.fontSize[clamp(fontLevel - 1, 0, style.fontSize?.length - 1)] ||
    "1rem";

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

  const gap = 2;

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv
        direction="column"
        width="100%"
        height="100%"
        fontSize={contentsFontSize}
        fontWeight="bold"
      >
        <Stack width="100%" gap={gap}>
          {features.map((feature: any, index: number) => (
            <NexDiv key={index} direction="row" width="100%">
              <NexDiv
                flex="1"
                width="50%"
                borderRadius="0.5rem"
                justify="center"
                bgColor={feature.color || "#888888"}
                color={contrastColor(feature.color)}
              >
                {feature.dispName}
              </NexDiv>
              <NexDiv
                flex="1"
                width="50%"
                justify="flex-end"
                color={feature.color || "#888888"}
              >
                {datas[0] && datas[0][index]}
              </NexDiv>
            </NexDiv>
          ))}
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default NexCountApp;
