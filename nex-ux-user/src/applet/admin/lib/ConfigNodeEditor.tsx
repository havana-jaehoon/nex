import React, { useEffect, useMemo, useState } from "react";
import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import { NexFeatureType, NexNodeType } from "type/NexNode";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { adminNodeDefs, getAdminNodeFromFeatures } from "./adminDataFormat";
import {
    MdAdd,
    MdArrowDropDown,
    MdArrowDropUp,
    MdArrowLeft,
    MdArrowRight,
    MdDelete,
    MdKeyboardArrowDown,
    MdKeyboardArrowRight,
    MdOutlineResetTv,
    MdRemove,
    MdUpdate,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { defaultThemeStyle, NexThemeStyle } from "type/NexTheme";
import { pxIconList } from "icon/pxIcon";
import { appletPathList, appletPathMap } from "applet/nexApplets";


// ===== Constants =====
const gridMidSpacing = 3;
const gridMidColumns = 12;

// ===== Interfaces =====
export interface LiteralItem {
    name: string;
    dispName: string;
    icon: string | null;
    color: string | null;
}

interface ItemInputProps {
    name: string;
    dispName: string;
    value: any;
    argPath: string[];
    featureType: any;
    nodes: any;
    nodePaths: any;
    onChange: (
        argPath: string[],
        featureType: NexFeatureType,
        value: any
    ) => void;
}

interface SelectProps {
    name: string;
    dispName: string;
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    literals: LiteralItem[];
}

interface RecordsEditorProps {
    id: string;
    name: string;
    dispName: string;
    placeholder?: string;
    nodes: any;
    nodePaths: any;
    rows: any[];
    setRows: (rows: any[]) => void;
    recordFields?: any[];
    argPath: string[];
    renderFeature: (feature: any, path?: string[]) => React.ReactNode;
}

export interface ConfigNodeEditorProps {
    node: any;
    fontLevel?: number;
    themeStyle?: NexThemeStyle;
    nodes: any;
    nodePaths: any;
    onAdd?(data: any): void;
    onUpdate?(data: any): void;
    onCancel?(): void;
}

// ===== Helpers =====
function setDeep(obj: any, path: string[], value: any) {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const k = path[i];
        if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
        cur = cur[k];
    }
    cur[path[path.length - 1]] = value;
}

