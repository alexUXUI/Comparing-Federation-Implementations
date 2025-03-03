import React from "react";
import { loadRemoteModule } from "@softarc/native-federation";

const RemoteComponent = React.lazy(() => {
  console.time("nf-product");
  return loadRemoteModule({
    remoteName: "product",
    exposedModule: "./component",
  }).then((c) => {
    console.timeEnd("nf-product");
    console.timeEnd("nf-shell");
    return { default: c.App };
  });
});

export function App() {
  return (
    <div className="App">
      <h1>Native Federation</h1>
      <h2>Shell 🐚</h2>
      <React.Suspense fallback="Loading Product...">
        {<RemoteComponent />}
      </React.Suspense>
    </div>
  );
}
