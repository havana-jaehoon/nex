import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { clamp } from "../../utils/util";
import { getThemeStyle } from "type/NexTheme";

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

const PXSearchingTable: React.FC<NexAppProps> = observer((props) => {
  const { name, contents, user, theme } = props;

  // --- State ---
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [data, setData] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

  // Sorting State
  const [sortableFields, setSortableFields] = useState<string[]>([]); // 소팅 허용된 필드 목록
  const [currentSort, setCurrentSort] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  // Drag & Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // --- Applet Setup ---
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "PXSearchingTable requires at least one store element.";
    return null;
  };

  useEffect(() => {
    const storeIndex = 0;
    const cts = contents?.[storeIndex];
    if (!cts) {
      setFeatures([]);
      setData([]);
      return;
    }
    const tdata = cts.indexes
      ? cts.indexes?.map((i: number) => cts.data[i]) || []
      : cts.data || [];

    setFeatures(cts.format.features || []);
    setData(tdata);
  }, [contents]);

  // --- Helpers ---
  const safeStringify = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const style = getThemeStyle(theme, "table");
  const fontLevel = user?.fontLevel || 5;
  const contentsFontSize =
    style?.fontSize[clamp(fontLevel - 1, 0, style?.fontSize?.length - 1)] ||
    "1rem";

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
    <NexApplet {...props} error={errorMsg()}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          fontSize: contentsFontSize,
        }}
      >
        {/* 1. Toolbar */}
        <Box sx={{ p: 1.5, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa", flexShrink: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight="bold">{name}</Typography>
              <Typography variant="body2" color="text.secondary">({sortedData.length} rows)</Typography>
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
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
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
          <Box sx={{ p: 2, bgcolor: "#f0f2f5", borderBottom: "1px solid #e0e0e0", overflowX: "auto", flexShrink: 0 }}>
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
                {features.map((feature, index) => {
                  const isSortable = sortableFields.includes(feature.name);
                  const isSorted = currentSort.key === feature.name;
                  const sortDir = isSorted ? currentSort.direction : null;

                  return (
                    <TableCell
                      key={index}
                      align="left"
                      onClick={() => handleHeaderClick(feature.name)}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f5f5f5",
                        whiteSpace: "nowrap",
                        cursor: isSortable ? "pointer" : "default",
                        userSelect: "none",
                        "&:hover": isSortable ? { backgroundColor: "#eeeeee" } : {},
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <span>{feature.dispName || feature.name}</span>
                        {/* 소팅 아이콘 표시 */}
                        {isSortable && (
                          <Box sx={{ display: "flex", alignItems: "center", color: isSorted ? "primary.main" : "text.disabled" }}>
                            {sortDir === "asc" ? (
                              <MdArrowDropUp size={20} />
                            ) : sortDir === "desc" ? (
                              <MdArrowDropDown size={20} />
                            ) : (
                              // 정렬 가능하지만 현재 정렬 안됨 (흐릿한 아이콘)
                              <MdSort size={16} style={{ opacity: 0.3 }} />
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
                visibleRows.map((row, rIdx) => (
                  <TableRow
                    hover
                    key={rIdx}
                    onClick={() => {
                      if (props.onSelect) props.onSelect(0, row);
                    }}
                    style={{ cursor: props.onSelect ? "pointer" : "default" }}
                  >
                    {row.map((cell: any, cIdx: number) => (
                      <TableCell
                        key={cIdx}
                        align={
                          features[cIdx].align ||
                          (TYPE_CATEGORY.NUMBER.includes(features[cIdx].featureType)
                            ? "right"
                            : "left")
                        }
                      >
                        {safeStringify(cell)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={features.length} align="center" sx={{ py: 6, color: "text.secondary" }}>
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
    </NexApplet>
  );
});

export default PXSearchingTable;