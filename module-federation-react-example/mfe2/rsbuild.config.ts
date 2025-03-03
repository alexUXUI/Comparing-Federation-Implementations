import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "service",
      exposes: {
        "./component": "./src/App",
      },
      // shared: {
      //   react: {
      //     singleton: true,
      //     requiredVersion: "^19.0.0",
      //     eager: false,
      //   },
      //   "react-dom": {
      //     singleton: true,
      //     requiredVersion: "^19.0.0",
      //     eager: false,
      //   },
      // },
    }),
  ],
  server: {
    port: 4002,
    cors: true,
  },
  output: {
    assetPrefix: "http://localhost:4002/", // Add this to ensure assets are loaded from correct URL
  },
});
