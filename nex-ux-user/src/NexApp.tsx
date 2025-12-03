import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import nexConfig from "applet/NexConfigStore";
import NexConfigStore from "applet/NexConfigStore";
import { observer } from "mobx-react-lite";
import { NexDiv } from "component/base/NexBaseComponents";
import NexPageViewer from "page/NexPageViewer";
import NexPlayground from "page/NexPlayground";
import NexStoreProvider from "provider/NexStoreProvider";
import { useEffect, useState } from "react";
import { set } from "mobx";
//import nexTheme from "./theme/nexTheme";
//import { testWebPages } from "./test/data/testWebPages";

interface NexAppProps {
  //section: any;
  //theme?: any; // Optional theme prop, can be used for styling
  configStore: NexConfigStore; // Optional config store prop, can be used for configuration
}

const NexApp: React.FC<NexAppProps> = observer((props) => {
  const { configStore } = props;

  const [sections, setSections] = useState<any[]>([]);
  useEffect(() => {
    // Fetch configuration when the component mounts
    if (!configStore.isReady) {
      setSections([]);
      return;
    }
    //console.log("NexApp configStore:", configStore);
    setSections(configStore?.config.websections);
  }, [configStore, configStore.isReady]);
  //const section = configStore?.config.websections[0];

  //console.log("NexApp section:", JSON.stringify(section, null, 2));
  return (
    <NexStoreProvider configStore={configStore}>
      <NexDiv
        align="center"
        justify="center"
        width="100%"
        height="100%"
        overflow="hidden"
        style={{ position: "fixed", inset: 0, boxSizing: "border-box" }}
      >
        {sections.length === 0 || !configStore.isReady ? (
          <div>Loading... {configStore.isReady ? "Ready" : "Not Ready"}</div>
        ) : (
          <Router>
            <Routes>
              <Route
                path="*"
                element={
                  <NexPageViewer
                    key={sections[0].name}
                    section={sections[0]}
                    isVisibleBorder={false}
                    isVisibleTitle={false}
                  />
                }
              />
            </Routes>
          </Router>
        )}
      </NexDiv>
    </NexStoreProvider>
  );
  return (
    <NexStoreProvider configStore={configStore}>
      <NexDiv
        align="center"
        justify="center"
        width="100%"
        height="100%"
        overflow="hidden"
        style={{ position: "fixed", inset: 0, boxSizing: "border-box" }}
      >
        {sections.length === 0 || !configStore.isReady ? (
          <div>Loading... {configStore.isReady ? "Ready" : "Not Ready"}</div>
        ) : (
          <Router>
            <Routes>
              <Route
                path="*"
                element={
                  <Routes>
                    {sections.map((section, i) => {
                      if (!section.route) return null;
                      const path = `${section.route}/*`;
                      console.log("NexApp Route path:", path);
                      return (
                        <Route
                          key={section.name}
                          path={`${path}`}
                          element={
                            <NexPageViewer
                              key={section.name}
                              section={section}
                              isVisibleBorder={false}
                              isVisibleTitle={false}
                            />
                          }
                        />
                      );
                    })}
                  </Routes>
                }
              />
            </Routes>
          </Router>
        )}
      </NexDiv>
    </NexStoreProvider>
  );
});

export default NexApp;
