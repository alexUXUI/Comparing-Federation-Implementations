import { init } from "@module-federation/enhanced/runtime";

init({
  name: "shell",
  remotes: [
    {
      name: "product",
      entry: "http://localhost:5001/mf-manifest.json",
    },
    {
      name: "services",
      entry: "http://localhost:5003/mf-manifest.json",
    },
  ],
});

import("./main");
