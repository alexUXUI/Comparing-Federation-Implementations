import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "product",
      exposes: {
        "./component": "./src/App",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
          eager: false,
        },
      },
    }),
  ],
  server: {
    port: 4001,
    cors: true,
  },
  output: {
    assetPrefix: "http://localhost:4001/", // Add this to ensure assets are loaded from correct URL
  },
});
