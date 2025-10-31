import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { copyFileSync } from "fs";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": '"production"',
  },
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
        id.endsWith("/thorvg-sw-loader.js") ||
        id.endsWith("/thorvg-gl-loader.js"),
      output: {
        paths: (id) => {
          if (id.endsWith("/thorvg-sw-loader.js")) {
            return "./thorvg-sw-loader.js";
          }
          if (id.endsWith("/thorvg-gl-loader.js")) {
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
        copyFileSync(
          "../bindings/dist/thorvg-sw-loader.js",
          "dist/thorvg-sw-loader.js"
        );
        copyFileSync(
          "../bindings/dist/thorvg-gl-loader.js",
          "dist/thorvg-gl-loader.js"
        );
        copyFileSync("../bindings/dist/thorvg-sw.wasm", "dist/thorvg-sw.wasm");
        copyFileSync("../bindings/dist/thorvg-gl.wasm", "dist/thorvg-gl.wasm");
      },
    },
  ],
});
