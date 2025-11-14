/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { copyFileSync } from "fs";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      external: (id) =>
        id.includes("react-reconciler") ||
        id.includes("react") ||
        id.includes("react/jsx-runtime") ||
        id.endsWith("/thorvg-sw-web-loader.js") ||
        id.endsWith("/thorvg-gl-web-loader.js"),
      output: {
        paths: (id) => {
          if (id.endsWith("/thorvg-sw-web-loader.js")) {
            return "./thorvg-sw-web-loader.js";
          }
          if (id.endsWith("/thorvg-gl-web-loader.js")) {
            return "./thorvg-gl-web-loader.js";
          }
          return id;
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      name: "copy-wasm",
      closeBundle() {
        copyFileSync(
          "../bindings/dist/thorvg-sw-web-loader.js",
          "dist/thorvg-sw-web-loader.js"
        );
        copyFileSync(
          "../bindings/dist/thorvg-gl-web-loader.js",
          "dist/thorvg-gl-web-loader.js"
        );
        copyFileSync("../bindings/dist/thorvg-sw.wasm", "dist/thorvg-sw.wasm");
        copyFileSync("../bindings/dist/thorvg-gl.wasm", "dist/thorvg-gl.wasm");
      },
    },
  ],
  test: {},
});
