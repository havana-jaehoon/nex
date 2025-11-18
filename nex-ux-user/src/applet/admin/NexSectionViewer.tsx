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
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowLeft,
  MdArrowRight,
  MdNewLabel,
} from "react-icons/md";
import { set } from "mobx";

const NexSectionViewer: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate, onSelect, onAdd, onRemove } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isPreview, setPreviewMode] = useState<boolean>(false);
  const [isMouseEnter, setMouseEnter] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [section, setSection] = useState<any>(null);

  //const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);

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

    const treeData = buildAdminConfig(tdata);
    setData(tdata);
    setFeatures(cts.format?.features || []);
    // routeList 작성 (부모 경로와 상대 경로를 결합하도록 수정)
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

    const rlist = collectRoutes(treeData);
    setRouteList(rlist);
    setRoute((prev) => (prev && rlist.includes(prev) ? prev : rlist[0] || ""));

    if (treeData && treeData.length > 0) {
      setSection(treeData[0]);
    }
    //console.log("NexSectionViewer routeList:", JSON.stringify(rlist, null, 2));
    //setRouteList(rlist);
    //if (rlist.length > 0) setRoute(rlist[0]);
  }, [contents]);

  const handleApply = (newData: any) => {
    //console.log("onApply : ", JSON.stringify(newData, null, 2));
    const bres = onUpdate?.(0, newData);
    if (!bres) {
      window.alert("Data update failed");
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
    setSelectedSection(record ? Object.values(record[4])[0] : null);
    onSelect?.(storeIndex, record);
  };

  const handleAdd = (row: any) => {
    console.log("handleAddSection : ", JSON.stringify(row, null, 2));
    //onAdd?.(storeIndex, row);
  };

  const handleRemove = (row: any) => {
    console.log("handleRemoveSection : ", JSON.stringify(row, null, 2));
    onRemove?.(storeIndex, row);
  };

  const increase = () => {
    if (selectedIndex < 0 || !selectedSection) return;

    const newSection = { ...selectedSection };
    newSection.size = clamp((newSection.size || 1) + 1, 1, 100);

    setSelectedSection(newSection);
    console.log(
      "increase new section size:",
      JSON.stringify(newSection, null, 2)
    );
    const newRecord = data ? data[selectedIndex] : null;
    newRecord[4] = {
      ...newRecord[4],
      [Object.keys(newRecord[4])[0]]: newSection,
    };
    //onUpdate?.(storeIndex, selectedRecord);
  };

  const decrease = () => {
    if (selectedIndex < 0 || !selectedSection) return;

    const newSection = { ...selectedSection };
    newSection.size = clamp((newSection.size || 1) - 1, 1, 100);

    setSelectedSection(newSection);
    console.log(
      "decrease new section size:",
      JSON.stringify(newSection, null, 2)
    );
    const newRecord = data ? data[selectedIndex] : null;
    newRecord[4] = {
      ...newRecord[4],
      [Object.keys(newRecord[4])[0]]: newSection,
    }; //onUpdate?.(storeIndex, selectedRecord);
  };

  const modeSelector = (
    <FormControl
      onChange={(e) => {
        const v = (e.target as HTMLInputElement).value;
        setPreviewMode(v === "preview" ? true : false);
      }}
    >
      <FormLabel id="nex-section-preview">모드</FormLabel>
      <RadioGroup
        row
        aria-labelledby="nex-section-preview"
        name="nex-section-preview-radio-group"
        value={isPreview ? "preview" : "editting"}
      >
        <FormControlLabel value={"editting"} control={<Radio />} label="편집" />
        <FormControlLabel
          value={"preview"}
          control={<Radio />}
          label="미리보기"
        />
      </RadioGroup>
    </FormControl>
  );

  const pageSelector = (
    <Grid container spacing={3} columns={12} width="100%" alignItems="flex-end">
      <Grid item xs={"auto"} sm={"auto"} md={4}>
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
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={8}>
        <NexDiv width="100%" align="flex-end" justify="flex-end">
          <FormControl
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setPreviewMode(v === "preview" ? true : false);
            }}
          >
            <FormLabel id="nex-section-preview">모드</FormLabel>
            <RadioGroup
              row
              aria-labelledby="nex-section-preview"
              name="nex-section-preview-radio-group"
              value={isPreview ? "preview" : "editting"}
            >
              <FormControlLabel
                value={"editting"}
                control={<Radio />}
                label="편집"
              />
              <FormControlLabel
                value={"preview"}
                control={<Radio />}
                label="미리보기"
              />
            </RadioGroup>
          </FormControl>
        </NexDiv>
      </Grid>
    </Grid>
  );

  const resizeButton = (
    <Stack spacing={4} direction="row" alignItems="center">
      <Stack spacing={1} direction="column" alignItems="flex-start">
        <NexLabel>크기 </NexLabel>
        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton
            title="크게"
            onClick={() => increase()}
            size="small"
            sx={{ border: "1px solid gray", borderRadius: 1.5 }}
          >
            <MdArrowDropUp fontSize="large" />
          </IconButton>
          <IconButton
            title="작게"
            onClick={() => decrease()}
            size="small"
            sx={{ border: "1px solid gray", borderRadius: 1.5 }}
          >
            <MdArrowDropDown fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>
      <Stack spacing={1} direction="column" alignItems="flex-start">
        <NexLabel>순서 </NexLabel>
        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton
            title="앞으로"
            onClick={() => null}
            size="small"
            sx={{ border: "1px solid gray", borderRadius: 1.5 }}
          >
            <MdArrowLeft fontSize="large" />
          </IconButton>
          <IconButton
            title="뒤로"
            onClick={() => null}
            size="small"
            sx={{ border: "1px solid gray", borderRadius: 1.5 }}
          >
            <MdArrowRight fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );

  const directionSelector = (
    <FormControl
      onChange={(e) => {
        const v = (e.target as HTMLInputElement).value;
        setPreviewMode(v === "preview" ? true : false);
      }}
    >
      <FormLabel id="nex-section-preview">방향</FormLabel>
      <RadioGroup
        row
        aria-labelledby="nex-section-preview"
        name="nex-section-preview-radio-group"
        value={selectedSection?.direction || "row"}
      >
        <FormControlLabel value={"row"} control={<Radio />} label="가로" />
        <FormControlLabel value={"column"} control={<Radio />} label="세로" />
      </RadioGroup>
    </FormControl>
  );
  // name, dispName, padding , gap, boarder, boarderRadius

  const baseEditor = (
    <Grid
      container
      spacing={3}
      columnSpacing={2}
      columns={12}
      width="100%"
      alignItems="flex-end"
    >
      <Grid item xs={"auto"} sm={"auto"} md={1}>
        <TextField
          size="medium"
          variant="standard"
          label={"이름(영문)"}
          value={String(selectedSection?.name || "")}
          style={{ width: "100%" }}
          onChange={(e) =>
            setSelectedSection({ ...selectedSection, name: e.target.value })
          }
        />
      </Grid>

      <Grid item xs={"auto"} sm={"auto"} md={1}>
        <TextField
          size="medium"
          variant="standard"
          label={"표시이름"}
          value={String(selectedSection?.dispName || "")}
          style={{ width: "100%" }}
          onChange={(e) =>
            setSelectedSection({ ...selectedSection, dispName: e.target.value })
          }
        />
      </Grid>

      <Grid item xs={"auto"} sm={"auto"} md={2}>
        <TextField
          size="medium"
          variant="standard"
          label={"테두리"}
          value={String(selectedSection?.border || "")}
          style={{ width: "100%" }}
          onChange={(e) =>
            selectedSection &&
            setSelectedSection({ ...selectedSection, border: e.target.value })
          }
          inputProps={{
            style: { textAlign: "right" },
          }}
        />
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={2}>
        <TextField
          size="medium"
          variant="standard"
          label={"모서리반경"}
          value={String(selectedSection?.borderRadius || "")}
          style={{ width: "100%" }}
          onChange={(e) =>
            selectedSection &&
            setSelectedSection({
              ...selectedSection,
              borderRadius: e.target.value,
            })
          }
          inputProps={{
            style: { textAlign: "right" },
          }}
        />
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={0.5}>
        <TextField
          size="medium"
          variant="standard"
          type="number"
          label={"간격"}
          value={selectedSection?.gap || 0}
          onChange={(e) =>
            setSelectedSection({
              ...selectedSection,
              gap: Number(e.target.value),
            })
          }
          style={{ width: "100%" }}
          inputProps={{
            style: { textAlign: "right" },
          }}
        />
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={0.5}>
        <TextField
          size="medium"
          variant="standard"
          type="number"
          label={"패딩"}
          value={selectedSection?.padding || 0}
          onChange={(e) =>
            selectedSection &&
            setSelectedSection({
              ...selectedSection,
              padding: Number(e.target.value),
            })
          }
          style={{ width: "100%" }}
          inputProps={{
            style: { textAlign: "right" },
          }}
        />
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={2} justifyItems="center">
        {resizeButton}
      </Grid>
      <Grid item xs={"auto"} sm={"auto"} md={3} justifyItems="flex-end">
        <NexDiv width="100%" justify="flex-end" align="end">
          {directionSelector}
        </NexDiv>
      </Grid>
    </Grid>
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
            {baseEditor}
          </Stack>
          <span style={{ height: "20px" }}></span>
          <NexPagePreviewer
            isPreview={isPreview}
            path={"/" + section.name}
            route={route}
            section={section}
            selectedIndex={selectedIndex}
            style={style}
            isVisibleBorder={false}
            onSelect={handleSelect}
          />
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexSectionViewer;
