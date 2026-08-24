import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";
import externalize from "./src/plugins/externalize";

import mdx from "@astrojs/mdx";

// TODO: remove plugins
// https://astro.build/config
export default defineConfig({
  site: "https://thejohncaleb.com",
  integrations: [tailwind(), icon(), solidJs(), mdx()],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [
      [externalize, { domain: "https://thejohncaleb.vercel.app/" }],
    ],
  },
  redirects: {
    "/live": { status: 302, destination: "https://youtube.com/@thejohncaleb" },
    "/tlc": { status: 302, destination: "https://canva.link/g0ev0fmlx720c32" },
    "/cv": {
      status: 302,
      destination:
        "https://drive.google.com/file/d/1uBOHYl83a4KrInTAt3jjN7DfUbbZ6NqQ/view",
    },
  },
});
