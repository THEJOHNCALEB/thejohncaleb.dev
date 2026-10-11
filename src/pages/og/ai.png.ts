import type { APIRoute } from "astro";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return response.arrayBuffer();
}

export const GET: APIRoute = async () => {
  const fontRegular = await loadFont(
    "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.ttf",
  );
  const fontBold = await loadFont(
    "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-700-normal.ttf",
  );

  const template = `
<div style="display: flex; flex-direction: column; justify-content: space-between; width: 1200px; height: 630px; background: linear-gradient(135deg, #1b1a18 0%, #2b2823 100%); padding: 72px 88px; font-family: 'IBM Plex Mono'; position: relative;">
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <span style="display: flex; font-size: 22px; color: #e4af5d; font-weight: 700;">thejohncaleb.com/ai</span>
    <span style="display: flex; font-size: 18px; color: #faf1da; opacity: 0.55;">AI Masterclass · Cohort 1</span>
  </div>
  <div style="display: flex; flex-direction: column;">
    <span style="display: flex; font-size: 68px; font-weight: 700; color: #faf1da; line-height: 1.15; max-width: 1024px; letter-spacing: -0.02em;">The AI Builder's Masterclass</span>
    <span style="display: flex; margin-top: 26px; font-size: 28px; color: #b6aeaa; max-width: 900px;">Learn by building. Leave with real projects you can show.</span>
  </div>
  <div style="display: flex; gap: 16px; align-items: center;">
    <div style="display: flex; padding: 12px 24px; background-color: #e4af5d; color: #1b1a18; font-size: 22px; font-weight: 700; border-radius: 8px;"><span style="display: flex;">NGN 30K Early Bird · ends 25th Oct</span></div>
    <div style="display: flex; padding: 12px 24px; border: 2px solid #91867f; color: #faf1da; font-size: 22px; border-radius: 8px;"><span style="display: flex;">Limited to 30 seats</span></div>
  </div>
</div>`;

  const markup = html(template);

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "IBM Plex Mono", data: fontRegular, weight: 400, style: "normal" },
      { name: "IBM Plex Mono", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
};
