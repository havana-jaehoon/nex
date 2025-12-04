import React, { useEffect, useMemo, useState } from "react";
import { NexDiv, NexLabel } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";
import { buildAdminConfig } from "store/NexConfigStore";
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
  MdNewLabel,
} from "react-icons/md";

import axios from "axios";
import pxConfig from "config/px-config.json";
import { NexNodeType } from "type/NexNode";
import { getAdminNodeFromType } from "./lib/adminDataFormat";

const NexSectionViewer: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate, onSelect, onAdd, onRemove } = props;

  const [type, setType] = useState<string>("");
  const [nodes, setNodes] = useState<any>({});
  const [mainDatas, setMainDatas] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

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
    if (contents?.length < 1) return "NexNodeEditor must be one store element.";
    return null;
  };

  const defaultStyle = getThemeStyle(theme, "default");
  const style = getThemeStyle(theme, "applet");

  const fontSize = defaultStyle?.fontSize || "1rem";

  const color = defaultStyle?.color || "#393c45";
  const bgColor = defaultStyle?.bgColor || "#e8edf7";

  const storeIndex = 0; // only 1 store
  //const [data, setData] = useState<any>(null);
  // Memoize derived dependency to satisfy React Hooks lint rule

  useEffect(() => {
    if (!contents) return;

    let nodeList: any = {};
    contents.forEach((content, i) => {
      const nodeType = content.store?.element?.name || null;
      if (!nodeType) return;

      // main node 타입
      if (i === 0) {
        const indexes = content.indexes;
        content.store && content.store.stopFetchInterval();

        let contentsData = [];
        if (!indexes)
          // indexes 가 없으면 전체 데이터
          contentsData = content.data;
        else {
          contentsData = indexes.map((index: number) => content.data[index]);
        }

        setMainDatas(contentsData);
        setFeatures(content.format?.features || []);

        setType(nodeType);
      }

      nodeList[nodeType] = [];
      content.data.forEach((item: any) => {
        const obj = item[4];
        const node: any = Object.values(obj)[0];
        if (node?.type === nodeType) {
          // folder 제외
          nodeList[nodeType].push({
            index: i,
            name: node.name,
            dispName: node.dispName,
          });
        }
      });
    });

    setNodes(nodeList);
  }, [contents]);

  /*
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
*/
  const section = useMemo(() => {
    if (!mainDatas) return [];
    const tree = buildAdminConfig(mainDatas);

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
      const record = mainDatas
        ? mainDatas.find((record: any) => record[0] === selectedIndex)
        : null;
      if (record) {
        setSelectedSection(Object.values(record[4])[0]);
        setSelectedRecord(record);
      }
    }

    return tree.length > 0 ? tree[0] : null;
  }, [mainDatas]);

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
    const record = mainDatas
      ? mainDatas.find((record: any) => record[0] === index)
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

  const handleAdd = async () => {
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
      selectedSection.applet === undefined ||
      selectedSection.contents === undefined ||
      selectedSection.applet === "" ||
      selectedSection.contents.length === 0
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

    console.log("handleAdd: newRecord=", JSON.stringify(newRecord, null, 2));
    const bres = await onAdd?.(storeIndex, newRecord);
    if (!bres) {
      window.alert("추가에 실패했습니다.");
    }
  };

  const handleUpdate = async (newSection: any) => {
    if (selectedIndex < 0 || !selectedSection) return;

    const newRecord = mainDatas
      ? mainDatas.find((record: any) => record[0] === selectedIndex)
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

    const newRecord = mainDatas
      ? mainDatas.find((record: any) => record[0] === selectedIndex)
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

    const newRecord = mainDatas
      ? mainDatas.find((record: any) => record[0] === selectedIndex)
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
    const newRecord = mainDatas
      ? mainDatas.find((record: any) => record[0] === selectedIndex)
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
        size="small"
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
        size="small"
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
        size="small"
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
        size="small"
        startIcon={<MdArrowRight />}
        sx={{ flex: 1 }}
      >
        뒤로
      </Button>
      <Button
        size="large"
        variant="contained"
        title="추가"
        onClick={() => handleAdd()}
        startIcon={<MdNewLabel />}
        sx={{ flex: 1.5 }}
      >
        추가
      </Button>
      <Button
        size="large"
        variant="contained"
        color="error"
        title="삭제"
        onClick={() => handleRemove()}
        startIcon={<MdCancel />}
        sx={{ flex: 1.5 }}
      >
        삭제
      </Button>
      <Button
        size="large"
        variant="contained"
        onClick={() => handleApplyConfig()}
        sx={{ flex: 3 }}
      >
        설정 서버 반영
      </Button>
    </Stack>
  );

  const pageSelector = (
    <NexDiv width="100%" align="flex-end">
      <Stack
        flex={8}
        spacing={1}
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
            sx={{ justifyContent: "flex-end" }}
          >
            <FormLabel
              id="nex-section-preview"
              sx={{ justifyContent: "flex-end" }}
            >
              편집 모드
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="nex-section-preview"
              name="nex-section-preview-radio-group"
              value={isPreview ? "preview" : "editting"}
              sx={{ justifyContent: "flex-end" }}
            >
              <FormControlLabel
                value={"editting"}
                control={<Radio />}
                label="레이어"
                sx={{ justifyContent: "flex-end" }}
              />
              <FormControlLabel
                value={"preview"}
                control={<Radio />}
                label="애플릿"
                sx={{ justifyContent: "flex-end" }}
              />
            </RadioGroup>
          </FormControl>
        </NexDiv>

        <NexDiv flex="2" align="flex-end" justify="flex-end">
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
        <NexDiv flex="8" align="flex-end" justify="flex-end">
          {resizeButton}
        </NexDiv>
      </Stack>
    </NexDiv>
  );

  // name, dispName, padding , gap, boarder, boarderRadius

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
          </NexDiv>
        </NexDiv>
      ) : null}
    </NexApplet>
  );
});

export default NexSectionViewer;
