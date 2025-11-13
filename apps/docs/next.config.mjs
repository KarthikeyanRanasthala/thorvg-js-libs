import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config) => {
    // Enable WebAssembly support
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Handle WASM files as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    // Don't parse Emscripten loader files - they use import.meta.url
    config.module.rules.push({
      test: /thorvg-.*-loader\.js$/,
      type: "javascript/auto",
      parser: {
        url: false,
      },
    });

    return config;
  },
};

export default withMDX(config);
