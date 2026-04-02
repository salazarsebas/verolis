import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@verolis/institutional-domain": path.resolve(__dirname, "../../packages/institutional-domain/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    css: false,
  },
});
