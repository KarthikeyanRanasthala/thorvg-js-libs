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
      external: (id) => id.endsWith("/wasm/thorvg.js"),
      output: {
        paths: (id) => {
          if (id.endsWith("/wasm/thorvg.js")) {
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
        copyFileSync("wasm/thorvg.js", "dist/thorvg-loader.js");
        copyFileSync("wasm/thorvg.wasm", "dist/thorvg.wasm");
      },
    },
  ],
});
