// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import "virtual:group-icons.css";
import "virtual:uno.css";
import CustomLayout from "../components/customLayout.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";

export default {
	extends: DefaultTheme,
	Layout: CustomLayout,
	enhanceApp({ app, router, siteData }) {
		// ...
		app.use(TwoslashFloatingVue);
	},
} satisfies Theme;
