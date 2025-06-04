import { presetIcons, presetWind4 } from "unocss";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import { groupIconVitePlugin } from "vitepress-plugin-group-icons";

// Helper to load JSON with import attributes
const loadJsonWithAttributes = async (path: string) => {
  const module = await import(path, { with: { type: 'json' } });
  return module.default;
};

export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [
        presetWind4(),
        presetIcons({
          collections: {
            mdi: () => loadJsonWithAttributes("@iconify-json/mdi/icons.json"),
          },
        }),
      ],
    }),
    groupIconVitePlugin(),
  ],
  // Add JSON plugin configuration
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.json': 'json',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
