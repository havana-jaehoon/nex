import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { getThemeStyle } from "type/NexTheme";
import { Button, FormControlLabel, Switch, Stack, Typography } from "@mui/material";
import ReactJson from "react-json-view";

const PXJsonEditor: React.FC<NexAppProps> = observer((props) => {
    const { contents, theme, onUpdate } = props;

    const defaultStyle = getThemeStyle(theme, "default");
    const color = defaultStyle?.color || "#393c45";
    const bgColor = defaultStyle?.bgColor || "#e8edf7";

    // State
    const [record, setRecord] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [keyCounter, setKeyCounter] = useState<number>(0); // To force re-render on content change if needed

    // Derived memo to trigger updates when content changes
    const contentsOdata = useMemo(
        () => contents?.map((c) => c.store.odata),
        [contents, ...(contents?.map((cts) => cts.store.odata) || [])]
    );

    useEffect(() => {
        if (!contents || contents.length === 0) return;

        const content = contents[0];
        const tdata = content.indexes
            ? content.indexes?.map((i: number) => content.data[i]) || []
            : content.data || [];

        if (tdata.length > 0) {
            // Clone to ensure we don't mutate store directly via reference
            // and deep copy for safety in editor
            const curRecord = JSON.parse(JSON.stringify(tdata[0]));
            setRecord(curRecord);
            setKeyCounter(k => k + 1);
        } else {
            setRecord({});
        }
    }, [contents, contentsOdata]);

    const handleJsonUpdate = (edit: any) => {
        setRecord(edit.updated_src);
        return true;
    };

    const handleSave = () => {
        if (!record) return;

        // Update logic:
        // NexNodeEditor calls onUpdate(0, newRecord). 
        // We assume we are updating the selected row (index 0 of selection).
        const bres = onUpdate?.(0, record);
        if (!bres) {
            window.alert("Data update failed or not supported by the store.");
        }
    };

    const errorMsg = () => {
        if (contents?.length < 1) return "PXJsonEditor Applet must be one or more store element.";
        return null;
    };

    return (
        <NexApplet {...props} error={errorMsg()}>
            <NexDiv
                direction="column"
                width="100%"
                height="100%"
                color={color}
                bgColor={bgColor}
                style={{ padding: "16px" }}
                overflow="hidden"
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isEditMode}
                                onChange={(e) => setIsEditMode(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body1" fontWeight="bold">
                                {isEditMode ? "편집 모드 (Edit Mode)" : "보기 모드 (View Mode)"}
                            </Typography>
                        }
                    />
                    {isEditMode && (
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{ width: "100px", height: "40px" }}
                        >
                            Update
                        </Button>
                    )}
                </Stack>

                <NexDiv
                    width="100%"
                    height="100%"
                    overflow="auto"
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "16px",
                        border: "1px solid #ddd"
                    }}
                >
                    <ReactJson
                        key={keyCounter}
                        src={record || {}}
                        theme={"rjv-default"}
                        name={null}
                        displayDataTypes={false}
                        collapsed={false}
                        onEdit={isEditMode ? handleJsonUpdate : false}
                        onAdd={isEditMode ? handleJsonUpdate : false}
                        onDelete={isEditMode ? handleJsonUpdate : false}
                        style={{ fontSize: "14px", fontFamily: "monospace" }}
                    />
                </NexDiv>
            </NexDiv>
        </NexApplet>
    );
});

export default PXJsonEditor;
