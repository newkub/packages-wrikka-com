import { defineConfig } from 'vite'
import image from '@wrikka/vite-image'

export default defineConfig({
  plugins: [
    image(
      {
        size: {
          width: 100,
          height: 100,
        },
        convertTo: 'webp',
        compression : 85
      }
    )
  ]
})