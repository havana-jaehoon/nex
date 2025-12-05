import React, { useState, useMemo, useRef } from "react";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    Stack,
    IconButton,
    Collapse,
    CircularProgress,
    FormControlLabel,
    Card,
    Grid,
    RadioGroup,
    Radio,
    Checkbox,
    CardContent,
} from "@mui/material";
import {
    MdRefresh,
    MdDelete,
    MdSettings,
    MdDragIndicator,
    MdArrowDropUp,
    MdArrowDropDown,
    MdSort,
} from "react-icons/md";
import { clamp } from "../../utils/util";
import { getThemeStyle } from "type/NexTheme";

// --- Feature Types Definition ---
const TYPE_CATEGORY = {
    STRING: ["STRING", "EMAIL", "PHONE", "ADDRESS"],
    NUMBER: ["NUMBER"],
    DATE: [
        "DATE",
        "TIME_SEC",
        "TIME_MSEC",
        "TIME_USEC",
        "TIME_HOUR",
        "TIMESTAMP",
    ],
    BOOLEAN: ["BOOLEAN"],
};

// --- Interfaces ---
interface FilterCondition {
    id: number;
    featureName: string;
    featureType: string;
    value1: string;
    value2: string;
    matchType: "partial" | "exact";
}

// 소팅 상태 정의
type SortDirection = "asc" | "desc" | null;
interface SortConfig {
    key: string;
    direction: SortDirection;
}

export interface CardViewProps {
    name: string;
    data: any[];
    features: any[];
    user?: any;
    theme?: any;
    onSelect?: (row: any) => void;
}

