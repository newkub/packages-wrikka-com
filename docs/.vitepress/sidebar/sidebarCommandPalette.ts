import type { DefaultTheme } from "vitepress";

export default function commandPalette(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/projects/command-palette/overview" },
		{
			text: "Get Started",
			collapsed: false,
			base: "/projects/command-palette/get-started",
			items: [{ text: "Usage", link: "/usage" }],
		},

		{
			text: "Guide",
			collapsed: false,
			base: "/projects/command-palette/guide",
			items: [
				{ text: "Download", link: "/download" },
				{ text: "Features", link: "/features" },
				{ text: "Usage", link: "/usage" },
				{ text: "Price", link: "/price" },
				{ text: "Pricing", link: "/pricing" },
			],
		},
	];
}
