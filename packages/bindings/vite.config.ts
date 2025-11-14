import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { copyFileSync } from "fs";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
    },
    minify: false,
    rollupOptions: {
      external: (id) =>
        id.endsWith("/wasm/thorvg-sw-web.js") ||
        id.endsWith("/wasm/thorvg-sw-node.js") ||
        id.endsWith("/wasm/thorvg-gl-web.js"),
      output: [
        {
          entryFileNames: "bindings-web.js",
          format: "es",
          paths: (id) => {
            if (id.endsWith("/wasm/thorvg-sw-web.js")) {
              return "./thorvg-sw-web-loader.js";
            }

            if (id.endsWith("/wasm/thorvg-gl-web.js")) {
              return "./thorvg-gl-web-loader.js";
            }

            return id;
          },
        },
        {
          entryFileNames: "bindings-node.js",
          format: "es",
          paths: (id) => {
            if (id.endsWith("/wasm/thorvg-sw-web.js")) {
              return "./thorvg-sw-node-loader.js";
            }

            if (id.endsWith("/wasm/thorvg-gl-web.js")) {
              return "./thorvg-gl-node-loader.js";
            }

            return id;
          },
        },
      ],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      name: "copy-wasm",
      closeBundle() {
        copyFileSync("wasm/thorvg-sw-web.js", "dist/thorvg-sw-web-loader.js");
        copyFileSync("wasm/thorvg-sw-node.js", "dist/thorvg-sw-node-loader.js");
        copyFileSync("wasm/thorvg-gl-web.js", "dist/thorvg-gl-web-loader.js");
        copyFileSync("wasm/thorvg-gl-node.js", "dist/thorvg-gl-node-loader.js");
        copyFileSync("wasm/thorvg-sw.wasm", "dist/thorvg-sw.wasm");
        copyFileSync("wasm/thorvg-gl.wasm", "dist/thorvg-gl.wasm");
      },
    },
  ],
});
