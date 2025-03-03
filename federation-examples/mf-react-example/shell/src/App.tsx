import React from "react";
import { loadRemote } from "@module-federation/enhanced/runtime";
import "./App.css";

const RemoteComponent = React.lazy(() => {
  console.time("mf-product");
  return loadRemote("product/component").then((module: any) => {
    console.timeEnd("mf-product");
    console.timeEnd("mf-shell");
    return { default: module.App };
  });
});

export function App() {
  return (
    <div className="App">
      <h1>Module Federation</h1>
      <h2>Shell 🐚</h2>

      <React.Suspense fallback="...">{<RemoteComponent />}</React.Suspense>
    </div>
  );
}
