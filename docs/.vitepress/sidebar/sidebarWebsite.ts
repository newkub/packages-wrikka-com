import type { DefaultTheme } from "vitepress";

export default function sidebarWebsite(): DefaultTheme.SidebarItem[] {
	return [
		{ text: "Overview", link: "/framework/website/overview" },
		{
			text: "Get Started",
			collapsed: false,
			base: "/framework/website/get-started",
			items: [{ text: "Usage", link: "/usage" }],
		},

		{
			text: "Development",
			collapsed: false,
			base: "/framework/website/development",
			items: [
				{ text: "Project Structure", link: "/project-structure" },
				{ text: "Linting", link: "/linting" },
				{ text: "Refactoring", link: "/refactoring" },
				{ text: "Tooling", link: "/tooling" },
			],
		},
		{
			text: "Frontend",
			collapsed: false,
			base: "/framework/website/frontend",
			items: [
				{ text: "Routing", link: "/routing" },
				{ text: "Rendering", link: "/rendering" },
				{ text: "Styling", link: "/styling" },
				{ text: "Fetching", link: "/fetching" },
				{ text: "Loading", link: "/loading" },
				{ text: "Animation", link: "/animation" },
				{ text: "LifeCycle", link: "/lifecycle" },
				{ text: "Deployment", link: "/deployment" },
			],
		},
		{
			text: "Backend",
			collapsed: false,
			base: "/framework/website/backend",
			items: [
				{ text: "Database", link: "/database" },
				{ text: "Authentication", link: "/authentication" },
				{ text: "Deployment", link: "/deployment" },
			],
		},
		{
			text: "Programming",
			collapsed: false,
			base: "/framework/website/programming",
			items: [
				{ text: "Error Hnadling", link: "/error-handling" },
				{ text: "Testing", link: "/testing" },
				{ text: "Performance", link: "/performance" },
				{ text: "Security", link: "/security" },
			],
		},
		{
			text: "APIs",
			collapsed: false,
			base: "/framework/website/apis",
			items: [
				{ text: "Config", link: "/config" },
				{ text: "Composables", link: "/composables" },
				{ text: "Components", link: "/components" },
			],
		},
	];
}
