import React from "react";
import { NexDiv } from "component/base/NexBaseComponents";

const NexPlayground: React.FC = () => {
  return (
    <NexDiv
      width="100%"
      height="100%"
      align="center"
      justify="center"
      direction="column"
      bgColor="#f0f0f0"
    >
      <h1>Playground</h1>
      <p>이곳에서 컴포넌트를 테스트할 수 있습니다.</p>
    </NexDiv>
  );
};

export default NexPlayground;
