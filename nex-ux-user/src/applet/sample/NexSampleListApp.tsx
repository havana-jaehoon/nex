import React, { useContext, useEffect, useState } from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
//import { NexFeature } from "../nexAppletStore";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { clamp } from "../../utils/util";
import { Box, Button, Card, CardContent, CardHeader, Paper, Stack } from "@mui/material";
import { getThemeStyle } from "type/NexTheme";
import PxIcon from "icon/pxIcon";
import { NexFeatureType } from "type/NexNode";

//import { fieldPaths } from "test/data/testProjects";

const NexSampleListApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, user, theme } = props;
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexSampleListApp requires at least one or more store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided

  const style = getThemeStyle(theme, "default");
  const contentsFontSize = style.fontSize;

  // 1.3 contents 에서 store, data, format 정보 가져오기
  //  Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  const storeIndex = 0; // only 1 store
  const [datasList, setDatasList] = useState<any[]>([]);
  const [featuresList, setFeaturesList] = useState<any[]>([]);

  const [storeList, setStoreList] = useState<any[]>([]);

  const storeCount = contents?.length || 0;
  useEffect(() => {
    //const cts = contents?.[storeIndex];

    if (!contents || contents?.length < 1) return;

    const datasList: any[] = [];
    const featuresList: any[] = [];
    const storeList: any[] = [];

    contents.forEach((cts: any) => {

      const tdata = cts.indexes
        ? cts.indexes?.map((i: number) => cts.data[i]) || []
        : cts.data || [];

      featuresList.push(cts.format.features || []);
      datasList.push(tdata);
      storeList.push(cts.store);
    })

    setFeaturesList(featuresList);
    setDatasList(datasList);
    setStoreList(storeList);
  }, [contents, ...(contents?.map((cts) => cts.store.odata) || [])]);

  // 2. data store 에서 출력할 데이터를 Applet 에서 사용할 수 있는 형태로 변환.
  // 외부 Component 사용시 자료구조가 store 에서 사용되는 구조와 다른 경우 변환.
  // 대부분의 List 자료는 변환 할 필요 없음.

  const handleAdd = (storeIndex: number, newRow: any) => {
    if (storeList.length > 0) {
      storeList[storeIndex].addRow(newRow);
    }
  };

  const handleFetch = (storeIndex: number) => {
    if (storeList.length > 0) {
      storeList[storeIndex].fetch();
    }
  };

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
        <Stack spacing={2} mb={2} sx={{ width: "100%" }}>
          {datasList.map((datas: any[], ctsIndex: number) => (
            <Card key={ctsIndex} sx={{ width: "100%", mb: 2 }}>
              <CardHeader title={`${storeList[ctsIndex].name}`} action={
                <Button onClick={() => handleFetch(ctsIndex)}>Fetch Data</Button>
              } />
              {/* 5.1. Contents Header 출력(Features)  */}
              <CardContent sx={{ width: "100%" }}>
                <NexDiv width="100%">
                  {featuresList[ctsIndex].map((feature: any, idx: number) => (
                    <NexDiv key={idx} color={feature.color ?? ""} flex="1" justify="center" align="center">
                      {feature.icon && feature.icon !== "" &&
                        <PxIcon path={feature.icon} />
                      }
                      {feature.dispName ?? feature.name}</NexDiv>
                  ))}
                </NexDiv>

                <NexDiv width="100%" direction="column">
                  {/* 5.2. Contents Data 출력 */}
                  {datas.map((row: any[], rowIndex: number) => (
                    <NexDiv key={rowIndex} width="100%">
                      {row.map((value: any, idx: number) => {
                        const feature = featuresList[ctsIndex][idx];
                        const literal =
                          feature.featureType === NexFeatureType.LITERALS
                            ? feature.literals.find(
                              (lit: any) => lit.value === value
                            )
                            : null;

                        return (
                          <NexDiv
                            key={`${rowIndex}-${idx}`}
                            flex="1"
                            color={feature.color ?? ""}
                            justify="center"
                            align="flex-end"
                          >
                            {literal?.icon && literal.icon !== "" && (
                              <PxIcon path={literal.icon} />
                            )}
                            {literal?.color && literal.color !== "" ? (
                              <NexDiv color={literal.color}>{value}</NexDiv>
                            ) : (
                              <NexDiv>{value}</NexDiv>
                            )}
                          </NexDiv>
                        );
                      })}
                    </NexDiv>
                  ))}
                </NexDiv>
              </CardContent>
            </Card>
          ))}
        </Stack>

      </NexDiv>
    </NexApplet>
  );
});

export default NexSampleListApp;
