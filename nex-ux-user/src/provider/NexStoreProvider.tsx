import NexDataStore from "applet/NexDataStore";
import { createContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import NexConfigStore from "applet/NexConfigStore";
import {
  NexThemeUser,
  defaultThemeUser,
  defaultTheme,
  NexTheme,
} from "type/NexTheme";
import nexApplets from "applet/nexApplets";
import NexSelector from "store/NexSelector";
export interface NexStoreProviderProps {
  configStore: NexConfigStore; // ConfigStore를 prop으로 받음
  children: React.ReactNode;
}

// Context 타입 확장
export interface NexStoreContextValue {
  storeMap: Record<string, NexDataStore>; // key element path, value NexDataStore
  appMap: Record<string, React.FC<any>>; // key applet  path, value NexApplet
  contentsMap: Record<string, any>; // key contents path, value contents data
  theme: NexTheme;
  user: NexThemeUser;
  elementNodeMap: Record<string, any>; // element nodes
  appNodeMap: Record<string, any>; // applet nodes
  selector: NexSelector; //
}

export const NexStoreContext = createContext<NexStoreContextValue>({
  storeMap: {},
  appMap: {},
  contentsMap: {},
  theme: defaultTheme,
  user: defaultThemeUser,
  elementNodeMap: {},
  appNodeMap: {},
  selector: new NexSelector(), // 기본값으로 빈 NexSelector 인스턴스
});

function collectNode(
  nodes: any[],
  nodeType: string,
  parentPath = ""
): Record<string, any> {
  let result: Record<string, any> = {};
  nodes.forEach((node) => {
    if (!node.name) return;
    const path =
      parentPath === "" ? `/${node.name}` : `${parentPath}/${node.name}`;
    if (node.type === nodeType) {
      result[path] = node;
    }
    if (Array.isArray(node.children)) {
      const childResult = collectNode(node.children, nodeType, path);
      result = { ...result, ...childResult };
    }
  });
  return result;
}

const NexStoreProvider: React.FC<NexStoreProviderProps> = observer(
  ({ children, configStore }) => {
    const userid = "default";
    /*
    const project = useMemo(
      () => collectNode(configStore.projects, "project"),
      [configStore.config.projects]
    );
*/
    const elements = useMemo(
      () => collectNode(configStore.config.elements, "element"),
      [configStore.config.elements]
    );

    const applets = useMemo(
      () => collectNode(configStore.config.applets, "applet"),
      [configStore.config.applets]
    );

    const contentsMap = useMemo(
      () => collectNode(configStore.config.contents, "contents"),
      [configStore.config.contents]
    );

    const themeUser: NexThemeUser = useMemo(() => {
      const userNode = configStore.config.webThemeUsers.find(
        (user: any) => user.user === userid
      );

      return userNode?.user || defaultThemeUser;
    }, [configStore.config.webThemeUsers]);

    const theme: NexTheme = useMemo(() => {
      const themeNode = configStore.config.webThemes.find(
        (t: any) => t.name === themeUser.theme
      );
      return themeNode?.theme || defaultTheme;
    }, [configStore.config.webThemes, themeUser]);

    const storeMap = useMemo(() => {
      const storeMap: Record<string, NexDataStore> = {};
      Object.entries(elements).forEach(([path, node]) => {
        //console.log("NexStoreProvider element:", path);
        //  console.log("NexStoreProvider element:",JSON.stringify(node, null, 2)););
        storeMap[path] = new NexDataStore("", "", path);
      });
      return storeMap;
    }, [elements]);

    const appMap = useMemo(() => {
      const appMap: Record<string, React.FC<any>> = {};
      Object.entries(applets).forEach(([path, node]) => {
        if (node.applet) {
          //console.log("NexStoreProvider applet:", path, node.applet);
          const AppletComponent = nexApplets(node.applet); // Assuming node.applet is a React component
          if (AppletComponent) appMap[path] = AppletComponent;
        }
      });
      return appMap;
    }, [applets]);

    const selector = useMemo(() => new NexSelector(), []);

    // theme, applet도 context value에 포함
    const contextValue: NexStoreContextValue = {
      storeMap: storeMap,
      appMap: appMap,
      contentsMap: contentsMap,
      theme: theme,
      user: themeUser,
      elementNodeMap: elements,
      appNodeMap: applets,
      selector,
    };

    return (
      <NexStoreContext.Provider value={contextValue}>
        {children}
      </NexStoreContext.Provider>
    );
  }
);

export default NexStoreProvider;
