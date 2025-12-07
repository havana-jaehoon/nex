import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box, Select, MenuItem, FormControl } from "@mui/material";
import { getThemeStyle } from "type/NexTheme";
import { clamp } from "../../utils/util";
import { NexDiv } from "../../component/base/NexBaseComponents";
import PXIcon from "icon/pxIcon";

export interface LineChartViewProps {
  name: string;
  data: any[];
  features: any[];
  user?: any;
  theme?: any;
}

const CHART_STYLES = {
  default: {
    label: "Default",
    lineType: "monotone",
    strokeWidth: 2,
    dot: { r: 1 },
    gridDash: "3 3",
  },
  smooth: {
    label: "Smooth",
    lineType: "natural",
    strokeWidth: 3,
    dot: false,
    gridDash: "3 3",
  },
  step: {
    label: "Step",
    lineType: "step",
    strokeWidth: 2,
    dot: { r: 2 },
    gridDash: "5 5",
  },
  linear: {
    label: "Sharp",
    lineType: "linear",
    strokeWidth: 1,
    dot: { r: 3 },
    gridDash: "1 1",
  },
};

// Helper to generate colors
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
  "#c71585",
  "#4682b4",
  "#000080",
  "#800000",
];

const CustomLegend = ({ payload, features }: any) => (
  <NexDiv direction="column" align="start" justify="center" style={{ paddingLeft: "10px" }}>
    {payload?.map((entry: any, index: number) => {
      const seriesName = entry.value;
      const literal = features?.[1]?.literals?.find(
        (lit: any) => lit.name === seriesName
      );
      const color = literal?.color || entry.color;
      const iconPath = literal?.icon;
      const fontSize = "0.9rem";

      return (
        <NexDiv
          key={`item-${index}`}
          style={{ marginBottom: 6 }}
          align="center"
          direction="row"
          fontSize={fontSize}
        >
          {iconPath ? (
            <PXIcon
              path={iconPath}
              color={color}
              width={fontSize}
              height={fontSize}
              style={{ marginRight: 0.5 }}
            />
          ) : (
            <span style={{ color: color, marginRight: 6 }}>■</span>
          )}
          <Typography variant="body1" sx={{ fontSize: fontSize }}>
            {seriesName}
          </Typography>
        </NexDiv>
      );
    })}
  </NexDiv>
);

const LineChartView: React.FC<LineChartViewProps> = ({
  name,
  data,
  features,
  user,
  theme,
}) => {
  const [chartStyle, setChartStyle] = React.useState<string>("default");

  const style = getThemeStyle(theme, "chart");
  const contentsFontSize = style.fontSize;

  // Data Transformation
  // Input: [[date, name, value], ...]
  // Output: [{ date: "...", "SeriesA": 10, "SeriesB": 20 }, ...]
  const { chartData, seriesNames } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], seriesNames: [] };

    const groupedData: Record<string, any> = {};
    const seriesSet = new Set<string>();

    data.forEach((row) => {
      const date = row[0];
      const seriesName = row[1];
      const value = row[2];

      if (!groupedData[date]) {
        groupedData[date] = { date };
      }
      groupedData[date][seriesName] = value;
      seriesSet.add(seriesName);
    });

    // Convert to array and sort by date (assuming date string is sortable or use timestamp)
    const resultData = Object.values(groupedData).sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return { chartData: resultData, seriesNames: Array.from(seriesSet) };
  }, [data]);

  const currentStyle = CHART_STYLES[chartStyle as keyof typeof CHART_STYLES];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontSize: contentsFontSize,
        p: 0,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 10,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <FormControl size="small" variant="outlined">
          <Select
            value={chartStyle}
            onChange={(e) => setChartStyle(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Chart Style" }}
            sx={{ fontSize: "0.8rem", height: 30 }}
          >
            {Object.entries(CHART_STYLES).map(([key, value]) => (
              <MenuItem key={key} value={key} sx={{ fontSize: "0.8rem" }}>
                {value.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flex: 1, width: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 15, left: 0, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray={currentStyle.gridDash} />
            <XAxis dataKey="date" tickMargin={15} />
            <YAxis tickMargin={5} />
            <Tooltip />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={<CustomLegend features={features} />}
            />
            {seriesNames.map((seriesName, index) => {
              const literal = features?.[1]?.literals?.find(
                (lit: any) => lit.name === seriesName
              );
              const color = literal?.color || COLORS[index % COLORS.length];

              return (
                <Line
                  key={seriesName}
                  type={currentStyle.lineType as any}
                  dataKey={seriesName}
                  stroke={color}
                  strokeWidth={currentStyle.strokeWidth}
                  dot={currentStyle.dot}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default LineChartView;
