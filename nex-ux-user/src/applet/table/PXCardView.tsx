import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import CardView from "./CardView";

const PXCardView: React.FC<NexAppProps> = observer((props) => {
    const { name, contents, user, theme, onSelect } = props;

    // --- Applet Setup ---
    const errorMsg = () => {
        if (!contents || contents?.length < 1)
            return "PXCardView requires at least one store element.";
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

            ctxs.push({ data: tdata, features: cts.format.features, store: cts.store })
        })

        setContexts(ctxs);
    }, [contents, ...(contents?.map((cts) => cts.store?.odata) || [])]);

    return (
        <NexApplet {...props} error={errorMsg()}>
            {contexts && contexts.map((ctx: any, index: number) => (
                <CardView
                    name={ctx.store.name}
                    data={ctx.data}
                    features={ctx.features}
                    user={user}
                    theme={theme}
                    onSelect={(row) => {
                        console.log(`onSelect() - index=${index}, row=${JSON.stringify(row)}`);
                        onSelect?.(index, row)
                    }}
                />
            ))}
        </NexApplet>
    );
});

export default PXCardView;
