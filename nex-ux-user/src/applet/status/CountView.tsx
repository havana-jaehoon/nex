import React, { useMemo } from "react";
import { Stack, Paper, Typography } from "@mui/material";
import { NexDiv } from "../../component/base/NexBaseComponents";
import { getThemeStyle, contrastColor } from "type/NexTheme";
import { clamp } from "../../utils/util";
import PXIcon from "icon/pxIcon";

export interface CountViewProps {
    name: string;
    data: any[];
    features: any[];
    user?: any;
    theme?: any;
}

const CountView: React.FC<CountViewProps> = ({
    name,
    data,
    features,
    user,
    theme,
}) => {
    const style = getThemeStyle(theme, "table");
    const fontLevel = user?.fontLevel || 5;
    const contentsFontSize =
        style.fontSize?.[clamp(fontLevel - 1, 0, style.fontSize?.length - 1)] ||
        "1rem";

    const gap = 2;

    // Data Processing:
    // features: [ { name: "label", ... }, { name: "count", ... } ] (Expected 2 features)
    // data: [ [ "Label1", 10 ], [ "Label2", 20 ], ... ]

    // We expect the first column to be the label and the second to be the value.
    // Or we can use features to determine which is which if needed, but for now we assume index 0 is label, index 1 is value.

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                fontSize: contentsFontSize,
                p: 2,
            }}
        >

            <Stack width="100%" spacing={gap}>
                {data && data.map((row, rIdx) => {
                    const column1 = row[0];
                    const column2 = row[1];
                    // Use color from the first feature if available, or default
                    const feature = features[0];
                    //console.log(JSON.stringify(feature, null, 2));
                    const literals = (Array.isArray(feature?.literals) ? feature?.literals : []) as any[];
                    const literal = literals.find((lit: any) => lit.name === column1);
                    console.log(`column1: ${column1} Literal: ${JSON.stringify(literals, null, 2)} => ${JSON.stringify(literal, null, 2)}`);
                    const featureColor = literal?.color || "#888888";
                    const icon = <PXIcon path={literal?.icon} color={contrastColor(featureColor)} />;

                    return (
                        <NexDiv key={rIdx} direction="row" width="100%">

                            <NexDiv
                                flex="1"
                                width="50%"
                                borderRadius="0.5rem"
                                justify="center"
                                align="center"
                                bgColor={featureColor}
                                color={contrastColor(featureColor)}
                                padding="0.5rem"
                            >
                                {icon} {column1}
                            </NexDiv>
                            <NexDiv
                                flex="1"
                                width="50%"
                                justify="flex-end"
                                color={featureColor}
                                padding="0.5rem"
                                fontWeight="bold"
                            >
                                {column2}
                            </NexDiv>
                        </NexDiv>
                    );
                })}
            </Stack>
        </Paper>
    );
};

export default CountView;
