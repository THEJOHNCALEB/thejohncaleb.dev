import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { slugify } from "@lib/utils";

const STATIC_PAGES = [
  "/",
  "/posts",
  "/notes",
  "/projects",
  "/talks",
  "/tools",
  "/ai",
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://thejohncaleb.com");

  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );

  const projects = (await getCollection("projects"))?.[0]?.data ?? [];

  const tags = [
    ...new Set(
      [
        ...posts.flatMap((post) => post.data.tags ?? []),
        ...projects.flatMap((project) => project.tags ?? []),
      ].filter((tag): tag is string => !!tag),
    ),
  ];

  const urls: { loc: string; lastmod?: Date }[] = [
    ...STATIC_PAGES.map((path) => ({ loc: new URL(path, base).href })),
    ...posts.map((post) => ({
      loc: new URL(`/posts/${post.slug}`, base).href,
      lastmod: post.data.date,
    })),
    ...tags.map((tag) => ({
      loc: new URL(`/tags/${slugify(tag)}`, base).href,
    })),
  ];

  const body = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${
          lastmod ? `    <lastmod>${lastmod.toISOString()}</lastmod>\n` : ""
        }  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
};