function getAtPath(obj: any, path: string[]) {
    return path.reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function isNumber(featureType: NexFeatureType) {
    return featureType === NexFeatureType.NUMBER;
}

function asFeatureValue(value: any, featureType: NexFeatureType) {
    if (featureType === NexFeatureType.STRING) return String(value);
    if (featureType === NexFeatureType.BOOLEAN) return Boolean(value);
    if (featureType === NexFeatureType.NUMBER) {
        if (value === "" || value == null) return "";
        return Number(value);
    }
    return value;
}

// ===== UI Components =====

const ItemInput: React.FC<ItemInputProps> = ({
    name,
    dispName,
    value,
    argPath,
    featureType,
    nodes,
    nodePaths,
    onChange,
}) => {
    const [systemName, setSystemName] = useState<string>("");
    const [pathValue, setPathValue] = useState<string>("");
    const [nodeValue, setNodeValue] = useState<string>("");

    const pathSelections = useMemo(() => {
        if (name === "icon") return null;
        if (name === "sources") {
            return nodePaths["element"] ? nodePaths["element"][systemName] : null;
        }
        if (name === NexNodeType.APPLET) {
            return appletPathList;
        }
        return nodePaths[name]
            ? nodePaths[name][systemName]
                ? nodePaths[name][systemName]
                : null
            : null;
    }, [name, systemName, nodePaths]);

    const nodeSelections = useMemo(() => {
        if (name === "icon") return pxIconList;
        if (name === "sources") {
            return nodes["element"]
                ? nodes["element"][systemName]
                    ? nodes["element"][systemName][pathValue]
                        ? nodes["element"][systemName][pathValue]
                        : null
                    : null
                : null;
        }

        if (name === NexNodeType.APPLET) {
            return appletPathMap[pathValue] ? appletPathMap[pathValue] : null;
        }

        return nodes[name]
            ? nodes[name][systemName]
                ? nodes[name][systemName][pathValue]
                    ? nodes[name][systemName][pathValue]
                    : null
                : null
            : null;
    }, [name, systemName, pathValue, nodes]);

    const systemSelections = nodes["system"]
        ? nodes["system"][""]
            ? nodes["system"][""][""]
            : null
        : null;

    useEffect(() => {
        if (name === "sources") {
            const sysName = value ? value.split(":")[0] : "";
            const elPath = value ? value.split(":")[1] : "";
            const parentPath = elPath.split("/").slice(0, -1).join("/");
            const nodeName = elPath.split("/").slice(-1)[0];
            setSystemName(sysName);
            setPathValue(parentPath);
            setNodeValue(nodeName);
        } else if (name === NexNodeType.SYSTEM || name === "icon") {
            setNodeValue(value);
        } else if (name === NexNodeType.STORAGE) {
            const nodeName = `/${value.split("/").slice(-1)[0]}`;
            setNodeValue(nodeName);
        } else if (name === NexNodeType.ELEMENT) {
            const parentPath = value.split("/").slice(0, -1).join("/");
            const nodeName = value.split("/").slice(-1)[0];
            setSystemName("webclient");
            setPathValue(parentPath);
            setNodeValue(nodeName);
        } else if (
            [
                NexNodeType.FORMAT,
                NexNodeType.STORE,
                NexNodeType.PROCESSOR,
                NexNodeType.CONTENTS,
                NexNodeType.APPLET,
                NexNodeType.THEME,
            ].includes(name as NexNodeType)
        ) {
            const parentPath = value.split("/").slice(0, -1).join("/");
            const nodeName = value.split("/").slice(-1)[0];
            setPathValue(parentPath);
            setNodeValue(nodeName);
        }
    }, [value, name]);

    if (name === "sources") {
        return (
            <Stack direction="row" spacing={1} width="100%">
                {systemSelections && (
                    <TextField
                        select
                        label={`system`}
                        variant="standard"
                        value={systemName}
                        onChange={(e) => onChange(argPath, featureType, `${e.target.value}:`)}
                        style={{ flex: 1, width: "50%" }}
                    >
                        {systemSelections.map((item: any, index: number) => (
                            <MenuItem key={index} value={item.name}>
                                {item.helper}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {pathSelections ? (
                    <TextField
                        select
                        label={`${dispName} 경로`}
                        variant="standard"
                        value={pathValue}
                        onChange={(e) => {
                            const outValue = e.target.value === "" ? "" : `${systemName}:${e.target.value}/`;
                            onChange(argPath, featureType, outValue);
                        }}
                        style={{ flex: 1, width: "50%" }}
                    >
                        {pathSelections.map((item: any, index: number) => (
                            <MenuItem key={index} value={item.path}>
                                {`${item.helper} ${item.name} ${item.path}`}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <TextField
                        disabled
                        label={`${dispName} 경로`}
                        variant="standard"
                        value={pathValue}
                        style={{ flex: 1, width: "50%" }}
                    />
                )}
                {nodeSelections ? (
                    <TextField
                        select
                        label={`${dispName} 이름`}
                        variant="standard"
                        value={nodeValue}
                        onChange={(e) => {
                            const outValue =
                                pathValue === ""
                                    ? e.target.value
                                    : `${systemName}:${pathValue}/${e.target.value}`;
                            onChange(argPath, featureType, outValue);
                        }}
                        style={{ flex: 1, width: "50%" }}
                    >
                        {nodeSelections.map((item: any, index: number) => (
                            <MenuItem key={index} value={item.name}>
                                {item.helper}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <TextField
                        disabled
                        label={`${dispName} 이름`}
                        variant="standard"
                        value={nodeValue}
                        style={{ flex: 1, width: "50%" }}
                    />
                )}
            </Stack>
        );
    }

    if (name === NexNodeType.SYSTEM || name === "icon") {
        return nodeSelections ? (
            <TextField
                select
                label={`${dispName} 이름`}
                variant="standard"
                value={nodeValue}
                onChange={(e) => onChange(argPath, featureType, e.target.value)}
                style={{ flex: 1, width: "100%" }}
            >
                {nodeSelections.map((item: any, index: number) => (
                    <MenuItem key={index} value={item.name}>
                        {item.helper}
                    </MenuItem>
                ))}
            </TextField>
        ) : (
            <>{`${dispName} 데이터가 없습니다.`}</>
        );
    }

    if (
        [
            NexNodeType.FORMAT,
            NexNodeType.STORE,
            NexNodeType.PROCESSOR,
            NexNodeType.ELEMENT,
            NexNodeType.STORAGE,
            NexNodeType.CONTENTS,
            NexNodeType.APPLET,
            NexNodeType.THEME,
        ].includes(name as NexNodeType)
    ) {
        return (
            <Stack direction="row" spacing={1} width="100%">
                {pathSelections && (
                    <TextField
                        select
                        label={`${dispName} 경로`}
                        variant="standard"
                        value={pathValue ?? ""}
                        onChange={(e) => {
                            const outValue = e.target.value === "" ? "" : `${e.target.value}/`;
                            onChange(argPath, featureType, outValue);
                        }}
                        style={{ flex: 1, width: "50%" }}
                    >
                        {pathSelections.map((item: any) => (
                            <MenuItem key={item.path} value={item.path}>
                                {item.helper}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {nodeSelections ? (
                    <TextField
                        select
                        label={`${dispName} 이름`}
                        variant="standard"
                        value={nodeValue ?? ""}
                        onChange={(e) => {
                            const outValue =
                                pathValue === ""
                                    ? e.target.value
                                    : `${pathValue}/${e.target.value}`;
                            setNodeValue(e.target.value);
                            onChange(argPath, featureType, outValue);
                        }}
                        style={{ flex: 1, width: "50%" }}
                    >
                        {nodeSelections.map((item: any, index: number) => (
                            <MenuItem key={index} value={item.name}>
                                {item.helper}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <TextField
                        disabled
                        label={`${dispName} 이름`}
                        variant="standard"
                        value={""}
                        style={{ flex: 1, width: "50%" }}
                    />
                )}
            </Stack>
        );
    }

    if (featureType === NexFeatureType.BOOLEAN) {
        const checked = value === true || value === "true";
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={(e) => onChange(argPath, featureType, e.target.checked)}
                    />
                }
                label={dispName}
            />
        );
    }

    return (
        <TextField
            variant="standard"
            label={dispName}
            type={featureType === NexFeatureType.NUMBER_ARRAY ? "number" : "text"}
            value={value ?? ""}
            style={{ flex: 1, width: "100%" }}
            onChange={(e) => onChange(argPath, featureType, e.target.value)}
        />
    );
};

const LabeledSelect: React.FC<SelectProps> = ({
    name,
    dispName,
    placeholder,
    value,
    onChange,
    literals,
}) => {
    if (literals.length === 0) return null;

    const isValid = value === "" || literals.some((litObj) => litObj.name === value);

    if (!isValid) {
        console.warn(
            `LabeledSelect: invalid value: name=${dispName}(${name}), value=${value}`
        );
    }

    return (
        <FormControl title={placeholder} variant="standard" sx={{ width: "100%" }}>
            <Select
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                label={dispName}
                style={{ width: "100%" }}
            >
                {literals.map((litObj, index) => (
                    <MenuItem key={index} value={litObj.name}>
                        {litObj.dispName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

interface RecordRowProps {
    rIdx: number;
    row: any;
    recordFields: any[];
    gridMidSpacing: number;
    gridMidColumns: number;
    id: string;
    nodes: any;
    nodePaths: any;
    argPath: string[];
    renderFeature: any;
    addRow: (index: number) => void;
    removeRow: (index: number) => void;
    moveRow: (index: number, direction: 'up' | 'down') => void;
    setRows: (newNestedRow: any) => void;
    onFieldChange: (fieldName: string, value: any) => void;
}

function RecordRow({
    rIdx,
    row,
    recordFields,
    gridMidSpacing,
    gridMidColumns,
    id,
    nodes,
    nodePaths,
    argPath,
    renderFeature,
    addRow,
    removeRow,
    moveRow,
    setRows,
    onFieldChange,
}: RecordRowProps) {
    const [expanded, setExpanded] = useState(true);

    return (
        <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
                borderRadius: 1,
                borderLeft: "1px solid #EFEFEF",
                borderRight: "1px solid #EFEFEF",
                "&:hover": {
                    border: "1px solid #AAAAAA",
                },
            }}
        >
            <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" bgcolor="#EFEFEF" onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer" }}>
                <Stack spacing={0.5} direction="row" flex={1}>
                    <Typography variant="body2" fontWeight="bold" alignContent="center">{rIdx + 1} : </Typography>
                    <Typography variant="body2" fontWeight="bold" alignContent="center">{row.dispName || row.name}</Typography>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                        title={expanded ? "숨기기" : "보이기"}
                    >
                        {expanded ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                    <IconButton
                        title="위로 이동"
                        onClick={(e) => {
                            e.stopPropagation();
                            moveRow(rIdx, 'up');
                        }}
                        size="small"
                    >
                        <MdArrowDropUp fontSize="large" />
                    </IconButton>
                    <IconButton
                        title="아래로 이동"
                        onClick={(e) => {
                            e.stopPropagation();
                            moveRow(rIdx, 'down');
                        }}
                        size="small"
                    >
                        <MdArrowDropDown fontSize="large" />
                    </IconButton>
                </Stack>
                <Stack spacing={0.5} direction="row" flex={1} justifyContent="flex-end">
                    <IconButton
                        title="삽입"
                        onClick={(e) => {
                            e.stopPropagation();
                            addRow(rIdx);
                        }}
                        size="small"
                    >
                        <MdAdd fontSize="large" />
                    </IconButton>
                    <IconButton
                        title="삭제"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeRow(rIdx);
                        }}
                        size="small"
                    >
                        <MdRemove fontSize="large" />
                    </IconButton>
                </Stack>
            </Box>
            {expanded && (
                <Box padding={1}>
                    <Grid
                        container
                        rowSpacing={0.5}
                        columnSpacing={gridMidSpacing}
                        columns={gridMidColumns}
                        alignItems="flex-end"
                    >
                        {recordFields.map((f: any, i: number) => {
                            const size = (f as any).uxSize || 12;

                            if (f.featureType === NexFeatureType.RECORDS) {
                                return (
                                    <Grid item key={i} xs={size}>
                                        <RecordsEditor
                                            id={`${id}.${rIdx}.${f.name}`}
                                            name={f.name}
                                            dispName={f.dispName || f.name}
                                            placeholder={(f as any).description}
                                            nodes={nodes}
                                            nodePaths={nodePaths}
                                            rows={row[f.name] || []}
                                            setRows={(newNestedRows: any) => {
                                                const next = { ...row, [f.name]: newNestedRows };
                                                setRows(next);
                                            }}
                                            recordFields={(f as any).records}
                                            argPath={[...argPath, rIdx.toString(), f.name]}
                                            renderFeature={renderFeature}
                                        />
                                    </Grid>
                                );
                            }

                            if (
                                (f.featureType === NexFeatureType.LITERALS || f.featureType === NexFeatureType.STRING) &&
                                f.literals &&
                                f.literals.length > 0
                            ) {
                                return (
                                    <Grid item key={i} xs={size}>
                                        <LabeledSelect
                                            name={f.name}
                                            dispName={f.dispName || f.name}
                                            value={row[f.name] ?? ""}
                                            literals={f.literals || []}
                                            onChange={(value) => onFieldChange(f.name, value)}
                                        />
                                    </Grid>
                                );
                            }

                            return (
                                <Grid item key={i} xs={size}>
                                    <ItemInput
                                        name={f.name}
                                        dispName={f.dispName || f.name}
                                        value={row[f.name] ?? ""}
                                        featureType={f.featureType}
                                        argPath={argPath}
                                        nodes={nodes}
                                        nodePaths={nodePaths}
                                        onChange={(argPath, featureType, value) => onFieldChange(f.name, value)}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

function RecordsEditor({
    id,
    name,
    dispName,
    placeholder,
    nodes,
    nodePaths,
    rows,
    setRows,
    recordFields,
    renderFeature,
    argPath,
}: RecordsEditorProps) {
    const addRow = (index: number) => {
        if (recordFields && recordFields.length > 0) {
            const base: any = {};
            for (const f of recordFields) {
                if ((f as any).featureType === NexFeatureType.ATTRIBUTES) {
                    base[f.name] = getAdminNodeFromFeatures((f as any).attributes);
                } else if ((f as any).featureType === NexFeatureType.RECORDS) {
                    base[f.name] = [];
                } else {
                    base[f.name] = "";
                }
            }
            let next = [...(rows || [])];
            if (index === -1) {
                next.push(base);
            } else {
                next.splice(index, 0, base);
            }
            setRows(next);
        } else {
            let next = [...(rows || [])];
            if (index === -1) {
                next.push("");
            } else {
                next.splice(index, 0, "");
            }
            setRows(next);
        }
    };

    const removeRow = (idx: number) => {
        const next = [...(rows || [])];
        next.splice(idx, 1);
        setRows(next);
    };

    const moveRow = (idx: number, direction: 'up' | 'down') => {
        if (!rows) return;
        if (direction === 'up' && idx <= 0) return;
        if (direction === 'down' && idx >= rows.length - 1) return;

        const next = [...rows];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        [next[targetIdx], next[idx]] = [next[idx], next[targetIdx]];
        setRows(next);
    };

    const [expanded, setExpanded] = useState(true);

    return (
        <NexDiv width="100%" direction="column">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {dispName}
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    title={expanded ? "숨기기" : "보이기"}
                >
                    {expanded ? <MdVisibilityOff /> : <MdVisibility />}
                </IconButton>
            </Stack>
            {expanded && recordFields && (
                <Stack spacing={1.5} width="100%" direction="column" >
                    {rows && rows.map((row: any, rIdx: number) => (
                        <RecordRow
                            key={rIdx}
                            rIdx={rIdx}
                            row={row}
                            recordFields={recordFields}
                            gridMidSpacing={gridMidSpacing}
                            gridMidColumns={gridMidColumns}
                            id={id}
                            nodes={nodes}
                            nodePaths={nodePaths}
                            argPath={argPath}
                            renderFeature={renderFeature}
                            addRow={addRow}
                            removeRow={removeRow}
                            moveRow={moveRow}
                            setRows={(newNestedRow) => {
                                const next = [...rows];
                                next[rIdx] = newNestedRow;
                                setRows(next);
                            }}
                            onFieldChange={(fieldName, value) => {
                                const next = [...rows];
                                next[rIdx] = { ...next[rIdx], [fieldName]: value };
                                setRows(next);
                            }}
                        />
                    ))}
                    <NexDiv width="100%" direction="row">
                        <Button
                            title="추가"
                            variant="contained"
                            onClick={() => addRow(-1)}
                            size="small"
                            startIcon={<MdAdd />}
                            sx={{ width: "100%", color: "#2E2E2E", backgroundColor: "#EFEFEF", "&:hover": { backgroundColor: "#CCCCCC" } }}
                        >
                            추가
                        </Button>
                    </NexDiv>
                </Stack>
            )}
        </NexDiv>
    );
};
const ConfigNodeEditor: React.FC<ConfigNodeEditorProps> = (props) => {
    const {
        node,
        nodes,
        nodePaths,
        themeStyle,
        onUpdate,
        onAdd,
    } = props;

    const [orgNode, setOrgNode] = useState<any>(null);
    const [format, setFormat] = useState<any>(null);
    const [features, setFeatures] = useState<any>(null);
    const [editingNode, setEditingNode] = useState<any>(null);
    const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const tformat = node ? adminNodeDefs[node.type as NexNodeType] : null;
        const tfeatures = tformat?.features || [];

        // Merge the node with the template format
        const tNode = getAdminNodeFromFeatures(tfeatures);
        const next = { ...tNode, ...node };

        setOrgNode(next);
        setEditingNode(next);
        setFormat(tformat);
        setFeatures(tfeatures);
    }, [node]);

    //console.log("ConfigNodeEditor: themeStyle=", JSON.stringify(themeStyle, null, 2));
    const fontSize = themeStyle?.fontSize || "1rem";
    const color = themeStyle?.color;
    const bgColor = themeStyle?.bgColor;

    const handleReset = () => {
        setEditingNode(orgNode);
    };

    const handleAdd = () => {
        onAdd?.(editingNode);
    };

    const handleUpdate = () => {
        onUpdate?.(editingNode);
    };

    const handlePrimitiveChange = (
        argPath: string[],
        featureType: NexFeatureType,
        raw: any
    ) => {
        const next = { ...editingNode };
        const value = asFeatureValue(raw, featureType);
        setDeep(next, argPath, value);
        setEditingNode(next);
    };

    const handleLiteralChange = (argPath: string[], raw: string) => {
        const next = { ...editingNode };
        setDeep(next, argPath, raw);
        setEditingNode(next);
    };

    const handleRecordsChange = (argPath: string[], rows: any[]) => {
        const next = { ...editingNode };
        setDeep(next, argPath, rows);
        setEditingNode(next);
    };

    const toggleSubItem = (key: string) => {
        const open = !(isOpen[key] !== false);
        setIsOpen({ ...isOpen, [key]: open });
    };

    const iconSubItem = (id: string, name: string, dispName: string) => (
        <NexDiv
            direction="row"
            align="center"
            justify="space-between"
            onClick={() => toggleSubItem(id)}
            cursor="pointer"
            width="100%"
        >
            <NexLabel fontSize={fontSize}>{dispName}</NexLabel>
            <NexDiv align="end">
                {isOpen[id] !== false ? (
                    <MdKeyboardArrowDown />
                ) : (
                    <MdKeyboardArrowRight />
                )}
            </NexDiv>
        </NexDiv>
    );

    const renderFeature = (feature: any, parentPath: string[] = []) => {
        const argPath = [...parentPath, feature.name];
        const id = argPath.join(".");
        const name = feature.name;
        const dispName = feature.dispName || feature.name;
        const placeholder = (feature as any).description || feature.dispName || undefined;

        if (feature.featureType === NexFeatureType.ATTRIBUTES) {
            return (
                <Box
                    key={id}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        borderRadius: 1,
                        borderLeft: "1px solid #EFEFEF",
                        borderRight: "1px solid #EFEFEF",
                        "&:hover": {
                            border: "1px solid #AAAAAA",
                        },
                    }}
                >
                    <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" bgcolor="#EFEFEF" onClick={() => toggleSubItem(id)} style={{ cursor: "pointer" }}>
                        <Typography variant="body2" fontWeight="bold" alignContent="center">{dispName}</Typography>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSubItem(id);
                            }}
                            title={isOpen[id] ? "숨기기" : "보이기"}
                        >
                            {isOpen[id] ? <MdVisibilityOff /> : <MdVisibility />}
                        </IconButton>

                    </Box>
                    {isOpen[id] !== false &&
                        <Stack
                            spacing={0.5}
                            direction="column"
                            width="100%"
                            paddingLeft={fontSize}
                        >
                            {feature.attributes.map((child: any) =>
                                renderFeature(child, argPath)
                            )}
                        </Stack>}
                </Box>
            );
        }

        if (feature.featureType === NexFeatureType.LITERALS) {
            const value = String(getAtPath(editingNode, argPath) ?? "");
            return (
                <NexDiv key={id} width="100%" align="flex-end">
                    <LabeledSelect
                        key={id}
                        name={name}
                        dispName={dispName}
                        placeholder={placeholder}
                        value={value}
                        literals={feature.literals || []}
                        onChange={(v) => handleLiteralChange(argPath, v)}
                    />
                </NexDiv>
            );
        }

        if (feature.featureType === NexFeatureType.RECORDS) {
            const rows = (getAtPath(editingNode, argPath) as any[]) || [];
            return (
                <NexDiv key={id} width="100%">
                    <RecordsEditor
                        key={id}
                        nodes={nodes}
                        nodePaths={nodePaths}
                        id={id}
                        name={name}
                        dispName={dispName}
                        placeholder={placeholder}
                        rows={rows}
                        setRows={(r) => handleRecordsChange(argPath, r)}
                        recordFields={feature.records}
                        argPath={argPath}
                        renderFeature={renderFeature}
                    />
                </NexDiv>
            );
        }

        if (
            feature.featureType === NexFeatureType.STRING_ARRAY ||
            feature.featureType === NexFeatureType.NUMBER_ARRAY
        ) {
            const arr = (getAtPath(editingNode, argPath) as any[]) &&
                Array.isArray(getAtPath(editingNode, argPath))
                ? (getAtPath(editingNode, argPath) as any[])
                : [];

            const updateArray = (nextArr: any[]) => {
                const nextNode = { ...editingNode };
                setDeep(nextNode, argPath, nextArr);
                setEditingNode(nextNode);
            };

            const updateItem = (idx: number, raw: string) => {
                const nextArr = [...arr];
                nextArr[idx] = feature.featureType === NexFeatureType.NUMBER_ARRAY
                    ? (raw === "" ? "" : Number(raw))
                    : raw;
                updateArray(nextArr);
            };

            const addItem = () => {
                updateArray([...arr, feature.featureType === NexFeatureType.NUMBER_ARRAY ? "" : ""]);
            };

            const removeItem = (idx: number) => {
                const nextArr = arr.filter((_, i) => i !== idx);
                updateArray(nextArr);
            };

            return (
                <NexDiv key={id} width="100%" direction="column">
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        {dispName}
                    </Typography>
                    <Stack spacing={0.5} direction="column" width="100%">
                        {arr.map((v, i) => (
                            <Stack
                                key={`${id}.${i}`}
                                spacing={0.5}
                                direction="row"
                                alignItems="flex-end"
                            >
                                <ItemInput
                                    name={name}
                                    dispName={dispName}
                                    value={v}
                                    argPath={argPath}
                                    featureType={feature.featureType}
                                    nodes={nodes}
                                    nodePaths={nodePaths}
                                    onChange={(argPath, featureType, newValue) => updateItem(i, newValue)}
                                />
                                <IconButton
                                    size="small"
                                    title="삭제"
                                    onClick={() => removeItem(i)}
                                    sx={{ border: "1px solid gray", borderRadius: 1 }}
                                >
                                    <MdDelete fontSize="1rem" />
                                </IconButton>
                            </Stack>
                        ))}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={addItem}
                            startIcon={<MdAdd />}
                            sx={{ alignSelf: "flex-start" }}
                        >
                            추가
                        </Button>
                    </Stack>
                </NexDiv>
            );
        }

        // Primitive (STRING / UINT32)
        const value = getAtPath(editingNode, argPath) ?? "";

        return (
            <ItemInput
                key={id}
                name={name}
                dispName={dispName}
                value={value}
                argPath={argPath}
                featureType={feature.featureType}
                nodes={nodes}
                nodePaths={nodePaths}
                onChange={handlePrimitiveChange}
            />
        );
    };

    const headFields = () => (
        <NexDiv width="100%" direction="column">
            <span style={{ height: fontSize }} />
        </NexDiv>
    );

    const bodyFields = () => (
        <Grid container spacing={3} width="100%" alignItems="flex-end">
            {features &&
                features.map((f: any) => {
                    const size = (f as any).uxSize || 12;
                    return (
                        <Grid item key={f.name} xs={"auto"} sm={"auto"} md={size}>
                            {renderFeature(f)}
                        </Grid>
                    );
                })}
        </Grid>
    );

    const tailFields = () => (
        <Stack
            spacing={2}
            direction="row"
            width="100%"
            alignContent="end"
            alignItems="center"
            justifyContent="end"
        >
            {onUpdate && (
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => handleUpdate()}
                    sx={{ flex: 3 }}
                    startIcon={<MdUpdate />}
                >
                    업데이트
                </Button>
            )}

            {onAdd && (
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => handleAdd()}
                    sx={{ flex: 3 }}
                    startIcon={<MdAdd />}
                >
                    추가
                </Button>
            )}

            <Button
                size="large"
                variant="contained"
                onClick={() => handleReset()}
                sx={{ flex: 3 }}
                startIcon={<MdOutlineResetTv />}
            >
                초기화
            </Button>
        </Stack>
    );

    return (
        <NexDiv
            direction="column"
            width="100%"
            height="100%"
            bgColor={true ? "white" : bgColor}
            color={color}
            fontSize={fontSize}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Stack
                    spacing={2}
                    direction="column"
                    width="100%"
                    height="100%"
                    style={{ minHeight: 0 }}
                >

                    <NexDiv width="100%">{headFields()}</NexDiv>
                    <Box width="100%" height="100%" overflow="auto" borderRadius={2} bgcolor={bgColor}>
                        {bodyFields()}
                    </Box>
                    <NexDiv width="100%" align="flex-end" justify="flex-end">
                        {tailFields()}
                    </NexDiv>
                </Stack>
            </form>
        </NexDiv>
    );
};

export default ConfigNodeEditor;
