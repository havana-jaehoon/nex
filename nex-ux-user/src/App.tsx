import React from "react";
import NexApp from "./NexApp";
import { configStore } from "store/NexConfigStore";

function App() {
  return <NexApp configStore={configStore} />;
}

export default App;
