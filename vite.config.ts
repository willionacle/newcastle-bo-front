import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
    server: {
      host: "0.0.0.0",
    },
    define: {
      "process.env": env,
    },
    build: {
      // esbuild (Vite's default) minifies ~4x faster than terser and drops
      // console/debugger natively via `esbuild.drop` below — terser was only
      // here for drop_console, and cost ~70% of the build for a 1% smaller
      // bundle.
      minify: "esbuild",
      // outDir: '../NX-Backoffice/src/dist'
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
  }
});
