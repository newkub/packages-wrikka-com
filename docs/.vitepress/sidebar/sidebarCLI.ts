import type { DefaultTheme } from "vitepress";

export default function sidebarCLI(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/framework/cli/overview" },
		{
			text: "Get Started",
			collapsed: false,
			base: "/framework/cli/get-started",
			items: [{ text: "Usage", link: "/usage" }],
		},

		{
			text: "Terminal Interface",
			collapsed: false,
			base: "/framework/cli/terminal-interface",
			items: [
				{ text: "Prompts", link: "/prompts" },
				{ text: "Commands", link: "/commands" },
				{ text: "Logger", link: "/logger" },
				{ text: "Table", link: "/table" },
				{ text: "Loading", link: "/loading" },
				{ text: "Tasks", link: "/tasks" },
				{ text: "Search", link: "/search" },
				{ text: "Instructions", link: "/instructions" },
			],
		},
	];
}
