import type { DefaultTheme } from "vitepress";

export default function sidebarKoAI(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/projects/koai/overview" },
		{
			text: "Commands",
			collapsed: false,
			base: "/projects/koai/commands",
			items: [
				{ text: "Ask", link: "/ask" },
				{ text: "MCP", link: "/mcp" },
			],
		},
	];
}
