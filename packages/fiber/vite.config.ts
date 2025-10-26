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
        id.endsWith("/thorvg-loader.js"),
      output: {
        paths: (id) => {
          if (id.endsWith("/thorvg-loader.js")) {
            return "./thorvg-loader.js";
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
        copyFileSync("../bindings/dist/thorvg.wasm", "dist/thorvg.wasm");
        copyFileSync(
          "../bindings/dist/thorvg-loader.js",
          "dist/thorvg-loader.js"
        );
      },
    },
  ],
});
