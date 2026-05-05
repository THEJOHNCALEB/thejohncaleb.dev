import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return response.arrayBuffer();
}

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}) satisfies any;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any;

  const fontRegular = await loadFont(
    "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.ttf",
  );
  const fontBold = await loadFont(
    "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-700-normal.ttf",
  );

  const date = new Date(post.data.date).toLocaleDateString("en-GB");

  const tagsHtml = (post.data.tags ?? [])
    .map(
      (tag: string) =>
        `<div style="display: flex; padding: 8px 18px; background-color: #f3e0b5; color: #894d23; font-size: 18px; border-radius: 6px;"><span style="display: flex;">${tag}</span></div>`,
    )
    .join("");

  const template = `
<div style="display: flex; flex-direction: column; justify-content: center; width: 1200px; height: 630px; background-color: #fdf9ef; padding: 80px 100px; font-family: 'IBM Plex Mono'; position: relative;">
  <div style="display: flex; position: absolute; top: 60px; left: 100px; right: 100px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="display: flex; width: 40px; height: 40px; border-radius: 6px; background-color: #e4af5d;"></div>
      <span style="display: flex; font-size: 22px; color: #1b1a18; opacity: 0.6;">thejohncaleb.dev</span>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; flex: 1; justify-content: center;">
    <span style="display: flex; font-size: 56px; font-weight: 700; color: #1b1a18; line-height: 1.25; max-width: 1000px; letter-spacing: -0.02em;">${post.data.title}</span>
    <span style="display: flex; margin-top: 32px; font-size: 24px; color: #91867f;">${date}</span>
  </div>
  <div style="display: flex; position: absolute; bottom: 60px; left: 100px; right: 100px;">
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      ${tagsHtml}
    </div>
  </div>
</div>`;

  const markup = html(template);

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "IBM Plex Mono", data: fontRegular, weight: 400, style: "normal" },
      { name: "IBM Plex Mono", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
};
