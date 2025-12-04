import React, { useState } from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
import { NexDiv } from "../../component/base/NexBaseComponents";

import { clamp } from "../../utils/util";
import NexDataStore from "store/NexDataStore";
import NexLineChartApp from "../chart/NexLineChartApp";
import EMU150TrainAccordion from "./lib/EMU150TrainAccordion";
import { getThemeStyle } from "type/NexTheme";

const EMU150TrainLineInfoApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, applet, user } = props;

  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents.length === 0)
      return "EMU150TrainLineInfoApp requires at least one store element.";
    return null;
  };

  const tableStyle = getThemeStyle(theme, "table");

  return (
    <NexApplet {...props} error={errorMsg()}>
      {/* 3. 기본 Apllet 의 속성 적용 */}

      {/* 4. Applet Contents 출력  */}
      <NexDiv direction="column" width="100%" height="100%">
        <NexDiv flex="2" width="100%" height="100%"></NexDiv>
        <NexDiv direction="row" flex="8" width="100%" height="100%">
          <NexDiv
            direction="column"
            flex="1"
            width="100%"
            height="100%"
          ></NexDiv>
          {/*store.map((data, index) => {
            return <NexTableApp key={index} store={[data]} theme={theme} />;
          })*/}
        </NexDiv>
      </NexDiv>
    </NexApplet>
  );
});

export default EMU150TrainLineInfoApp;
