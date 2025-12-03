import React, { useState, useMemo, useEffect } from "react";
import {
  Alert,
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
  Grid,
  Typography,
  Button,
  Stack,
  IconButton,
  Collapse,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { MdSearch, MdClear, MdFilterList, MdRefresh } from "react-icons/md";
import { observer } from "mobx-react-lite";
import NexApplet, { NexAppProps } from "../NexApplet";
import { clamp } from "../../utils/util";
import { getThemeStyle } from "type/NexTheme";

const rowsPerPageOptions = [10, 25, 50, 100];

const PXSearchingTable: React.FC<NexAppProps> = observer((props) => {
  const { name, contents, user, theme } = props;

  // --- State ---
  const [searchCriteria, setSearchCriteria] = useState<{
    [key: string]: string;
  }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [showFilters, setShowFilters] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

  // --- Applet 기본 코드 ---
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
  const height = "100%";

  // --- Handlers ---
  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setPage(0);
  };

  const handleResetSearch = () => {
    setSearchCriteria({});
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row: any) => {
    if (props.onSelect) {
      // Assuming the first store is the target
      props.onSelect(0, row);
    }
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const activeCriteria = Object.entries(searchCriteria).filter(
      ([_, value]) => value
    );
    if (activeCriteria.length === 0) return data;

    return data.filter((row) => {
      return activeCriteria.every(([fieldName, searchText]) => {
        const featureIndex = features.findIndex((f) => f.name === fieldName);
        if (featureIndex === -1) return true;

        const cellValue = row[featureIndex];
        if (cellValue === null || cellValue === undefined) {
          return false;
        }

        const stringValue = safeStringify(cellValue);
        return stringValue.toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }, [data, features, searchCriteria]);

  const visibleRows = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  // --- Render ---
  if (!features || features.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e0e0e0",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          테이블 설정을 불러오는 중입니다...
        </Typography>
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
        {/* 1. Toolbar Area */}
        <Box
          sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (Total: {filteredData.length})
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                color="primary"
                size="small"
                startIcon={<MdFilterList />}
                onClick={() => setShowFilters(!showFilters)}
                disableElevation
              >
                필터
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<MdRefresh />}
                onClick={handleResetSearch}
                disabled={Object.values(searchCriteria).every((v) => !v)}
              >
                초기화
              </Button>
            </Stack>
          </Stack>

          {/* 2. Filter Inputs Area (Collapsible) */}
          <Collapse in={showFilters}>
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #ccc" }}>
              <Grid container spacing={2}>
                {features.map((feature) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={feature.name}>
                    <TextField
                      fullWidth
                      size="small"
                      label={feature.dispName || feature.name}
                      placeholder="검색어 입력"
                      value={searchCriteria[feature.name] || ""}
                      onChange={(e) =>
                        handleSearchChange(feature.name, e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MdSearch color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: searchCriteria[feature.name] ? (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleSearchChange(feature.name, "")
                              }
                            >
                              <MdClear fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </Box>

        {/* 3. Table Area */}
        <TableContainer sx={{ flex: 1, overflow: "auto" }}>
          <Table stickyHeader size="small" aria-label="searching table">
            <TableHead>
              <TableRow>
                {features.map((feature, index) => (
                  <TableCell
                    key={index}
                    align="left"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {feature.dispName || feature.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row, rIdx) => (
                  <TableRow
                    hover
                    key={rIdx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => handleRowClick(row)}
                    style={{
                      cursor: props.onSelect ? "pointer" : "default",
                    }}
                  >
                    {row.map((cell: any, cIdx: number) => {
                      const feature = features[cIdx];
                      const isNumeric =
                        feature.featureType === "number" ||
                        feature.featureType === "float";
                      const align =
                        feature.align || (isNumeric ? "right" : "left");

                      return (
                        <TableCell key={cIdx} align={align}>
                          {safeStringify(cell)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={features.length}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 4. Pagination Area */}
        <Box sx={{ borderTop: "1px solid #e0e0e0" }}>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="페이지당 행:"
          />
        </Box>
      </Paper>
    </NexApplet>
  );
});

export default PXSearchingTable;
