import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Paper,
    Typography,
    Stack,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { MdBarChart, MdShowChart, MdPieChart } from "react-icons/md";
import NexApplet, { NexAppProps } from "../NexApplet";
import BarChartView from "./BarChartView";
import LineChartView from "./LineChartView";
import PieChartView from "./PieChartView";

type ChartType = "bar" | "line" | "pie";

const PXBaseChart: React.FC<NexAppProps> = observer((props) => {
    const { contents, user, theme } = props;

    // --- Applet Setup ---
    const errorMsg = () => {
        if (!contents || contents?.length < 1)
            return "PXBaseChart requires at least one store element.";
        return null;
    };

    const [contexts, setContexts] = useState<any[]>([]);
    const [chartType, setChartType] = useState<ChartType>("bar");

    useEffect(() => {
        if (!contents || contents?.length < 1) return;

        const ctxs: any[] = [];
        contents.forEach((cts: any) => {
            const tdata = cts.indexes
                ? cts.indexes?.map((i: number) => cts.data[i]) || []
                : cts.data || [];

            ctxs.push({ data: tdata, features: cts.format.features, store: cts.store });
        });

        setContexts(ctxs);
    }, [contents, ...(contents?.map((cts: any) => cts.store?.odata) || [])]);

    const handleChartTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: ChartType | null
    ) => {
        if (newType !== null) {
            setChartType(newType);
        }
    };

    const renderChart = (ctx: any, index: number) => {
        const commonProps = {
            key: index,
            name: ctx.store.name,
            data: ctx.data,
            features: ctx.features,
            user: user,
            theme: theme,
        };

        switch (chartType) {
            case "line":
                return <LineChartView {...commonProps} />;
            case "pie":
                return <PieChartView {...commonProps} />;
            case "bar":
            default:
                return <BarChartView {...commonProps} />;
        }
    };

    return (
        <NexApplet {...props} error={errorMsg()}>
            <Paper elevation={0} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
                {/* Toolbar for Chart Type Selection */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChartTypeChange}
                        aria-label="chart type"
                        size="small"
                        sx={{ height: 32 }}
                    >
                        <ToggleButton value="bar" aria-label="bar chart">
                            <MdBarChart size={20} />
                        </ToggleButton>
                        <ToggleButton value="line" aria-label="line chart">
                            <MdShowChart size={20} />
                        </ToggleButton>
                        <ToggleButton value="pie" aria-label="pie chart">
                            <MdPieChart size={20} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Chart Area */}
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                    {contexts && contexts.map((ctx: any, index: number) => (
                        <Box key={index} sx={{ width: "100%", height: "100%" }}>
                            {renderChart(ctx, index)}
                        </Box>
                    ))}
                </Box>
            </Paper>
        </NexApplet>
    );
});

export default PXBaseChart;
