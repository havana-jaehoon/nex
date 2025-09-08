import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Props as LegendContentProps } from "recharts/types/component/DefaultLegendContent";
import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
import { NexFeature } from "../nexAppletStore";
import { NexDiv, NexLabel } from "../../component/base/NexBaseComponents";
import { clamp } from "../../utils/util";

const CustomLegend = ({
  payload,
  onClick,
  fontSize,
}: LegendContentProps & {
  fontSize: string;
}) => (
  <NexDiv direction="column" align="start" justify="start">
    {payload?.map((entry, index) => (
      <NexDiv
        key={`item-${index}`}
        style={{ color: entry.color, marginBottom: 4 }}
      >
        <span style={{ color: entry.color, marginLeft: 5 }}>■</span>
        {entry.value}
      </NexDiv>
    ))}
  </NexDiv>
);

const NexLineChartApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, themeUser, theme } = props;
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexLineChartApp requires at least one store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = themeUser?.fontLevel || 5; // Default font level if not provided

  const contentsFontSize =
    theme?.chart?.fontSize[
      clamp(fontLevel - 1, 0, theme?.chart.fontSize?.length - 1)
    ] || "1rem";

  // 1.3 Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  // 1.4 data store 에서 출력할 데이터를 Applet 에서 사용할 수 있는 형태로 변환.
  const features: NexFeature[] = contents?.[0].format.features || [];

  const chartData =
    contents?.[0].csv.map((row: any) => {
      const obj: Record<string, any> = {};
      features.forEach((feature: any, idx) => {
        obj[feature.dispName] = row[idx];
      });
      return obj;
    }) || [];

  // X 축 을 Key로 지정된 데이터로
  let keyFeature = features.find((feature) => feature.isKey);
  if (!keyFeature && features.length > 0) {
    keyFeature = features[0];
  }
  const key = keyFeature ? keyFeature.dispName || keyFeature.name : "";

  return (
    <NexApplet {...props} error={errorMsg()}>
      {/* 3. 기본 Apllet 의 속성 적용 */}

      {/* 4. Applet Contents 출력  */}
      <NexDiv width="100%" height="100%" fontSize={contentsFontSize}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={300}
            height={200}
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey={key} type="category" />
            <YAxis
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
            />
            <Tooltip />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={(props) => (
                <CustomLegend
                  {...props}
                  fontSize={
                    theme?.chart?.fontSize[0]
                      ? theme?.chart?.fontSize[0]
                      : "1rem"
                  }
                />
              )}
            />
            {features.map((feature: NexFeature, index: number) =>
              index !== 0 ? (
                <Line
                  key={feature.name}
                  type="monotone"
                  dataKey={feature.dispName}
                  stroke={feature?.color || "#8884d8"}
                  legendType={
                    (feature?.icon as
                      | "line"
                      | "plainline"
                      | "rect"
                      | "square"
                      | "circle"
                      | "cross"
                      | "diamond"
                      | "star"
                      | "triangle"
                      | "wye"
                      | undefined) || "line"
                  }
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </NexDiv>
    </NexApplet>
  );
});

export default NexLineChartApp;
