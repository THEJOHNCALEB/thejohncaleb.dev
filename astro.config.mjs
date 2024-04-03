import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";
import gruvboxMaterialTheme from "./src/themes/gruvbox-material-dark.json";
import externalize from "./src/plugins/externalize";

import mdx from "@astrojs/mdx";

// TODO: remove plugins
// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), icon(), solidJs(), mdx()],
	markdown: {
		shikiConfig: {
			theme: gruvboxMaterialTheme,
		},
		rehypePlugins: [
			[
				externalize,
				{
					domain: "trulyao.dev",
				},
			],
		],
	},
	redirects: {
		"/live": {
			status: 302,
			destination: "https://twitch.tv/iamtrulyao",
		},
	},
});
