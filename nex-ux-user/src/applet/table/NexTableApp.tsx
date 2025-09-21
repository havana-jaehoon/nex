import React from "react";

import NexApplet, { NexAppProps } from "../NexApplet";
import { observer } from "mobx-react-lite";
import { NexDiv } from "../../component/base/NexBaseComponents";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter, TablePagination } from "@mui/material";
import { clamp } from "../../utils/util";
import { defaultThemeStyle } from "type/NexTheme";

const NexTableApp: React.FC<NexAppProps> = observer((props) => {
  const { contents, user, theme } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  const errorMsg = () => {
    if (!contents || contents?.length < 1)
      return "NexLineChartApp requires at least one store element.";

    return null;
  };

  // 1.2 Apllet 에서 사용할 contents 의 폰트 사이즈를 theme 로 부터 가져오기
  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const style = theme?.table || theme?.default || defaultThemeStyle;
  const contentsFontSize =
    style?.fontSize[clamp(fontLevel - 1, 0, style?.fontSize?.length - 1)] ||
    "1rem";

  // 1.3 Freatures 에서 feature 별 Icon, color 정보 등을 가져오기
  // 향후 구현 필요
  //console.log("## Contents:", JSON.stringify(contents, null, 2));
  const features: any[] = contents?.[0].format.features || [];
  const data = contents?.[0].csv || [];

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <NexApplet {...props} error={errorMsg()}>
      {/* 3. 기본 Apllet 의 속성 적용 */}

      {/* 4. Applet Contents 출력  */}
      <NexDiv width='100%' height='100%' fontSize={contentsFontSize}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                {features.map((feature: any, index: number) => (
                  <TableCell key={index} align='left'>
                    {feature.dispName || feature.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              ).map((row: any[], index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {row.map((cell, index) => (
                    <TableCell key={index} align='left'>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </NexDiv>
    </NexApplet>
  );
});

export default NexTableApp;
