import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// URLのpathnameをWindowsのドライブパスとPOSIXパスの両方で利用できる形にする。
const sourcePath = (relative: string) => decodeURIComponent(new URL(relative, import.meta.url).pathname)
  .replace(/^\/([A-Za-z]:\/)/, "$1");

export default defineConfig({
  resolve: {
    alias: {
      "@gridra-ui/core": sourcePath("../../packages/core/src/index.ts"),
      "@gridra-ui/headless": sourcePath("../../packages/headless/src/index.ts"),
      "@gridra-ui/react": sourcePath("../../packages/react/src/index.ts")
    }
  },
  plugins: [react()]
});
