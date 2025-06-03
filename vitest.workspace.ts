import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"./vite.config.ts",
	"./config/vite.config.ts",
	"./projects/ts-visualizer/vite.config.ts",
	"./projects/vitext/vitest.config.ts",
	"./projects/tldraw-vue/vite.config.ts",
	"./packages/components/vite.config.ts",
	"./projects/vitext/examples/vitext/vitext.config.ts",
	"./projects/template-starter/templates/vitepress/vite.config.ts",
	"./projects/template-starter/templates/vite-react/vite.config.ts",
	"./projects/template-starter/templates/lib-vite/vite.config.ts",
]);
