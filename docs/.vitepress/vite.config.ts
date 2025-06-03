import { presetIcons, presetWind4 } from "unocss";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import { groupIconVitePlugin } from "vitepress-plugin-group-icons";

export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetWind4(),
				presetIcons({
					collections: {
						mdi: () =>
							import("@iconify-json/mdi/icons.json").then((i) => i.default),
					},
				}),
			],
		}),
		groupIconVitePlugin(),
	],
});
