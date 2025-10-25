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
        id.includes("/wasm/thorvg") || id === "path" || id === "url",
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      name: "copy-wasm",
      closeBundle() {
        copyFileSync("wasm/thorvg.wasm", "dist/thorvg.wasm");
      },
    },
  ],
});
