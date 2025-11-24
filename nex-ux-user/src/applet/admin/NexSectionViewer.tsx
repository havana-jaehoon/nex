import React, { useEffect, useMemo, useState } from "react";
import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";
import { buildAdminConfig } from "applet/NexConfigStore";
import NexPagePreviewer from "./lib/NexPagePreviewer";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowLeft,
  MdArrowRight,
  MdCancel,
} from "react-icons/md";

import axios from "axios";
import pxConfig from "config/px-config.json";
import { NexNodeType } from "type/NexNode";
import { getAdminNodeFromType } from "./lib/adminDataFormat";

const NexSectionViewer: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate, onSelect, onAdd, onRemove } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isPreview, setPreviewMode] = useState<boolean>(false);
  const [isMouseEnter, setMouseEnter] = useState(false);
  const [isFocus, setFocus] = useState(false);
  //const [section, setSection] = useState<any>(null);

  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [routeList, setRouteList] = useState<string[]>([]);
  const [route, setRoute] = useState<string>("");
  // 1. Apllet 의 기본 적인 코드
  // 1.1 NexApplet 의 데이터 유형 체크
  //console.log("NexNodeEditor: stores=", JSON.stringify(stores, null, 2));
  const errorMsg = () => {
    // check isTree, volatility, features.length ...
    if (contents?.length !== 1)
      return "NexNodeEditor must be one store element.";
    return null;
  };

  const defaultStyle = getThemeStyle(theme, "default");
  const style = getThemeStyle(theme, "applet");

  const fontLevel = user?.fontLevel || 5; // Default font level if not provided
  const fontSize =
    defaultStyle?.fontSize[
      clamp(fontLevel - 1, 0, defaultStyle?.fontSize?.length - 1)
    ] || "1rem";

  const color = defaultStyle?.colors[0] || "#393c45";
  const bgColor = defaultStyle?.bgColors[0] || "#e8edf7";

  const storeIndex = 0; // only 1 store
  const [data, setData] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  // Memoize derived dependency to satisfy React Hooks lint rule

  useEffect(() => {
    const cts = contents?.[storeIndex];
    if (!cts || !cts.store) {
      setFeatures([]);
      setData(null);
      return;
    }

    const tdata = cts.indexes
      ? cts.indexes?.map((i: number) => cts.data[i]) || []
      : cts.data || [];

    //const treeData = buildAdminConfig(tdata);
    setData(tdata);
    setFeatures(cts.format?.features || []);
    // routeList 작성 (부모 경로와 상대 경로를 결합하도록 수정)

    //console.log("NexSectionViewer routeList:", JSON.stringify(rlist, null, 2));
    //setRouteList(rlist);
    //if (rlist.length > 0) setRoute(rlist[0]);
  }, [contents]);

  const section = useMemo(() => {
    if (!data) return [];
    const tree = buildAdminConfig(data);

    const collectRoutes = (nodes: any[]): string[] => {
      const out: string[] = [];
      const seen = new Set<string>();

      const normalize = (p: string): string => {
        let s = (p || "/").replace(/\\+/g, "/");
        if (!s.startsWith("/")) s = "/" + s;
        s = s.replace(/\/{2,}/g, "/");
        if (s.length > 1) s = s.replace(/\/+$/, "");
        return s || "/";
      };

      const parseRoute = (val: any): string | null => {
        if (typeof val !== "string") return null;
        let s = val.trim();
        if (!s) return null;

        // strip hash/query
        s = s.split("#")[0].split("?")[0];

        // absolute url -> pathname
        if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) {
          try {
            const u = new URL(s);
            s = u.pathname || "/";
          } catch {
            // ignore parse error
          }
        }

        if (s === "*") return "__KEEP_PARENT__";
        if (s === "/*") return "/";

        // cut wildcard tail and normalize slashes
        const i = s.indexOf("*");
        if (i >= 0) s = s.slice(0, i);
        s = s.replace(/\\+/g, "/").replace(/\/{2,}/g, "/");
        if (s.length > 1) s = s.replace(/\/+$/, "");
        return s;
      };

      const add = (p: string) => {
        const n = normalize(p);
        if (!seen.has(n)) {
          seen.add(n);
          out.push(n);
        }
      };

      const join = (base: string, child: string): string => {
        if (!child || child === "/") return "/";
        if (child.startsWith("/")) return normalize(child);
        const b = base === "/" ? "" : base.replace(/\/+$/, "");
        return normalize(`${b}/${child.replace(/^\/+/, "")}`);
      };

      const walk = (node: any, base: string) => {
        if (!node || typeof node !== "object") return;

        const raw = node.route;
        const parsed = parseRoute(raw);

        let current = base;
        if (parsed !== null) {
          if (parsed === "__KEEP_PARENT__") {
            add(base);
          } else {
            current = join(base, parsed);
            add(current);
          }
        }
        //console.log("# base=", base, " raw=", raw, " parsed=", parsed);

        const children = node.children;
        if (Array.isArray(children))
          children.forEach((child) => walk(child, current));
      };

      (Array.isArray(nodes) ? nodes : []).forEach((node) => walk(node, "/"));
      return out;
    };

    const rlist = collectRoutes(tree);
    setRouteList(rlist);
    setRoute((prev) => (prev && rlist.includes(prev) ? prev : rlist[0] || ""));

    if (selectedIndex >= 0) {
      const record = data
        ? data.find((record: any) => record[0] === selectedIndex)
        : null;
      if (record) {
        setSelectedSection(Object.values(record[4])[0]);
        setSelectedRecord(record);
      }
    }

    return tree.length > 0 ? tree[0] : null;
  }, [data]);

  const handleApplyConfig = async () => {
    try {
      await axios
        .request({
          method: "get",
          url: pxConfig["command-url"] + "/dist",
        })
        .then((response) => {
          console.log("NexConfigDistApp::handleClick() response:", response);
          window.location.reload();
        });
    } catch (error) {
      console.error("Failed to apply config:", error);
    }
  };

  const handleSelect = (path: string, index: number) => {
    const record = data
      ? data.find((record: any) => record[0] === index)
      : null;

    console.log(
      "handleSelect : path=",
      path,
      " index=",
      index,
      " length=",
      record ? record[0] : 0
    );
    console.log(
      `handleSelect : index=${index} record=${JSON.stringify(record[4], null, 2)}`
    );
    console.log("handleSelect : ", record ? Object.values(record[4])[0] : null);
    setSelectedIndex(index);
    setSelectedPath(path);
    setSelectedSection(record ? Object.values(record[4])[0] : null);
    setSelectedRecord(record);
    onSelect?.(storeIndex, record);
  };

  const handleAddEntity = async () => {
    const projectName = "";
    const systemName = "";

    const now = new Date();
    const nodeName = `new-${NexNodeType.SECTION}-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;
    const newNode = {
      ...getAdminNodeFromType(NexNodeType.SECTION),
      name: nodeName,
    };

    let parentPath = "";
    if (!selectedSection) {
      parentPath = "";
    } else if (
      selectedSection.type === NexNodeType.FOLDER ||
      (NexNodeType.SECTION &&
        (selectedSection.applet === undefined ||
          selectedSection.contents === undefined ||
          selectedSection.applet === "" ||
          selectedSection.contents.length === 0))
    ) {
      parentPath = selectedPath;
    } else {
      parentPath = (() => {
        if (!selectedPath || selectedPath === "") return "";
        const trimmed = selectedPath.replace(/\/+$/, "");
        const idx = trimmed.lastIndexOf("/");
        return idx <= 0 ? "" : trimmed.slice(0, idx);
      })();
    }

    let newRecord: any = null;

    newRecord = [
      -1,
      `${parentPath}/${newNode.name}`,
      projectName,
      "",
      { [-1]: newNode },
    ];

    if (!newRecord) return;

    console.log(
      "handleAddEntity: newRecord=",
      JSON.stringify(newRecord, null, 2)
    );
    return;
    const bres = await onAdd?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("추가에 실패했습니다.");
    } //onAdd?.(storeIndex, row);
  };

  const handleAdd = async (newSection: any) => {
    let newRecord: any = null;
    if (selectedIndex < 0 || !selectedSection) {
      // 선택된 섹션이 없으면 최상위에 추가
      newRecord = [-1, `/${newSection.name}`, "", "", { [-1]: newSection }]; // dummy init
    } else {
      if (
        (selectedSection.applet && selectedSection.applet !== "") ||
        (selectedSection.contents && selectedSection.contents.length > 0)
      ) {
        console.log(
          `# applet=${Boolean(selectedSection.applet)}, contents=${selectedSection.contents}`
        );
        window.alert(
          "애플릿이나 컨텐츠가 있는 섹션은 하위 섹션을 추가할 수 없습니다."
        );
      } else {
        // 선택된 섹션의 하위에 추가
        newRecord = [
          -1,
          `${selectedPath}/${selectedSection.name}`,
          "",
          "",
          { [-1]: newSection },
        ]; // dummy init
      }
    }

    if (!newRecord) return;

    const bres = await onAdd?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("추가에 실패했습니다.");
    } //onAdd?.(storeIndex, row);
  };

  const handleUpdate = async (newSection: any) => {
    if (selectedIndex < 0 || !selectedSection) return;

    const newRecord = data
      ? data.find((record: any) => record[0] === selectedIndex)
      : null;
    if (!newRecord || newRecord.length !== 5) return;

    const keys = Object.keys(newRecord[4] || {});
    if (keys.length !== 1) return;
    const key = keys[0];

    //const prevSection: any = (newRecord[4] as any)[key] || {};
    // newSection.name 이 변경되었으면 기존 path 경로 변경
    const parentPath = (() => {
      if (!selectedPath) return "";
      const trimmed = selectedPath.replace(/\/+$/, "");
      const idx = trimmed.lastIndexOf("/");
      return idx <= 0 ? "" : trimmed.slice(0, idx);
    })();

    newRecord[1] = `${parentPath}/${newSection.name}`;
    newRecord[4] = {
      [key]: newSection,
    };

    const bres = await onUpdate?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("업데이트에 실패했습니다.");
    }
  };

  const handleRemove = async () => {
    if (selectedIndex < 0 || !selectedSection) return;

    const newRecord = data
      ? data.find((record: any) => record[0] === selectedIndex)
      : null;
    if (!newRecord || newRecord.length !== 5) return;

    const keys = Object.keys(newRecord[4] || {});
    if (keys.length === 0) return;
    const key = keys[0];

    //const prevSection: any = (newRecord[4] as any)[key] || {};

    const bres = await onRemove?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("삭제에 실패했습니다.");
    }
  };

  const setValues = async (type: string, value: any) => {
    if (!selectedSection) return;

    const allowed = new Set([
      "name",
      "dispName",
      "direction",
      "icon",
      "color",
      "isRoutes",
      "route",
      "padding",
      "gap",
      "border",
      "borderRadius",
    ] as const);

    if (!allowed.has(type as any)) return;
    setSelectedSection({ ...selectedSection, [type]: value });
  };

  const resize = async (diff: number) => {
    if (selectedIndex < 0) return;

    const newRecord = data
      ? data.find((record: any) => record[0] === selectedIndex)
      : null;
    if (!newRecord || newRecord.length !== 5) return;

    const keys = Object.keys(newRecord[4] || {});
    if (keys.length === 0) return;
    const key = keys[0];

    const prevSection: any = (newRecord[4] as any)[key] || {};

    const size = clamp(Number(prevSection.size ?? 1) + diff, 1, 100);
    if (size === Number(prevSection.size)) return;
    newRecord[4] = {
      [key]: {
        ...prevSection,
        size: clamp(Number(prevSection.size ?? 1) + diff, 1, 100),
      },
    };

    console.log(
      `resize section(diff=${diff}): ${JSON.stringify(newRecord, null, 2)}`
    );
    const bres = await onUpdate?.(storeIndex, newRecord);
    if (!bres) {
      newRecord[4] = {
        [key]: prevSection,
      };
    }
  };

  const reorder = async (diff: number) => {
    if (selectedIndex < 0) return;
    // TODO 순서 변경
    const newRecord = data
      ? data.find((record: any) => record[0] === selectedIndex)
      : null;
    if (!newRecord || newRecord.length !== 5) return;
    const keys = Object.keys(newRecord[4] || {});
    if (keys.length === 0) return;
    const orderIndex = Number(keys[0]);
    const values = Object.values(newRecord[4] || {});
    if (values.length === 0) return;
    const prevSection: any = values[0] || {};

    newRecord[4] = { [orderIndex + diff]: prevSection };

    console.log(
      `reorder section(diff=${diff}): ${JSON.stringify(newRecord, null, 2)}`
    );

    const bres = await onUpdate?.(storeIndex, newRecord);
    console.log("reorder result:", JSON.stringify(bres, null, 2));
    if (!bres) {
      newRecord[4] = { [orderIndex]: prevSection };
    }
  };

  const resizeButton = (
    <Stack
      spacing={1}
      width="100%"
      direction="row"
      alignItems="flex-end"
      justifyContent="flex-end"
    >
      <Button
        variant="contained"
        color="inherit"
        title="크게"
        onClick={() => resize(1)}
        size="medium"
        startIcon={<MdArrowDropUp />}
        sx={{ flex: 1 }}
      >
        크게
      </Button>
      <Button
        variant="contained"
        color="inherit"
        title="작게"
        onClick={() => resize(-1)}
        size="medium"
        startIcon={<MdArrowDropDown />}
        sx={{ flex: 1 }}
      >
        작게
      </Button>
      <Button
        variant="contained"
        color="inherit"
        title="앞으로"
        onClick={() => reorder(-1)}
        size="medium"
        startIcon={<MdArrowLeft />}
        sx={{ flex: 1 }}
      >
        앞으로
      </Button>
      <Button
        variant="contained"
        color="inherit"
        title="뒤로"
        onClick={() => reorder(1)}
        size="medium"
        startIcon={<MdArrowRight />}
        sx={{ flex: 1 }}
      >
        뒤로
      </Button>
      <Button
        variant="contained"
        color="error"
        title="삭제"
        onClick={() => handleRemove()}
        size="medium"
        startIcon={<MdCancel />}
        sx={{ flex: 1 }}
      >
        삭제
      </Button>
    </Stack>
  );

  const pageSelector = (
    <NexDiv width="100%" align="flex-end">
      <Stack
        flex={8}
        spacing={4}
        direction="row"
        width="100%"
        alignItems="flex-end"
        justifyContent="flex-end"
        style={{ padding: "4px" }}
      >
        <NexDiv align="flex-end" justify="flex-end">
          <FormControl
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setPreviewMode(v === "preview" ? true : false);
            }}
          >
            <FormLabel id="nex-section-preview">편집 모드</FormLabel>
            <RadioGroup
              row
              aria-labelledby="nex-section-preview"
              name="nex-section-preview-radio-group"
              value={isPreview ? "preview" : "editting"}
            >
              <FormControlLabel
                value={"editting"}
                control={<Radio />}
                label="레이어"
              />
              <FormControlLabel
                value={"preview"}
                control={<Radio />}
                label="애플릿"
              />
            </RadioGroup>
          </FormControl>
        </NexDiv>

        <NexDiv flex="3" align="flex-end" justify="flex-end">
          <Autocomplete
            options={routeList}
            value={route}
            onChange={(event, newValue) => {
              console.log("route changed:", newValue);
              setRoute(newValue || "");
            }}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="route" variant="standard" />
            )}
          />
        </NexDiv>
        <NexDiv flex="5" align="flex-end" justify="flex-end">
          {resizeButton}
        </NexDiv>
      </Stack>
      <NexDiv flex="2" padding="4px">
        <Button
          size="large"
          variant="contained"
          onClick={() => handleApplyConfig()}
          sx={{ flex: 1 }}
        >
          설정 서버 반영
        </Button>
      </NexDiv>
    </NexDiv>
  );

  // name, dispName, padding , gap, boarder, boarderRadius

  const baseEditor = (
    <NexDiv width="100%" align="flex-end">
      <Grid
        container
        spacing={3}
        columnSpacing={2}
        columns={13}
        flex="8"
        alignItems="flex-end"
      >
        <Grid item xs={"auto"} sm={"auto"} md={3}>
          <TextField
            size="medium"
            variant="standard"
            disabled
            label={"섹션 경로"}
            value={selectedPath}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={2}>
          <TextField
            size="medium"
            variant="standard"
            label={"이름(영문)"}
            value={String(selectedSection?.name || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("name", e.target.value)}
          />
        </Grid>

        <Grid item xs={"auto"} sm={"auto"} md={2}>
          <TextField
            size="medium"
            variant="standard"
            label={"표시이름"}
            value={String(selectedSection?.dispName || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("dispName", e.target.value)}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={1.5}>
          <TextField
            size="medium"
            variant="standard"
            label={"아이콘"}
            value={String(selectedSection?.icon || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("icon", e.target.value)}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={1.5}>
          <TextField
            size="medium"
            variant="standard"
            label={"컬러"}
            value={String(selectedSection?.color || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("color", e.target.value)}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={2}>
          <FormControlLabel
            label={"페이지여부"}
            control={
              <Checkbox
                checked={Boolean(selectedSection?.isRoutes)}
                onChange={(e) => setValues("isRoutes", e.target.checked)}
                size="medium"
              />
            }
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={2}>
          <TextField
            size="medium"
            variant="standard"
            label={"라우트"}
            value={String(selectedSection?.route || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("route", e.target.value)}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={1}>
          <FormControl title={"방향"} variant="standard" sx={{ width: "100%" }}>
            <Select
              value={selectedSection?.direction || "row"}
              onChange={(e: any) => {
                setValues("direction", e.target.value);
              }}
              label={"방향"}
              style={{ width: "100%" }}
            >
              <MenuItem value="row">{"가로"}</MenuItem>
              <MenuItem value="column">{"세로"}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={1}>
          <TextField
            size="medium"
            variant="standard"
            type="text"
            label={"간격"}
            value={selectedSection?.gap || 0}
            onChange={(e) => setValues("gap", e.target.value)}
            style={{ width: "100%" }}
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </Grid>

        <Grid item xs={"auto"} sm={"auto"} md={1}>
          <TextField
            size="medium"
            variant="standard"
            type="text"
            label={"패딩"}
            value={selectedSection?.padding || 0}
            onChange={(e) => setValues("padding", e.target.value)}
            style={{ width: "100%" }}
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={3}>
          <TextField
            size="medium"
            variant="standard"
            label={"테두리"}
            value={String(selectedSection?.border || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("border", e.target.value)}
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </Grid>
        <Grid item xs={"auto"} sm={"auto"} md={3}>
          <TextField
            size="medium"
            variant="standard"
            label={"모서리반경"}
            value={String(selectedSection?.borderRadius || "")}
            style={{ width: "100%" }}
            onChange={(e) => setValues("borderRadius", e.target.value)}
            inputProps={{
              style: { textAlign: "right" },
            }}
          />
        </Grid>
      </Grid>
      <Stack
        spacing={2}
        direction={"row"}
        flex="1.5"
        justifyContent="flex-end"
        mt={2}
        width="100%"
      >
        <Button
          size="large"
          variant="contained"
          onClick={() => handleRemove()}
          sx={{ flex: 1 }}
        >
          삭제
        </Button>
      </Stack>
    </NexDiv>
  );

  return (
    <NexApplet {...props} error={errorMsg()}>
      {section ? (
        <NexDiv
          direction="column"
          align="center"
          width="100%"
          height="100%"
          color={color}
          bgColor={bgColor}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
          overflow="auto"
        >
          <Stack
            spacing={1}
            width="100%"
            direction="column"
            alignItems="center"
          >
            {pageSelector}
            {/*baseEditor*/}
          </Stack>
          <span style={{ height: "20px" }}></span>
          <NexDiv width="100%" height="100%">
            <NexDiv flex="8" width="100%" height="100%">
              <NexPagePreviewer
                isPreview={isPreview}
                path={"/" + section.name}
                selectedRoute={route}
                route={""}
                section={section}
                selectedIndex={selectedIndex}
                style={style}
                isVisibleBorder={false}
                onSelect={handleSelect}
              />
            </NexDiv>
            {false && (
              <NexDiv flex="2" width="100%" height="100%" overflow="auto">
                {selectedRecord && (
                  <AdminNodeEditor
                    node={selectedSection}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                  />
                )}
              </NexDiv>
            )}
          </NexDiv>
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexSectionViewer;
