import React from "react";
import ReactDOM from "react-dom";
import { init } from "@module-federation/enhanced/runtime";

(async () => {
  console.time("mf-shell");

  console.time("mf-shell-init");

  await init({
    name: "shell",
    remotes: [
      {
        name: "product",
        entry: "http://localhost:4001/mf-manifest.json",
      },
    ],
    shared: {
      react: {
        version: "18.2.0",
        scope: "default",
        lib: () => React,
        shareConfig: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
      },
      "react-dom": {
        version: "18.2.0",
        scope: "default",
        lib: () => ReactDOM,
        shareConfig: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
      },
    },
    shareStrategy: "version-first",
  });

  console.timeEnd("mf-shell-init");

  await import("./main");
})();
