import type { ShikiTransformer } from "@shikijs/types";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { type DefaultTheme, defineConfig } from "vitepress";
import { groupIconMdPlugin } from "vitepress-plugin-group-icons";
import { withMermaid } from "vitepress-plugin-mermaid";
import { sidebar } from "./sidebar";

import viteConfig from "./vite.config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	vite: viteConfig,
	title: "My Awesome Project",
	description: "A VitePress Site",
	cleanUrls: true,
	sitemap: {
		hostname: "https://docs.kowork.io",
	},
	ignoreDeadLinks: false,
	head: [
		["link", { rel: "icon", href: "/favicon.svg" }],
		["meta", { property: "og:image", content: "/favicon.svg" }],
		["meta", { property: "og:title", content: "KoWork" }],
		["meta", { property: "og:description", content: "KoWork Documentation" }],
		["meta", { property: "og:type", content: "website" }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
		["meta", { name: "twitter:title", content: "KoWork" }],
		["meta", { name: "twitter:description", content: "KoWork Documentation" }],
		["meta", { name: "twitter:image", content: "/favicon.svg" }],
	],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: "/favicon.svg",
		nav: [
			{
				text: "Projects",
				items: [
					{ text: "All Projects", link: "/projects/all-projects" },
					{
						text: "Projects",
						items: [
							{ text: "Kogit", link: "/projects/kogit/overview" },
							{ text: "KoAI", link: "/projects/koai/overview" },
							{ text: "OpenAPI", link: "/projects/openapi/overview" },
							{
								text: "Command Palette",
								link: "/projects/command-palette/overview",
							},
						],
					},
				],
			},
			{
				text: "Products",
				items: [
					{ text: "All Products", link: "/products/all-products" },
					{
						text: "Prodcuts",
						items: [
							{ text: "AI Platform", link: "/products/ai-platform" },
							{
								text: "Services Platform",
								link: "/products/services-platform",
							},
							{ text: "Marketplace", link: "/products/marketplace" },
						],
					},
				],
			},
			{
				text: "Frameworks",
				items: [
					{ text: "All Framework", link: "/framework/all-framework" },

					{
						text: "Framework",
						items: [
							{ text: "Website", link: "/framework/website/overview" },
							{ text: "CLI", link: "/framework/cli/overview" },
							{ text: "AI", link: "/framework/ai/overview" },
							{ text: "Docs", link: "/framework/docs/overview" },
						],
					},
				],
			},
			{
				text: "APIs",
				items: [
					{ text: "All APIs", link: "/apis/all-apis" },
					{
						text: "APIs",
						items: [
							{ text: "Packages", link: "/apis/packages/overview" },
							{ text: "Components", link: "/apis/components/overview" },
							{ text: "Composables", link: "/apis/composables/overview" },
						],
					},
				],
			},

			{
				text: "Resources",
				items: [
					{ text: "Blog", link: "/resources/blog" },
					{ text: "Changelog", link: "/resources/changelog" },
					{ text: "Feedback", link: "/resources/feedback" },
				],
			},
		],

		sidebarMenuLabel: "Menu",
		sidebar: sidebar as DefaultTheme.Sidebar,
		search: {
			provider: "local",
		},
		editLink: {
			pattern: "https://github.com/kowork/kowork/edit/main/docs/:path",
		},
		carbonAds: {
			code: "your-carbon-code",
			placement: "your-carbon-placement",
		},

		socialLinks: [
			{ icon: "github", link: "https://github.com/kowork/kowork" },
			{ icon: "x", link: "https://x.com/kowork" },
			{ icon: "github", link: "https://github.com/kowork/kowork" },
			{ icon: "npm", link: "https://www.npmjs.com/package/@kowork/components" },
		],
	},
	markdown: {
		math: true,
		image: {
			lazyLoading: true,
		},
		config(md) {
			md.use(groupIconMdPlugin);
		},
		codeTransformers: [transformerTwoslash({}) as ShikiTransformer],
	},
});
