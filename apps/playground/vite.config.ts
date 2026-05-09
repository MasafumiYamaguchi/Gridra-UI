import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      "@gridra-ui/core": new URL("../../packages/core/src/index.ts", import.meta.url).pathname,
      "@gridra-ui/react": new URL("../../packages/react/src/index.ts", import.meta.url).pathname
    }
  },
  plugins: [react()]
});
