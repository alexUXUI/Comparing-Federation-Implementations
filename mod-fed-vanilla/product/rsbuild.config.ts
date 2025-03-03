import { defineConfig } from "@rsbuild/core";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  server: {
    port: 5001,
  },
  plugins: [
    pluginModuleFederation({
      name: "product",
      exposes: {
        "./component": "./src/index",
      },
    }),
  ],
});