const CardView: React.FC<CardViewProps> = ({
    name,
    data,
    features,
    user,
    theme,
    onSelect,
}) => {
    // --- State ---
    const [filters, setFilters] = useState<FilterCondition[]>([]);
    const [showFieldSelector, setShowFieldSelector] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    // Layout Settings
    const [gridColumns, setGridColumns] = useState<number>(3);
    const [autoExpand, setAutoExpand] = useState<boolean>(true);
    const [cardHeight, setCardHeight] = useState<number | string>("auto");

    // Sorting State
    const [sortableFields, setSortableFields] = useState<string[]>([]); // 소팅 허용된 필드 목록
    const [currentSort, setCurrentSort] = useState<SortConfig>({
        key: "",
        direction: null,
    });

    // Drag & Drop State
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // --- Helpers ---
    const safeStringify = (value: any): string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    const style = getThemeStyle(theme, "table");
    const fontLevel = user?.fontLevel || 5;
    const contentsFontSize = style.fontSize ?? "1rem";

    // --- Handlers: Filter Management ---
    const handleToggleFilter = (featureName: string, isChecked: boolean) => {
        if (isChecked) {
            const feature = features.find((f) => f.name === featureName);
            if (!feature || filters.some((f) => f.featureName === featureName))
                return;

            const newFilter: FilterCondition = {
                id: Date.now(),
                featureName: feature.name,
                featureType: feature.featureType || "STRING",
                value1: "",
                value2: "",
                matchType: "partial",
            };
            setFilters((prev) => [...prev, newFilter]);
        } else {
            setFilters((prev) => prev.filter((f) => f.featureName !== featureName));
        }
    };

    const handleRemoveFilter = (featureName: string) => {
        setFilters((prev) => prev.filter((f) => f.featureName !== featureName));
    };

    const updateFilter = (
        id: number,
        field: keyof FilterCondition,
        value: any
    ) => {
        setFilters((prev) =>
            prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
        );
    };

    // --- Handlers: Sorting Management ---
    const handleToggleSortable = (featureName: string, isChecked: boolean) => {
        if (isChecked) {
            setSortableFields((prev) => [...prev, featureName]);
        } else {
            setSortableFields((prev) => prev.filter((f) => f !== featureName));
            // 만약 현재 정렬 중인 키가 비활성화되면 정렬 초기화
            if (currentSort.key === featureName) {
                setCurrentSort({ key: "", direction: null });
            }
        }
    };

    const handleHeaderClick = (featureName: string) => {
        // 소팅이 허용되지 않은 컬럼이면 무시
        if (!sortableFields.includes(featureName)) return;

        setCurrentSort((prev) => {
            // 다른 컬럼을 클릭했으면 해당 컬럼 오름차순 시작
            if (prev.key !== featureName) {
                return { key: featureName, direction: "asc" };
            }
            // 같은 컬럼 클릭: asc -> desc -> null (초기화)
            if (prev.direction === "asc") return { key: featureName, direction: "desc" };
            if (prev.direction === "desc") return { key: "", direction: null };
            return { key: featureName, direction: "asc" };
        });
    };

    // --- Handlers: Drag & Drop ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
        if (dragItem.current !== null && dragItem.current !== position) {
            const newFilters = [...filters];
            const draggedFilter = newFilters[dragItem.current];
            newFilters.splice(dragItem.current, 1);
            newFilters.splice(position, 0, draggedFilter);
            setFilters(newFilters);
            dragItem.current = position;
        }
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // --- Data Processing (Filter -> Sort -> Page) ---

    // 1. Filter
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (filters.length === 0) return data;

        return data.filter((row) => {
            return filters.every((filter) => {
                const featureIndex = features.findIndex((f) => f.name === filter.featureName);
                if (featureIndex === -1) return true;

                const cellValue = row[featureIndex];
                if (cellValue === null || cellValue === undefined) return false;

                if (TYPE_CATEGORY.NUMBER.includes(filter.featureType)) {
                    const numVal = Number(cellValue);
                    const min = filter.value1 ? Number(filter.value1) : -Infinity;
                    const max = filter.value2 ? Number(filter.value2) : Infinity;
                    if (isNaN(numVal)) return false;
                    return numVal >= min && numVal <= max;
                }

                if (TYPE_CATEGORY.DATE.includes(filter.featureType)) {
                    const rowDate = new Date(cellValue).getTime();
                    const startDate = filter.value1 ? new Date(filter.value1).getTime() : -Infinity;
                    const endDate = filter.value2 ? new Date(filter.value2).getTime() : Infinity;
                    if (isNaN(rowDate)) return false;
                    return rowDate >= startDate && rowDate <= endDate;
                }

                const strVal = safeStringify(cellValue).toLowerCase();
                const searchVal = filter.value1.toLowerCase();
                return filter.matchType === "exact" ? strVal === searchVal : strVal.includes(searchVal);
            });
        });
    }, [data, features, filters]);

    // 2. Sort
    const sortedData = useMemo(() => {
        // 정렬 설정이 없으면 필터된 데이터 그대로 반환 (데이터 순서)
        if (!currentSort.key || !currentSort.direction) {
            return filteredData;
        }

        const featureIndex = features.findIndex((f) => f.name === currentSort.key);
        if (featureIndex === -1) return filteredData;

        const featureType = features[featureIndex].featureType;
        const isNumber = TYPE_CATEGORY.NUMBER.includes(featureType);
        const isDate = TYPE_CATEGORY.DATE.includes(featureType);

        // 복사본을 만들어 정렬
        const targetData = [...filteredData];

        return targetData.sort((a, b) => {
            const valA = a[featureIndex];
            const valB = b[featureIndex];

            // Null handling (nulls last)
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            let compareResult = 0;

            if (isNumber) {
                compareResult = Number(valA) - Number(valB);
            } else if (isDate) {
                compareResult = new Date(valA).getTime() - new Date(valB).getTime();
            } else {
                // String comparison
                compareResult = String(valA).localeCompare(String(valB));
            }

            return currentSort.direction === "asc" ? compareResult : -compareResult;
        });
    }, [filteredData, currentSort, features]);

    // 3. Pagination (Removed - showing all sorted data)
    const visibleRows = useMemo(() => {
        return sortedData;
    }, [sortedData]);

    // --- Render Components ---
    const renderFilterInputs = (filter: FilterCondition) => {
        const isNumber = TYPE_CATEGORY.NUMBER.includes(filter.featureType);
        const isDate = TYPE_CATEGORY.DATE.includes(filter.featureType);

        if (isNumber) {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Min"
                        type="number"
                        value={filter.value1}
                        onChange={(e) => updateFilter(filter.id, "value1", e.target.value)}
                        sx={{ width: 80 }}
                        InputProps={{ sx: { fontSize: "0.875rem", p: 0 } }}
                    />
                    <Typography variant="caption">~</Typography>
                    <TextField
                        size="small"
                        placeholder="Max"
                        type="number"
                        value={filter.value2}
                        onChange={(e) => updateFilter(filter.id, "value2", e.target.value)}
                        sx={{ width: 80 }}
                        InputProps={{ sx: { fontSize: "0.875rem", p: 0 } }}
                    />
                </Stack>
            );
        }

        if (isDate) {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        type="datetime-local"
                        value={filter.value1}
                        onChange={(e) => updateFilter(filter.id, "value1", e.target.value)}
                        sx={{ width: 170 }}
                        InputProps={{ sx: { fontSize: "0.75rem", p: 0 } }}
                    />
                    <Typography variant="caption">~</Typography>
                    <TextField
                        size="small"
                        type="datetime-local"
                        value={filter.value2}
                        onChange={(e) => updateFilter(filter.id, "value2", e.target.value)}
                        sx={{ width: 170 }}
                        InputProps={{ sx: { fontSize: "0.75rem", p: 0 } }}
                    />
                </Stack>
            );
        }

        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    size="small"
                    placeholder="검색어"
                    value={filter.value1}
                    onChange={(e) => updateFilter(filter.id, "value1", e.target.value)}
                    sx={{ width: 140 }}
                    InputProps={{ sx: { fontSize: "0.875rem" } }}
                />
                <RadioGroup
                    row
                    value={filter.matchType}
                    onChange={(e) => updateFilter(filter.id, "matchType", e.target.value)}
                    sx={{ flexWrap: "nowrap" }}
                >
                    <FormControlLabel
                        value="partial"
                        control={<Radio size="small" sx={{ p: 0.5 }} />}
                        label={<Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>부분</Typography>}
                        sx={{ mr: 1, ml: 0 }}
                    />
                    <FormControlLabel
                        value="exact"
                        control={<Radio size="small" sx={{ p: 0.5 }} />}
                        label={<Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>일치</Typography>}
                        sx={{ mr: 0, ml: 0 }}
                    />
                </RadioGroup>
            </Stack>
        );
    };

    if (!features || features.length === 0) {
        return (
            <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
            </Paper>
        );
    }

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
            }}
        >
            {/* 1. Toolbar */}
            <Box sx={{ p: 1.5, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa", flexShrink: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight="bold">{name}</Typography>
                        <Typography variant="body2" color="text.secondary">({sortedData.length} items)</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant={showFieldSelector ? "contained" : "outlined"}
                            color="primary"
                            size="small"
                            startIcon={<MdSettings />}
                            onClick={() => setShowFieldSelector(!showFieldSelector)}
                            disableElevation
                        >
                            설정
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<MdRefresh />}
                            onClick={() => {
                                setFilters([]);
                                setCurrentSort({ key: "", direction: null }); // 정렬도 초기화
                            }}
                            disabled={filters.length === 0 && !currentSort.direction}
                        >
                            초기화
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* 2. Field Selector (Toggleable) - Search & Sort Config */}
            <Collapse in={showFieldSelector}>
                <Box sx={{ p: 1, borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
                    <Stack direction="row" spacing={4} sx={{ p: 1, borderBottom: "1px solid #eee" }}>
                        {/* Layout Settings */}
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" fontWeight="bold">레이아웃 설정</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    label="가로 카드 수"
                                    type="number"
                                    size="small"
                                    value={gridColumns}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        setGridColumns(clamp(val, 1, 12));
                                    }}
                                    sx={{ width: 100 }}
                                    InputProps={{ inputProps: { min: 1, max: 12 } }}
                                />
                                <TextField
                                    label="카드 높이 (px)"
                                    type="number"
                                    size="small"
                                    value={cardHeight === "auto" ? "" : cardHeight}
                                    placeholder="Auto"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCardHeight(val === "" ? "auto" : parseInt(val, 10));
                                    }}
                                    sx={{ width: 100 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={autoExpand}
                                            onChange={(e) => setAutoExpand(e.target.checked)}
                                        />
                                    }
                                    label={<Typography variant="body2">자동 확장 (데이터 적을 때)</Typography>}
                                />
                            </Stack>
                        </Stack>
                    </Stack>

                    <Typography variant="subtitle2" sx={{ p: 1, pb: 0 }} fontWeight="bold">
                        기능 설정 (검색 및 정렬)
                    </Typography>
                    <Box
                        sx={{
                            maxHeight: 180,
                            overflowY: "auto",
                            bgcolor: "#fcfcfc",
                            border: "1px solid #eee",
                            borderRadius: 1,
                            p: 1,
                            m: 1,
                        }}
                    >
                        <Grid container spacing={1}>
                            {features.map((feature) => {
                                const isSearchChecked = filters.some((f) => f.featureName === feature.name);
                                const isSortChecked = sortableFields.includes(feature.name);

                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={feature.name}>
                                        <Box sx={{ p: 1, border: "1px solid #eee", borderRadius: 1, bgcolor: "#fff" }}>
                                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                {feature.dispName || feature.name}
                                            </Typography>
                                            <Stack direction="row" spacing={2}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={isSearchChecked}
                                                            onChange={(e) => handleToggleFilter(feature.name, e.target.checked)}
                                                        />
                                                    }
                                                    label={<Typography variant="caption">검색</Typography>}
                                                    sx={{ mr: 0 }}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={isSortChecked}
                                                            onChange={(e) => handleToggleSortable(feature.name, e.target.checked)}
                                                        />
                                                    }
                                                    label={<Typography variant="caption">정렬</Typography>}
                                                    sx={{ mr: 0 }}
                                                />
                                            </Stack>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
            </Collapse>

            {/* 3. Filter Cards */}
            {filters.length > 0 && (
                <Box sx={{ p: 1, bgcolor: "#f0f2f5", borderBottom: "1px solid #e0e0e0", overflowX: "auto", flexShrink: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {filters.map((filter, index) => (
                            <Card
                                key={filter.id}
                                variant="outlined"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                sx={{
                                    flexShrink: 0,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1.5,
                                    p: 1,
                                    cursor: "grab",
                                    bgcolor: "#fff",
                                    transition: "box-shadow 0.2s",
                                    "&:hover": {
                                        boxShadow: 3,
                                        "& .delete-btn": { opacity: 1 },
                                    },
                                    "&:active": { cursor: "grabbing", boxShadow: 5 },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                    sx={{ minWidth: 80, maxWidth: 150, borderRight: "1px solid #eee", pr: 1 }}
                                >
                                    <MdDragIndicator color="#bdbdbd" />
                                    <Typography variant="subtitle2" fontWeight="bold" noWrap title={filter.featureName}>
                                        {features.find((f) => f.name === filter.featureName)?.dispName || filter.featureName}
                                    </Typography>
                                </Stack>
                                <Box>{renderFilterInputs(filter)}</Box>
                                <IconButton
                                    className="delete-btn"
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFilter(filter.featureName);
                                    }}
                                    sx={{ p: 0.5, opacity: 0, transition: "opacity 0.2s", width: 28, height: 28 }}
                                >
                                    <MdDelete fontSize="small" />
                                </IconButton>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}

            {/* 4. Card Grid Area */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2, bgcolor: "#f5f5f5" }}>
                {visibleRows.length > 0 ? (
                    <Grid container spacing={2}>
                        {visibleRows.map((row, rIdx) => {
                            const isSelected = selectedRow === row;

                            // Layout Logic
                            let targetColumns = gridColumns;
                            if (autoExpand && visibleRows.length < gridColumns) {
                                targetColumns = visibleRows.length;
                            }
                            const widthPercent = 100 / targetColumns;

                            return (
                                <Grid
                                    item
                                    key={rIdx}
                                    sx={{
                                        flexBasis: `${widthPercent}%`,
                                        maxWidth: `${widthPercent}%`,
                                        // Mobile responsiveness: stack on very small screens if columns > 1
                                        "@media (max-width: 600px)": {
                                            flexBasis: "100%",
                                            maxWidth: "100%",
                                        }
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedRow(row);
                                            if (onSelect) onSelect(row);
                                        }}
                                        sx={{
                                            height: cardHeight === "auto" ? "100%" : cardHeight,
                                            minHeight: cardHeight === "auto" ? "auto" : cardHeight,
                                            cursor: onSelect ? "pointer" : "default",
                                            borderColor: isSelected ? style.activeColor : "inherit",
                                            backgroundColor: isSelected ? style.activeBgColor : "inherit",
                                            borderWidth: isSelected ? 2 : 1,
                                            "&:hover": {
                                                boxShadow: 3,
                                                backgroundColor: isSelected
                                                    ? style.activeBgColor
                                                    : style.hoverBgColor || "#fff",
                                            },
                                            transition: "all 0.2s",
                                            overflow: "auto", // Handle content overflow if fixed height
                                        }}
                                    >
                                        <CardContent>
                                            <Stack spacing={1}>
                                                {features.map((feature, cIdx) => (
                                                    <Stack
                                                        key={cIdx}
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                        spacing={1}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ minWidth: 80, fontWeight: "bold" }}
                                                        >
                                                            {feature.dispName || feature.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                wordBreak: "break-all",
                                                                textAlign: "right",
                                                                color: isSelected ? style.activeColor : "inherit",
                                                            }}
                                                        >
                                                            {safeStringify(row[cIdx])}
                                                        </Typography>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                        <Typography>데이터가 없습니다.</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CardView;
