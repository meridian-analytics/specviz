import react from "@vitejs/plugin-react"
import * as Vite from "vite"

// https://vitejs.dev/config/
export default Vite.defineConfig({
  plugins: [react()],
  publicDir: "../../resources",
})
