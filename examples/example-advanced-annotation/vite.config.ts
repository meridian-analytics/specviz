import react from "@vitejs/plugin-react"
import * as Vite from "vite"

// https://vitejs.dev/config/
export default Vite.defineConfig({
  build: {
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
    },
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      input: {
        "specviz-react": "src/index.tsx",
        format: "src/format.tsx",
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [react()],
  publicDir: "../../resources",
})
