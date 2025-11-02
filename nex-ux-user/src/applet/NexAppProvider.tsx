import { observer } from "mobx-react-lite";

import { NexDiv } from "../component/base/NexBaseComponents";
import React, { useMemo, useState } from "react";
import { NexStoreContextValue } from "provider/NexStoreProvider";
import NexDataStore from "./NexDataStore";

export interface NexAppProviderProps {
  section: any;
  context: NexStoreContextValue; // Context to access stores, apps, and theme:
}

export interface NexContents {
  info: any;
  store: any;
  data: any[];
  selectedIndex: number;
  indexes: number[] | null;
  format: any;
}

const NexAppProvider: React.FC<NexAppProviderProps> = observer(
  ({ section, context }) => {
    const {
      storeMap,
      appMap,
      contentsMap,
      appNodeMap,
      elementNodeMap,
      theme: theme,
      user: user,
      selector,
    } = context;

    //const dataStores = elementPaths?.map((path) => stores[path]);
    const appletPath = section?.applet || "";
    const app = appletPath ? appMap[appletPath] : null;

    const contentsPaths = section?.contents || [];

    const name = section?.dispName || "";
    const icon = section?.icon || "";

    const padding = section.padding || "8px";
    const [modifiedCount, setModifiedCount] = useState<number>(0);

    if (appletPath !== "" && !app) {
      console.log(
        `NexAppProvider => section=${JSON.stringify(section)}, appletPath=${appletPath}`
      );
      return <NexDiv width='100%' height='100%' padding={padding}></NexDiv>;
    }

    const contentsNodeList = useMemo(() => {
      return (
        contentsPaths
          ?.map((path: string) => {
            const content = contentsMap[path];
            // console.log("contents:", JSON.stringify(content, null, 2));
            return content;
          })
          .filter((c: any) => c != null) || []
      );
    }, [contentsPaths, contentsMap]);

    /*
    const selectorDeps = useMemo(() => {
      console.log("NexAppProvider selectorDeps:", JSON.stringify(selector.map));
      return JSON.stringify(selector.map);
    }, [selector.modifiedCount]);
    */

    const contents: NexContents[] = useMemo(() => {
      return contentsNodeList?.map((content: any) => {
        const store = storeMap[content.element];
        const conditions = content.conditions || [];

        //console.log("NexAppProvider contents modified!", content.element);

        let indexes: number[] | null = null;
        if (!store) {
          console.log(
            "NexAppProvider: content=",
            JSON.stringify(content, null, 2),
            storeMap
          );

          return {
            info: content,
            store: store,
            data: [],
            selectedIndex: -1,
            indexes: null,
            format: null,
          };
        }

        if (conditions.length > 0) {
          const conds = conditions.map((condition: any) => ({
            feature: condition.feature,
            value: selector.get(condition.key),
            method: condition.method || "match",
          }));
          indexes = store.getIndexesByCondition(conds) || null;
        }

        return {
          info: content,
          store: store,
          data: store.odata,
          selectedIndex: store.curRowIndex,
          indexes: indexes, // indexes is null then all data
          format: store.format,
        };
      });
    }, [
      contentsNodeList,
      selector,
      storeMap,
      selector.modifiedCount,
      modifiedCount,
      ...Object.values(storeMap).map((store) => store.odata),
    ]);

    const handleSelect = (contentsIndex: number, row: any) => {
      if (row && contents.length > contentsIndex) {
        const selections = contents[contentsIndex].info.selections || [];
        const store = contents[contentsIndex].store;
        const features = store.format.features || [];
        store.select(row);
        setModifiedCount(modifiedCount + 1);
        if (selections.length > 0) {
          selections.forEach((selection: any) => {
            const featureIndex = features.findIndex(
              (feature: any) => feature.name === selection.feature
            );

            // find data
            //contents[contentsIndex].csv.find((r: any) => {});
            if (featureIndex >= 0 && row[featureIndex] !== undefined) {
              //console.log(`NexAppProvider: handleSelect - Setting selector ${selection.key} = ${row[featureIndex]}`);
              selector.set(selection.key, row[featureIndex]);
            }
          });
        }
      }
    };

    const handleUpdate = (contentsIndex: number, newRow: any) => {
      console.log(
        `NexAppProvider: handleUpdate contentsIndex=${contentsIndex}, newRow=${JSON.stringify(newRow, null, 2)}`
      );
      if (newRow && contents.length > contentsIndex) {
        const store = contents[contentsIndex].store;
        const bres = store.update(newRow);
        if (bres) setModifiedCount(modifiedCount + 1);
        return bres;
      } else {
        console.warn("NexAppProvider: handleUpdate - Invalid row data");
      }
      return false;
    };

    const handleAdd = (contentsIndex: number, curRow: any, newRow: any) => {
      if (newRow && contents.length > contentsIndex) {
        const store: NexDataStore = contents[contentsIndex].store;
        const bres = store.add(curRow, newRow);
        if (bres) {
          setModifiedCount(modifiedCount + 1);
          console.log("NexAppProvider: handleAdd - Added row successfully");
        } else {
          console.warn("NexAppProvider: handleAdd - Failed to add row");
        }
        return bres;
      }
      console.warn("NexAppProvider: handleAdd - Invalid row data");
      return false;
    };

    const handleRemove = (contentsIndex: number, row: any) => {
      if (row && contents.length > contentsIndex) {
        const store: NexDataStore = contents[contentsIndex].store;
        const bres = store.remove(row);
        if (bres) setModifiedCount(modifiedCount + 1);
        return bres;
      }
      console.warn("NexAppProvider: handleRemove - Invalid row data");
      return false;
    };

    const elementList = contents?.map(
      (content: any) => elementNodeMap[content.element]
    );
    //const conditions = applet?.contents.
    return (
      <NexDiv width='100%' height='100%' padding={padding}>
        {app &&
          React.createElement(app, {
            name: name,
            contents: contents,
            selector: selector,
            user: user,
            theme: theme,
            applet: appNodeMap[appletPath],
            elements: elementList,
            onSelect: handleSelect,
            onUpdate: handleUpdate,
            onAdd: handleAdd,
            onRemove: handleRemove,
          })}
      </NexDiv>
    );
  }
);

export default NexAppProvider;
