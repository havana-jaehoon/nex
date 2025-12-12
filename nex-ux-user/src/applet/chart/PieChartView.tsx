import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box, Select, MenuItem, FormControl } from "@mui/material";
import { getThemeStyle } from "type/NexTheme";
import { NexDiv } from "../../component/base/NexBaseComponents";
import PXIcon from "icon/pxIcon";

export interface PieChartViewProps {
    name: string;
    data: any[];
    features: any[];
    user?: any;
    theme?: any;
}

interface ChartStyle {
    label: string;
    innerRadius: string | number;
    outerRadius: string | number;
    paddingAngle?: number;
}

const CHART_STYLES: Record<string, ChartStyle> = {
    default: {
        label: "Default",
        innerRadius: 0,
        outerRadius: "80%",
    },
    donut: {
        label: "Donut",
        innerRadius: "50%",
        outerRadius: "80%",
    },
    rose: { // Approximated with Pie for now, Recharts has RadialBar/Radar for true variations
        label: "Rose (Pie style)",
        innerRadius: 20,
        outerRadius: "80%",
        paddingAngle: 5
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

const PieChartView: React.FC<PieChartViewProps> = ({
    name,
    data,
    features,
    user,
    theme,
}) => {
    const [chartStyle, setChartStyle] = React.useState<string>("donut");

    const style = getThemeStyle(theme, "chart");
    const contentsFontSize = style.fontSize;

    // Data Transformation
    // Input: [[date, name, value], ...]
    // For Pie, we usually aggregate by Name (feature 1), summing values (feature 2)
    // Or just take the latest date's values.
    // Let's Aggregate by Name for this example effectively like a Pivot.
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const groupedData: Record<string, number> = {};

        data.forEach((row) => {
            const seriesName = row[1];
            const value = Number(row[2]) || 0;

            // Simple aggregation: Sum by series name
            if (!groupedData[seriesName]) {
                groupedData[seriesName] = 0;
            }
            groupedData[seriesName] += value;
        });

        return Object.entries(groupedData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
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
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            innerRadius={currentStyle.innerRadius}
                            outerRadius={currentStyle.outerRadius}
                            paddingAngle={currentStyle.paddingAngle || 0}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => {
                                const literal = features?.[1]?.literals?.find(
                                    (lit: any) => lit.name === entry.name
                                );
                                const color = literal?.color || COLORS[index % COLORS.length];
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Pie>
                        <Tooltip />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            content={<CustomLegend features={features} />}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default PieChartView;
