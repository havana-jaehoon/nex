import React, { useState, useMemo, useRef } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
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
import PXIcon from "icon/pxIcon";

const rowsPerPageOptions = [10, 25, 50, 100];

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

export interface SearchingTableProps {
    visableName?: boolean;
    name: string;
    data: any[];
    features: any[];
    user?: any;
    theme?: any;
    onSelect?: (row: any) => void;
}

const SearchingTable: React.FC<SearchingTableProps> = ({
    visableName = false,
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    // Sorting State
    const [sortableFields, setSortableFields] = useState<string[]>([]);
    const [currentSort, setCurrentSort] = useState<SortConfig>({
        key: "",
        direction: null,
    });

    // Feature Config State (Reordering & Hiding)
    const [orderedFeatures, setOrderedFeatures] = useState<any[]>([]);
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);

    // Drag & Drop Refs
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const dragFeatureItem = useRef<number | null>(null);
    const dragFeatureOverItem = useRef<number | null>(null);

    // Initialize orderedFeatures when features prop changes
    React.useEffect(() => {
        setOrderedFeatures(features.map((f, i) => ({ ...f, originalIndex: i })));
    }, [features]);

    // --- Helpers ---
    const safeStringify = (value: any): string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    const style = getThemeStyle(theme, "table");
    const color = style.color ?? "#000";
    const bgColor = style.bgColor ?? "#fff";
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
        setPage(0);
    };

    const handleRemoveFilter = (featureName: string) => {
        setFilters((prev) => prev.filter((f) => f.featureName !== featureName));
        setPage(0);
    };

    const updateFilter = (
        id: number,
        field: keyof FilterCondition,
        value: any
    ) => {
        setFilters((prev) =>
            prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
        );
        setPage(0);
    };

    // --- Handlers: Sorting Management ---
    const handleToggleSortable = (featureName: string, isChecked: boolean) => {
        if (isChecked) {
            setSortableFields((prev) => [...prev, featureName]);
        } else {
            setSortableFields((prev) => prev.filter((f) => f !== featureName));
            if (currentSort.key === featureName) {
                setCurrentSort({ key: "", direction: null });
            }
        }
    };

    const handleHeaderClick = (featureName: string) => {
        if (!sortableFields.includes(featureName)) return;

        setCurrentSort((prev) => {
            if (prev.key !== featureName) {
                return { key: featureName, direction: "asc" };
            }
            if (prev.direction === "asc") return { key: featureName, direction: "desc" };
            if (prev.direction === "desc") return { key: "", direction: null };
            return { key: featureName, direction: "asc" };
        });
    };

    // --- Handlers: Visibility Management ---
    const handleToggleVisible = (featureName: string, isVisible: boolean) => {
        if (isVisible) {
            setHiddenFields((prev) => prev.filter((f) => f !== featureName));
        } else {
            setHiddenFields((prev) => [...prev, featureName]);
        }
    };

    // --- Handlers: Drag & Drop (Filters) ---
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

    // --- Handlers: Drag & Drop (Features) ---
    const handleFeatureDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragFeatureItem.current = position;
    };

    const handleFeatureDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragFeatureOverItem.current = position;
        if (dragFeatureItem.current !== null && dragFeatureItem.current !== position) {
            const newOrdered = [...orderedFeatures];
            const draggedItem = newOrdered[dragFeatureItem.current];
            newOrdered.splice(dragFeatureItem.current, 1);
            newOrdered.splice(position, 0, draggedItem);
            setOrderedFeatures(newOrdered);
            dragFeatureItem.current = position;
        }
    };

    const handleFeatureDragEnd = () => {
        dragFeatureItem.current = null;
        dragFeatureOverItem.current = null;
    };


    // --- Data Processing (Filter -> Sort -> Page) ---

    // 1. Filter
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (filters.length === 0) return data;

        return data.filter((row) => {
            return filters.every((filter) => {
                // Find index via name in original features because row data is physically ordered by original features
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
        if (!currentSort.key || !currentSort.direction) {
            return filteredData;
        }

        const featureIndex = features.findIndex((f) => f.name === currentSort.key);
        if (featureIndex === -1) return filteredData;

        const featureType = features[featureIndex].featureType;
        const isNumber = TYPE_CATEGORY.NUMBER.includes(featureType);
        const isDate = TYPE_CATEGORY.DATE.includes(featureType);

        const targetData = [...filteredData];

        return targetData.sort((a, b) => {
            const valA = a[featureIndex];
            const valB = b[featureIndex];

            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            let compareResult = 0;

            if (isNumber) {
                compareResult = Number(valA) - Number(valB);
            } else if (isDate) {
                compareResult = new Date(valA).getTime() - new Date(valB).getTime();
            } else {
                compareResult = String(valA).localeCompare(String(valB));
            }

            return currentSort.direction === "asc" ? compareResult : -compareResult;
        });
    }, [filteredData, currentSort, features]);

    // 3. Pagination
    const visibleRows = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    // --- Render Components ---
    const renderFilterInputs = (filter: FilterCondition) => {
        const isNumber = TYPE_CATEGORY.NUMBER.includes(filter.featureType);
        const isDate = TYPE_CATEGORY.DATE.includes(filter.featureType);

        if (isNumber) {
            return (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: color, backgroundColor: bgColor }}>
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

    const displayedFeatures = orderedFeatures.filter(f => !hiddenFields.includes(f.name));

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
                    {visableName && <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight="bold">{name}</Typography>
                    </Stack>}

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant={showFieldSelector ? "contained" : "outlined"}
                            color="primary"
                            size="small"
                            startIcon={<MdSettings />}
                            onClick={() => setShowFieldSelector(!showFieldSelector)}
                            disableElevation
                        >
                            필드 설정
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<MdRefresh />}
                            onClick={() => {
                                setFilters([]);
                                setPage(0);
                                setCurrentSort({ key: "", direction: null });
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
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        필드 설정 (순서 변경, 숨김, 검색 및 정렬)
                    </Typography>
                    <Box
                        sx={{
                            maxHeight: 180,
                            overflowY: "auto",
                            bgcolor: "#fcfcfc",
                            border: "1px solid #eee",
                            borderRadius: 1,
                            p: 1,
                        }}
                    >
                        <Grid container spacing={1}>
                            {orderedFeatures.map((feature, index) => {
                                const isSearchChecked = filters.some((f) => f.featureName === feature.name);
                                const isSortChecked = sortableFields.includes(feature.name);
                                const isVisible = !hiddenFields.includes(feature.name);

                                return (
                                    <Grid
                                        item
                                        xs={12} sm={6} md={4} lg={3}
                                        key={feature.name}
                                        draggable
                                        onDragStart={(e) => handleFeatureDragStart(e, index)}
                                        onDragEnter={(e) => handleFeatureDragEnter(e, index)}
                                        onDragEnd={handleFeatureDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        sx={{ cursor: 'move' }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1,
                                                border: "1px solid #eee",
                                                borderRadius: 1,
                                                bgcolor: "#fff",
                                                display: "flex",
                                                flexDirection: "column",
                                                position: "relative"
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                                <MdDragIndicator color="#bdbdbd" style={{ cursor: 'grab' }} />
                                                <Typography variant="body2" fontWeight="bold" noWrap>
                                                    {feature.dispName || feature.name}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={isVisible}
                                                            onChange={(e) => handleToggleVisible(feature.name, e.target.checked)}
                                                        />
                                                    }
                                                    label={<Typography variant="caption">보기</Typography>}
                                                    sx={{ mr: 0, ml: 0 }}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={isSearchChecked}
                                                            onChange={(e) => handleToggleFilter(feature.name, e.target.checked)}
                                                        />
                                                    }
                                                    label={<Typography variant="caption">검색</Typography>}
                                                    sx={{ mr: 0, ml: 0 }}
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
                                                    sx={{ mr: 0, ml: 0 }}
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

            {/* 4. Table Area */}
            <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {displayedFeatures.map((feature, index) => {
                                const isSortable = sortableFields.includes(feature.name);
                                const isSorted = currentSort.key === feature.name;
                                const sortDir = isSorted ? currentSort.direction : null;

                                return (
                                    <TableCell
                                        key={feature.name}
                                        align="left"
                                        onClick={() => handleHeaderClick(feature.name)}
                                        sx={{
                                            fontWeight: "bold",
                                            backgroundColor: feature.bgColor || "#f5f5f5",
                                            color: feature.color || "inherit",
                                            whiteSpace: "nowrap",
                                            cursor: isSortable ? "pointer" : "default",
                                            userSelect: "none",
                                            "&:hover": isSortable ? { backgroundColor: feature.bgColor ? feature.bgColor : "#eeeeee" } : {},
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            {feature.icon && (
                                                <PXIcon
                                                    path={feature.icon}
                                                    color={feature.color || "inherit"}
                                                    width="1rem"
                                                    height="1rem"
                                                />
                                            )}
                                            <span style={{ color: feature.color || "inherit" }}>{feature.dispName || feature.name}</span>
                                            {/* 소팅 아이콘 표시 */}
                                            {isSortable && (
                                                <Box sx={{ display: "flex", alignItems: "center", color: isSorted ? (feature.color || "primary.main") : "text.disabled" }}>
                                                    {sortDir === "asc" ? (
                                                        <MdArrowDropUp size={20} />
                                                    ) : sortDir === "desc" ? (
                                                        <MdArrowDropDown size={20} />
                                                    ) : (
                                                        <MdSort size={20} style={{ opacity: 0.3 }} />
                                                    )}
                                                </Box>
                                            )}
                                        </Stack>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.length > 0 ? (
                            visibleRows.map((row, rIdx) => {
                                const isSelected = selectedRow === row;
                                return (
                                    <TableRow
                                        hover
                                        key={rIdx}
                                        onClick={() => {
                                            setSelectedRow(row);
                                            if (onSelect) onSelect(row);
                                        }}
                                        sx={{
                                            cursor: onSelect ? "pointer" : "default",
                                            backgroundColor: isSelected ? style.activeBgColor : "inherit",
                                            "& > .MuiTableCell-root": {
                                                color: isSelected ? style.activeColor : "inherit",
                                            },
                                            "&:hover": {
                                                backgroundColor: isSelected
                                                    ? style.activeBgColor
                                                    : style.hoverBgColor || "rgba(0, 0, 0, 0.04)",
                                            },
                                        }}
                                    >
                                        {/* Render cells based on displayedFeatures order */}
                                        {displayedFeatures.map((feature: any, cIdx: number) => {
                                            // Access the data using the original index
                                            const cell = row[feature.originalIndex];

                                            const literal = feature.literals?.find((lit: any) => lit.name === cell);
                                            const displayValue = literal ? (literal.dispName || literal.name) : safeStringify(cell);

                                            const cellColor = literal?.color || feature.color || "inherit";
                                            const cellBgColor = literal?.bgColor || feature.bgColor || "inherit";
                                            const cellIcon = literal?.icon;

                                            return (
                                                <TableCell
                                                    key={feature.name}
                                                    align={
                                                        feature.align ||
                                                        (TYPE_CATEGORY.NUMBER.includes(feature.featureType)
                                                            ? "right"
                                                            : "left")
                                                    }
                                                    sx={{
                                                        color: isSelected ? style.activeColor : cellColor,
                                                        backgroundColor: isSelected ? "inherit" : cellBgColor,
                                                    }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={0.5} justifyContent={
                                                        feature.align === 'center' ? 'center' :
                                                            (feature.align === 'right' || TYPE_CATEGORY.NUMBER.includes(feature.featureType)) ? 'flex-end' : 'flex-start'
                                                    }>
                                                        {cellIcon && (
                                                            <PXIcon
                                                                path={cellIcon}
                                                                color={isSelected ? style.activeColor : cellColor}
                                                                width="1rem"
                                                                height="1rem"
                                                            />
                                                        )}
                                                        <span style={{ color: isSelected ? style.activeColor : cellColor }}>{displayValue}</span>
                                                    </Stack>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={displayedFeatures.length} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 5. Pagination */}
            <Box sx={{ borderTop: "1px solid #e0e0e0", flexShrink: 0 }}>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="페이지당 행:"
                />
            </Box>
        </Paper>
    );
};

export default SearchingTable;
