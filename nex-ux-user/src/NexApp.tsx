import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import nexConfig from "applet/NexConfigStore";
import NexConfigStore from "applet/NexConfigStore";
import { observer } from "mobx-react-lite";
import { NexDiv } from "component/base/NexBaseComponents";
import NexPageViewer from "page/NexPageViewer";
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

  const [section, setSection] = useState<any>(null);
  useEffect(() => {
    // Fetch configuration when the component mounts
    if (!configStore.isReady) {
      setSection(null);
      return;
    }
    console.log("NexApp configStore:", configStore);
    setSection(configStore?.config.websections[0]);
  }, [configStore, configStore.isReady]);
  //const section = configStore?.config.websections[0];

  //console.log("NexApp section:", JSON.stringify(section, null, 2));
  return (
    <NexStoreProvider configStore={configStore}>
      <NexDiv
        align="center"
        justify="center"
        width="100vw"
        height="100vh"
        overflow="hidden"
        style={{ boxSizing: "border-box" }}
      >
        {!section || !configStore.isReady ? (
          <div>Loading... {configStore.isReady ? "Ready" : "Not Ready"}</div>
        ) : (
          <Router>
            <NexPageViewer
              key={section.name}
              section={section}
              isVisibleBorder={false}
              isVisibleTitle={false}
            />
          </Router>
        )}
      </NexDiv>
    </NexStoreProvider>
  );
});

export default NexApp;
