import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
    },
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
      ],
      input: {
        "specviz-react": "src/index.tsx",
        "axis": "src/axis.tsx",
        "format": "src/stringx.tsx",
        "rect": "src/rect.tsx",
        "keybinds": "src/keybinds.tsx",
      },
      output: {
        globals: {
          "react": "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [react()],
})
