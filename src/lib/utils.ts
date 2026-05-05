export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

let cachedMetaUrl: URL;
export function getMetaUrl(slug: string) {
  if (cachedMetaUrl) {
    cachedMetaUrl.pathname = `/og/${slug}.png`;
    return cachedMetaUrl.href;
  }

  cachedMetaUrl = new URL("https://thejohncaleb.vercel.app");
  cachedMetaUrl.pathname = `/og/${slug}.png`;
  return cachedMetaUrl.href;
}
