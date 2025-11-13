import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import AdminNodeEditor from "./lib/AdminNodeEditor";
import { buildAdminConfig } from "applet/NexConfigStore";
import NexPagePreviewer from "./lib/NexPagePreviewer";
import { Autocomplete, Stack, TextField } from "@mui/material";

const NexSectionViewer: React.FC<NexAppProps> = observer((props) => {
  const { contents, theme, user, onUpdate, onSelect, onAdd, onRemove } = props;

  const [isMouseEnter, setMouseEnter] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [section, setSection] = useState<any>(null);

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

        const raw = node.route ?? node.path ?? node.url;
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

        const children =
          node.children ?? node.child ?? node.items ?? node.nodes;
        if (Array.isArray(children)) children.forEach((c) => walk(c, current));
      };

      (Array.isArray(nodes) ? nodes : []).forEach((n) => walk(n, "/"));
      return out;
    };

    const rlist = collectRoutes(treeData);
    setRouteList(rlist);
    setRoute((prev) => (prev && rlist.includes(prev) ? prev : rlist[0] || ""));

    if (treeData && treeData.length > 0) {
      setSection(treeData[0]);
    }
    console.log("NexSectionViewer routeList:", JSON.stringify(rlist, null, 2));
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

  const handleSelect = (row: any) => {
    console.log("handleSelect : ", JSON.stringify(row, null, 2));
    onSelect?.(storeIndex, row);
  };

  const handleAdd = (row: any) => {
    console.log("handleAddSection : ", JSON.stringify(row, null, 2));
    onAdd?.(storeIndex, row);
  };

  const handleRemove = (row: any) => {
    console.log("handleRemoveSection : ", JSON.stringify(row, null, 2));
    onRemove?.(storeIndex, row);
  };

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
          <Stack spacing={0} width="100%" direction="row" alignItems="center">
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
            <NexDiv width="100%"> </NexDiv>
          </Stack>
          <span style={{ height: "8px" }}></span>
          <NexPagePreviewer
            section={section}
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
