import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: __dirname,
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".next"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@verolis/institutional-domain": path.resolve(__dirname, "../../packages/institutional-domain/src/index.ts"),
    },
  },
});
