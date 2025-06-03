import type { DefaultTheme } from "vitepress";

export default function sidebarProjects(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "All Projects", link: "/projects/all-projects" },
		{
			text: "Projects",
			collapsed: false,
			base: "/projects",
			items: [
				{ text: "Kogit", link: "/kogit" },
				{ text: "Kodocs", link: "/kodocs" },
			],
		},
	];
}
