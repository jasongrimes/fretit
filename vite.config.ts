/// <reference types="vitest" />

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "grimes-it",
      project: "javascript-react",
    }),
    tsconfigPaths(),
    TanStackRouterVite(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setup-tests.ts",
  },
  build: {
    sourcemap: true,
  },
});
