import React, { useContext, useEffect, useState } from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
//import { NexFeature } from "../nexAppletStore";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { clamp } from "../../utils/util";
import { Box, Stack } from "@mui/material";

//import { fieldPaths } from "test/data/testProjects";

const NexSampleListApp: React.FC<NexAppProps> = observer((props) => {
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

  const contentsFontSize =
    theme?.default?.fontSize[
      clamp(fontLevel - 1, 0, theme?.default?.fontSize?.length - 1)
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

  // 2. data store 에서 출력할 데이터를 Applet 에서 사용할 수 있는 형태로 변환.
  // 외부 Component 사용시 자료구조가 store 에서 사용되는 구조와 다른 경우 변환.
  // 대부분의 List 자료는 변환 할 필요 없음.

  return (
    <NexApplet {...props} error={errorMsg()}>
      {/* 3. 기본 Apllet 의 속성 적용 */}

      {/* 4. Applet Contents 출력  */}
      <NexDiv
        direction="column"
        width="100%"
        height="100%"
        fontSize={contentsFontSize}
      >
        {/* 5.1. Contents Header 출력(Features)  */}
        <Stack direction="row" spacing={2} mb={2}>
          {features.map((feature: any, index: number) => (
            <Box key={index}>{feature.name}</Box>
          ))}
        </Stack>

        <Stack spacing={2} mb={2}>
          {/* 5.2. Contents Data 출력 */}
          {datas.map((row: any[], index: number) => (
            <Stack key={index} direction="row" spacing={2}>
              {row.map((value: any, idx: number) => (
                <span key={`${index}-${idx}`} style={{ marginLeft: 5 }}>
                  {value}
                </span>
              ))}
            </Stack>
          ))}
        </Stack>
      </NexDiv>
    </NexApplet>
  );
});

export default NexSampleListApp;
