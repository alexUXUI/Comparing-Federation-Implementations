import { defineConfig } from "@rsbuild/core";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  server: {
    port: 5002,
  },
  plugins: [
    pluginModuleFederation({
      name: "service",
      exposes: {
        "./component": "./src/index",
      },
    }),
  ],
});
