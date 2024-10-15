import * as Vite from "vite"

// https://vitejs.dev/config/
export default Vite.defineConfig({
  build: {
    lib: {
      entry: [
        "src/index.ts",
        "src/action.tsx",
        "src/audio.tsx",
        "src/axis.tsx",
        "src/coord.ts",
        "src/format.ts",
        "src/hooks.tsx",
        "src/input.tsx",
        "src/keybinds.tsx",
        "src/math.ts",
        "src/note.tsx",
        "src/plane.tsx",
        "src/rect.ts",
        "src/svg.ts",
        "src/vector2.ts",
        "src/viewport.tsx",
      ],
      formats: ["es"],
    },
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
  },
})
