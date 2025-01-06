import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";
import externalize from "./src/plugins/externalize";

import mdx from "@astrojs/mdx";

// TODO: remove plugins
// https://astro.build/config
export default defineConfig({
  site: "https://thejohncaleb.vercel.app",
  integrations: [tailwind(), icon(), solidJs(), mdx()],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [[externalize, { domain: "https://thejohncaleb.vercel.app/" }]],
  },
  redirects: {
    "/live": { status: 302, destination: "https://youtube.com/@thejohncaleb" },
  },
});
