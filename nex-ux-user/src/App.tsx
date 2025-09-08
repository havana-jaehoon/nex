import React from "react";
import "./App.css";
import NexApp from "./NexApp";
import NexConfigStore from "applet/NexConfigStore";

function App() {
  const configStore = new NexConfigStore("", "", "");
  return <NexApp configStore={configStore} />;
}

export default App;
