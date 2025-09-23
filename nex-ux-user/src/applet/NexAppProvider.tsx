import { observer } from "mobx-react-lite";

import { NexDiv } from "../component/base/NexBaseComponents";
import React, { useContext, useMemo } from "react";
import {
  NexStoreContext,
  NexStoreContextValue,
} from "provider/NexStoreProvider";
import { data } from "react-router-dom";
import NexDataStore from "./NexDataStore";
import { features } from "process";
import path from "path";

export interface NexAppProviderProps {
  section: any;
  context: NexStoreContextValue; // Context to access stores, apps, and theme:
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

    const contentsList = contentsPaths?.map((path: any) => {
      const contents = contentsMap[path];
      //console.log("path:", path);
      //console.log("contents:", JSON.stringify(contents, null, 2));
      return contents;
    });

    if (appletPath !== "" && !app) {
      console.log(
        `NexAppProvider => section=${JSON.stringify(section)}, appletPath=${appletPath}`
      );
      return <NexDiv width='100%' height='100%' padding={padding}></NexDiv>;
    }

    const selectorDeps = JSON.stringify(selector.map);

    const contents =
      useMemo(() => {
        return contentsList?.map((content: any) => {
          const store = storeMap[content.element];
          const conditions = content.conditions || [];

          let newData: any = null;
          if (!store)
            return {
              ...content,
              store: store,
              csv: null,
              json: null,
              format: null,
            };

          if (conditions.length > 0) {
            const conds = conditions.map((condition: any) => ({
              feature: condition.feature,
              value: selector.get(condition.key),
              method: condition.method || "match",
            }));
            newData = store.getValuesByCondition(conds) || null;
          } else {
            newData = store.getData();
          }

          return {
            ...content,
            store: store,
            csv: newData.csv,
            json: newData.json,
            format: newData.format,
          };
        });
      }, [selectorDeps]) || [];

    const handleSelect = (contentsIndex: number, row: any) => {
      if (row && contents.length > contentsIndex) {
        const selections = contents[contentsIndex].selections || [];
        if (selections.length > 0) {
          const store = contents[contentsIndex].store;
          const features =
            store.format?.features || store.format.children[0].features || [];
          selections.forEach((selection: any) => {
            const featureIndex = features.findIndex(
              (feature: any) => feature.name === selection.feature
            );

            // find data
            //contents[contentsIndex].csv.find((r: any) => {});
            if (featureIndex >= 0 && row[featureIndex] !== undefined) {
              selector.set(selection.key, row[featureIndex]);
            }
          });
        }
      }
    };

    const handleChange = (contentsIndex: number, curRow: any, newRow: any) => {
      if (curRow && newRow && contents.length > contentsIndex) {
        const store = contents[contentsIndex].store;
        store.update(curRow, newRow);
      } else {
        console.warn("NexAppProvider: handleChange - Invalid row data");
      }
    };

    const handleAdd = (contentsIndex: number, curRow: any, newRow: any) => {
      if (newRow && contents.length > contentsIndex) {
        const store = contents[contentsIndex].store;
        store.add(curRow, newRow);
      } else {
        console.warn("NexAppProvider: handleAdd - Invalid row data");
      }
    };

    const handleDelete = (contentsIndex: number, row: any) => {
      if (row && contents.length > contentsIndex) {
        const store = contents[contentsIndex].store;
        store.delete(row);
      } else {
        console.warn("NexAppProvider: handleDelete - Invalid row data");
      }
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
            onChange: handleChange,
            onAdd: handleAdd,
            onRemove: handleDelete,
          })}
      </NexDiv>
    );
  }
);

export default NexAppProvider;
