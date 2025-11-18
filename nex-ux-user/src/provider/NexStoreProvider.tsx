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

function findNodeByPath(nodes: any[], path: string): any | null {
  console.error("findNodeByPath:", JSON.stringify(nodes, null, 2), path);
  for (const node of nodes) {
    if (node.path === path) {
      return node;
    }
    const childResult = findNodeByPath(node.children || [], path);
    if (childResult) {
      return childResult;
    }
  }
  return null;
}

const NexStoreProvider: React.FC<NexStoreProviderProps> = observer(
  ({ children, configStore }) => {
    const userName = "admin";

    const formatCfgs = useMemo(() => {
      return collectNode(configStore.config.formats, "format");
    }, [configStore.config.formats]);

    const storeCfgs = useMemo(
      () => collectNode(configStore.config.stores, "store"),
      [configStore.config.stores]
    );

    const processorCfgs = useMemo(
      () => collectNode(configStore.config.processors, "processor"),
      [configStore.config.processors]
    );

    const systemCfgs = useMemo(() => {
      return collectNode(configStore.config.systems, "system");
    }, [configStore.config.systems]);

    const systemAddrDict = useMemo(() => {
      const dict: Record<string, { ip: string; port: string | number }> = {};
      Object.values(systemCfgs).forEach((sys: any) => {
        if (sys?.name && sys?.address) {
          dict[sys.name] = {
            ip: sys.address.ip,
            port: sys.address.port,
          };
        }
      });

      return dict;
    }, [systemCfgs]);

    const elementCfgs = useMemo(
      () => collectNode(configStore.config.elements, "element"),
      [configStore.config.elements]
    );

    const contentsCfgs = useMemo(
      () => collectNode(configStore.config.contents, "contents"),
      [configStore.config.contents]
    );

    const appletCfgs = useMemo(
      () => collectNode(configStore.config.applets, "applet"),
      [configStore.config.applets]
    );

    const themeUser: NexThemeUser = useMemo(() => {
      const userNode = configStore.config.webThemeUsers.find(
        (user: any) => user.name === userName
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
      Object.entries(elementCfgs).forEach(([path, element]) => {
        const format = formatCfgs[element.format] || null;

        const store = new NexDataStore("", "", path, element, format);
        //console.log("NexStoreProvider element:", JSON.stringify(node, null, 2));
        //console.log("NexStoreProvider path:", path);
        storeMap[path] = store;
      });
      return storeMap;
    }, [elementCfgs, formatCfgs]);

    const appMap = useMemo(() => {
      const appMap: Record<string, React.FC<any>> = {};
      Object.entries(appletCfgs).forEach(([path, node]) => {
        if (node.applet) {
          //console.log("NexStoreProvider applet:", path, node.applet);
          const AppletComponent = nexApplets(node.applet); // Assuming node.applet is a React component
          if (AppletComponent) appMap[path] = AppletComponent;
          else console.error("NexStoreProvider: Unknown applet", node.applet);
        }
      });
      return appMap;
    }, [appletCfgs]);

    const selector = useMemo(() => new NexSelector(), []);

    // theme, applet도 context value에 포함
    const contextValue: NexStoreContextValue = {
      storeMap: storeMap,
      appMap: appMap,
      contentsMap: contentsCfgs,
      theme: theme,
      user: themeUser,
      elementNodeMap: elementCfgs,
      appNodeMap: appletCfgs,
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
