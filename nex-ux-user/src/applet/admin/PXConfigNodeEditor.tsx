import React, { useEffect, useMemo, useState } from "react";
import { NexDiv } from "component/base/NexBaseComponents";
import NexApplet, { NexAppProps } from "applet/NexApplet";
import { observer } from "mobx-react-lite";
import { clamp } from "utils/util";
import { defaultThemeStyle, getThemeStyle } from "type/NexTheme";
import ConfigNodeEditor from "./lib/ConfigNodeEditor";
import { set } from "mobx";
import { NexNodeType } from "type/NexNode";
import { appletPathList, appletPathMap } from "applet/nexApplets";

const PXConfigNodeEditor: React.FC<NexAppProps> = observer((props) => {
    const { contents, theme, user, onUpdate, onAdd } = props;

    const [type, setType] = useState<string>("");
    const [nodes, setNodes] = useState<any>({});
    const [nodePaths, setNodePaths] = useState<any>({});
    const [mainDatas, setMainDatas] = useState<any[]>([]);

    const [isMouseEnter, setMouseEnter] = useState(false);
    const [isFocus, setFocus] = useState(false);

    // 1. Apllet 의 기본 적인 코드
    // 1.1 NexApplet 의 데이터 유형 체크
    //console.log("NexNodeEditor: stores=", JSON.stringify(stores, null, 2));
    const errorMsg = () => {
        // check isTree, volatility, features.length ...
        if (contents?.length < 1) return "PXConfigNodeEditor Applet must be one or more store element.";
        return null;
    };

    const defaultStyle = getThemeStyle(theme, "default");

    const fontSize = defaultStyle?.fontSize || "1rem";

    const color = defaultStyle?.color || "#393c45";
    const bgColor = defaultStyle?.bgColor || "#e8edf7";

    const storeIndex = 0; // only 1 store
    const [record, setRecord] = useState<any>(null);
    const [node, setNode] = useState<any>(null);
    const [features, setFeatures] = useState<any[]>([]);
    // Memoize derived dependency to satisfy React Hooks lint rule

    const contentsOdata = useMemo(
        () => contents?.map((c) => c.store.odata),
        [contents, ...(contents?.map((cts) => cts.store.odata) || [])]
    );

    useEffect(() => {
        if (!contents) return;

        let nodeList: any = {};
        let pathList: any = {};
        contents.forEach((content, i) => {
            const nodeType = content.store?.element?.name || null;
            if (!nodeType) return;

            // main node 타입
            if (i === 0) {
                content.store && content.store.stopFetchInterval();
                const tdata = content.indexes
                    ? content.indexes?.map((i: number) => content.data[i]) || []
                    : content.data || [];

                let curRecord = null;
                let curNode = null;
                if (tdata.length > 0) {
                    curRecord = tdata[0];
                    curNode = Object.values(tdata[0][4])[0];
                }

                setRecord(curRecord);
                setNode(curNode);

                setType(nodeType);
                //return;
            }

            pathList[nodeType] = {};
            nodeList[nodeType] = {};

            content.data.forEach((item: any) => {
                const node: any = Object.values(item[4])[0];
                if (node?.type) {
                    // folder 제외
                    const index = item[0];
                    let path = item[1];
                    let systemName = item[3] ?? "";
                    let parentPath = path.replace(/\/+$/, "").replace(/\/[^\/]+$/, "");

                    if (node.type === NexNodeType.FOLDER) {
                        if (!pathList[nodeType][systemName]) {
                            pathList[nodeType][systemName] = [
                                { index: 0, path: "", name: "", dispName: "없음", helper: "None" },

                            ];
                        }
                        pathList[nodeType][systemName].push({
                            index: i + 2,
                            path: path,
                            name: node.name,
                            dispName: node.dispName,
                            helper: `${node.dispName || node.name}(${path})`,
                        });
                    } else {
                        if (
                            node.type === NexNodeType.SYSTEM ||
                            node.type === NexNodeType.STORAGE
                        ) {
                            path = node.name;
                            systemName = "";
                            parentPath = "";
                        }

                        if (!nodeList[nodeType][systemName])
                            nodeList[nodeType][systemName] = {};
                        if (!nodeList[nodeType][systemName][parentPath])
                            nodeList[nodeType][systemName][parentPath] = [{ index: 0, path: "", name: "", dispName: "없음", helper: "None" }];

                        let nodeName = node.name;
                        if (node.type === NexNodeType.STORAGE) {
                            nodeName = "/" + node.name;
                        }


                        nodeList[nodeType][systemName][parentPath].push({
                            index: i + 1,
                            path: path, // 필요한가?
                            name: nodeName,
                            dispName: node.dispName,
                            system: systemName,
                            helper: `${node.dispName || node.name}`,
                        });
                    }
                }
            });
        });
        pathList[NexNodeType.APPLET] = appletPathList;
        nodeList[NexNodeType.APPLET] = appletPathMap;

        /*
        console.log(
          "NexNodeEditor: nodePaths=",
          JSON.stringify(pathList[NexNodeType.ELEMENT], null, 2)
        );
    
           console.log(
          "NexNodeEditor: nodes=",
          JSON.stringify(nodeList[NexNodeType.ELEMENT], null, 2)
        );
    */
        setNodePaths(pathList);
        setNodes(nodeList);
    }, [contents, contentsOdata]);

    /*
    useEffect(() => {
      const cts = contents?.[storeIndex];
      if (!cts || !cts.store) {
        setFeatures([]);
        setRecord(null);
        setNode(null);
        return;
      }
  
      setFeatures(cts.format.features || []);
  
      const tdata = cts.indexes
        ? cts.indexes?.map((i: number) => cts.data[i]) || []
        : cts.data || [];
  
      let curRecord = null;
      let curNode = null;
      if (tdata.length > 0) {
        curRecord = tdata[0];
        curNode = Object.values(tdata[0][4])[0];
      }
  
      setRecord(curRecord);
      setNode(curNode);
    }, [contents, contentsOdata]);
  */
    const handleUpdate = (newNode: any) => {
        //console.log("handleUpdate : ", JSON.stringify(newNode, null, 2));

        if (!record || record.length !== 5) return;
        const keys = Object.keys(record[4] || {});
        if (keys.length !== 1) return;
        const key = keys[0];
        const path = record[1];

        const parentPath = (() => {
            if (!path) return "";
            const trimmed = path.replace(/\/+$/, "");
            const idx = trimmed.lastIndexOf("/");
            return idx <= 0 ? "" : trimmed.slice(0, idx);
        })();

        const newRecord = [
            record[0],
            `${parentPath}/${newNode.name}`,
            record[2],
            record[3],
            { [key]: newNode },
        ];

        const bres = onUpdate?.(0, newRecord);
        if (!bres) {
            window.alert("Data update failed");
        }
    };

    return (
        <NexApplet {...props} error={errorMsg()}>
            {node ? (
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
                    <ConfigNodeEditor
                        node={node}
                        nodes={nodes}
                        nodePaths={nodePaths}
                        onUpdate={handleUpdate}
                    />
                </NexDiv>
            ) : null}
        </NexApplet>
    );
});

export default PXConfigNodeEditor;
