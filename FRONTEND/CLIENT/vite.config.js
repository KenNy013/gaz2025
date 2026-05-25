import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "img",
          dest: "assets",
        },
      ],
    }),
  ],
});
