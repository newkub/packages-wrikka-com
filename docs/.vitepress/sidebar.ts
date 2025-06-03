import type { DefaultTheme } from "vitepress";
import sidebarAI from "./sidebar/sidebarAI";
import sidebarCLI from "./sidebar/sidebarCLI";
import sidebarComponents from "./sidebar/sidebarComponents";
import sidebarComposables from "./sidebar/sidebarComposables";
import sidebarDocs from "./sidebar/sidebarDocs";
import sidebarKoAI from "./sidebar/sidebarKoAI";
import sidebarKogit from "./sidebar/sidebarKogit";
import sidebarOpenAPI from "./sidebar/sidebarOpenAPI";
import sidebarPackages from "./sidebar/sidebarPackages";
import sidebarProducts from "./sidebar/sidebarProducts";
import sidebarWebsite from "./sidebar/sidebarWebsite";
import sidebarCommandPalette from "./sidebar/sidebarCommandPalette";

type SidebarItem = DefaultTheme.SidebarItem;

interface SidebarConfig {
	[key: string]: {
		logo?: string;
		items: SidebarItem[];
	};
}

export const sidebar: SidebarConfig = {
	"/apis/components": {
		logo: "",
		items: sidebarComponents(),
	},

	"/apis/packages": {
		logo: "",
		items: sidebarPackages(),
	},
	"/apis/composables": {
		logo: "",
		items: sidebarComposables(),
	},
	"/framework/ai": {
		logo: "",
		items: sidebarAI(),
	},
	"/framework/docs": {
		logo: "",
		items: sidebarDocs(),
	},
	"/framework/website": {
		logo: "",
		items: sidebarWebsite(),
	},
	"/framework/cli": {
		logo: "",
		items: sidebarCLI(),
	},
	"/projects/openapi": {
		logo: "",
		items: sidebarOpenAPI(),
	},
	"/projects/kogit": {
		logo: "",
		items: sidebarKogit(),
	},
	"/projects/koai": {
		logo: "",
		items: sidebarKoAI(),
	},
	"/projects/command-palette": {
		logo: "",
		items: sidebarCommandPalette(),
	},
};
