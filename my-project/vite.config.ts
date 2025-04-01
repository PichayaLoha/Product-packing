import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // ขนาด chunk warning ที่ต้องการ (KB)
  },
})
// import { defineConfig } from "vite";

// export default defineConfig({
//   server: {
//     port: 3000,
//   },
// });