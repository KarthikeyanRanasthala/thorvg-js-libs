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
      external: (id) => {
        return (
          id.endsWith("/wasm/thorvg-sw.js") ||
          id.endsWith("/wasm/thorvg-gl.js")
        );
      },
      output: {
        paths: (id) => {
          if (id.endsWith("/wasm/thorvg-sw.js")) {
            return "./thorvg-sw-loader.js";
          }

          if (id.endsWith("/wasm/thorvg-gl.js")) {
            return "./thorvg-gl-loader.js";
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
        copyFileSync("wasm/thorvg-sw.js", "dist/thorvg-sw-loader.js");
        copyFileSync("wasm/thorvg-sw.wasm", "dist/thorvg-sw.wasm");
        copyFileSync("wasm/thorvg-gl.js", "dist/thorvg-gl-loader.js");
        copyFileSync("wasm/thorvg-gl.wasm", "dist/thorvg-gl.wasm");
      },
    },
  ],
});
