import { defineConfig } from "@rsbuild/core";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  server: {
    port: 5003,
  },
  plugins: [
    pluginModuleFederation({
      name: "services",
      exposes: {
        "./user": "./src/user",
      },
    }),
  ],
});
