import { useState, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { observer } from "mobx-react-lite";

import NexApplet, { NexAppProps } from "../NexApplet";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";

import MultiProgress from "./lib/MultiProgress";

import { clamp } from "../../utils/util";
import { contrastColor, getThemeStyle } from "type/NexTheme";

const NexStatusApp: React.FC<NexAppProps> = observer((props) => {
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
    style.fontSize[
      clamp(fontLevel - 1, 0, style.fontSize?.length - 1)
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

  const keyIndex = useMemo(
    () => features.findIndex((feature: any) => feature.isKey),
    [features]
  );

  const maxValue = 10;
  const progressBarWeight = 6; // 높이 설정
  const gap = 2;
  //console.log("NexStatusApp: values=", JSON.stringify(data, null, 2));

  return (
    <NexApplet {...props} error={errorMsg()}>
      <NexDiv
        direction="column"
        width="100%"
        height="100%"
        fontSize={contentsFontSize}
        fontWeight="bold"
      >
        <NexDiv direction="row" width="100%">
          {features.map((feature: any, index: number) =>
            keyIndex === index ? (
              <NexDiv
                key={index}
                flex="50"
                width="100%"
                borderRadius="0.5rem"
              ></NexDiv>
            ) : (
              <NexDiv
                key={index}
                flex="12"
                width="100%"
                justify="center"
                align="center"
                bgColor={feature.color || "#888888"}
                color={contrastColor(feature.color)}
                borderRadius="1rem"
              >
                {feature.dispName}
              </NexDiv>
            )
          )}
        </NexDiv>

        <Stack
          direction="column"
          justifyContent="start"
          height="100%"
          width="100%"
          gap={gap}
          mt={gap}
        >
          {datas.map((row: any[], index: number) => (
            <NexDiv
              key={index}
              direction="column"
              align="center"
              justify="center"
              width="100%"
            >
              <NexDiv direction="row" width="100%" height="100%">
                {row.map((value, idx) =>
                  idx === keyIndex ? (
                    <NexDiv key={idx} flex="50" width="100%">
                      {value}
                    </NexDiv>
                  ) : (
                    <NexDiv
                      key={idx}
                      flex="12"
                      color={(features[idx] as any)?.color || "#888888"}
                      justify="center"
                      width="100%"
                    >
                      {value}
                    </NexDiv>
                  )
                )}
              </NexDiv>
              <NexDiv direction="column" width="100%">
                <MultiProgress
                  values={row.slice(keyIndex + 1).map((value) => value)}
                  colors={features
                    .slice(keyIndex + 1)
                    .map((feature: any) => feature.color || "#FF0000")}
                  max={maxValue} // Assuming max is 100 for percentage
                  height={progressBarWeight}
                />
              </NexDiv>
            </NexDiv>
          ))}
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default NexStatusApp;
