import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import PieChartView from "./PieChartView";
import { getThemeStyle } from "type/NexTheme";

const PXPieChartApp: React.FC<NexAppProps> = observer((props) => {
    const { contents, user, theme } = props;

    // --- Applet Setup ---
    const errorMsg = () => {
        if (!contents || contents?.length < 1)
            return "PXPieChartApp requires at least one store element.";
        return null;
    };

    const [contexts, setContexts] = useState<any[]>([]);

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
    }, [contents, ...(contents?.map((cts) => cts.store?.odata) || [])]);

    return (
        <NexApplet {...props} error={errorMsg()}>
            {contexts && contexts.map((ctx: any, index: number) => (
                <PieChartView
                    key={index}
                    name={ctx.store.name}
                    data={ctx.data}
                    features={ctx.features}
                    user={user}
                    theme={theme}
                />
            ))}
        </NexApplet>
    );
});

export default PXPieChartApp;
