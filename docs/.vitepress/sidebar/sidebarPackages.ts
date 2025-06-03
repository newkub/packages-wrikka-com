import type { DefaultTheme } from "vitepress";

export default function sidebarPackages(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/apis/packages/overview" },
		{
			text: "Get Started",
			collapsed: false,
			base: "/apis/packages/get-started",
			items: [{ text: "Usage", link: "/usage" }],
		},
		{
			text: "Packages",
			collapsed: false,
			base: "/apis/packages/packages",
			items: [
				{ text: "All Packages", link: "/all-package" },
				{ text: "@kowork/server-action", link: "/server-action" },
				{ text: "@kowork/router", link: "/router" },
				{ text: "@kowork/lifecycle", link: "/lifecycle" },
				{ text: "@kowork/openapi", link: "/openapi" },
				{ text: "@kowork/auth", link: "/auth" },
				{ text: "@kowork/tasks", link: "/task" },
				{ text: "@kowork/plugins", link: "/plugins" },
				{ text: "@kowork/store", link: "/store" },
				{ text: "@kowork/rest-api", link: "/rest-api" },
				{ text: "@kowork/rpc", link: "/rpc" },
				{ text: "@kowork/sse", link: "/sse" },
				{ text: "@kowork/ssr", link: "/ssr" },
				{ text: "@kowork/validator", link: "/validator" },
				{ text: "@kowork/composables", link: "/composables" },
				{ text: "@kowork/components", link: "/components" },
			],
		},
	];
}
