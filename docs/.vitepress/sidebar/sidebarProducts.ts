import type { DefaultTheme } from "vitepress";

export default function sidebarProducts(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/products/overview" },
		{
			text: "Products",
			collapsed: false,
			base: "/products",
			items: [
				{ text: "AI Platform", link: "/ai-platform" },
				{ text: "Services Platform", link: "/services-platform" },
				{ text: "Marketplace", link: "/marketplace" },
			],
		},
	];
}
