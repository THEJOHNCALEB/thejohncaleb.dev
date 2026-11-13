import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://thejohncaleb.com");

  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  const notes = await getCollection("notes", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );

  const sortedPosts = posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const sortedNotes = notes.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const projects = (await getCollection("projects"))?.[0]?.data ?? [];
  const talks = ((await getCollection("talks"))?.[0]?.data ?? []).sort(
    (a, b) => b.date.valueOf() - a.date.valueOf(),
  );

  const parts: string[] = [
    `# John Caleb - Full Site Content`,
    ``,
    `> Complete plain-text contents of thejohncaleb.com, provided for crawlers and AI bots.`,
    ``,
    `Source: ${new URL("/", base).href}`,
    `Canonical index: ${new URL("/llms.txt", base).href}`,
    ``,
    `## Blog posts`,
    ``,
  ];

  for (const post of sortedPosts) {
    parts.push(
      `### ${post.data.title}`,
      ``,
      `URL: ${new URL(`/posts/${post.slug}`, base).href}`,
      `Published: ${post.data.date.toISOString().split("T")[0]}`,
      `Tags: ${(post.data.tags ?? []).join(", ") || "none"}`,
      `Description: ${post.data.description}`,
      ``,
      post.body.trim(),
      ``,
    );
  }

  if (sortedNotes.length > 0) {
    parts.push(`## Notes`, ``);

    for (const note of sortedNotes) {
      parts.push(
        `### ${note.data.title}`,
        ``,
        `URL: ${new URL(`/notes/${note.slug}`, base).href}`,
        `Published: ${note.data.date.toISOString().split("T")[0]}`,
        `Tags: ${(note.data.tags ?? []).join(", ") || "none"}`,
        ...(note.data.description
          ? [`Description: ${note.data.description}`]
          : []),
        ``,
        note.body.trim(),
        ``,
      );
    }
  }

  parts.push(`## Projects`, ``);

  for (const project of projects) {
    parts.push(
      `### ${project.name}`,
      ``,
      `Status: ${project.status}`,
      `Description: ${project.description}`,
      `Tags: ${project.tags?.filter(Boolean).join(", ") || "none"}`,
      `Links:`,
      ...(project.links ?? []).map(
        (projectLink) => `- ${projectLink.title}: ${projectLink.url}`,
      ),
      ``,
    );
  }

  parts.push(`## Talks`, ``);

  for (const talk of talks) {
    parts.push(
      `### ${talk.title}`,
      ``,
      `Date: ${talk.date.toISOString().split("T")[0]}`,
      `Slides: ${talk.url}`,
      ``,
    );
  }

  parts.push(
    `## About the site`,
    ``,
    `Main pages: ${new URL("/", base).href}, ${new URL("/posts", base).href}, ${new URL("/notes", base).href}, ${new URL("/projects", base).href}, ${new URL("/talks", base).href}, ${new URL("/tools", base).href}, ${new URL("/ai", base).href}`,
    ``,
    `Feeds: ${new URL("/rss.xml", base).href} (RSS), ${new URL("/feed.json", base).href} (JSON Feed)`,
    ``,
    `Full Markdown versions of the remaining pages: ${new URL("/tools.md", base).href} (tools and stack), ${new URL("/ai.md", base).href} (AI masterclass), ${new URL("/index.md", base).href} (home and about)`,
    ``,
    `Contact: hey@thejohncaleb.com`,
    ``,
  );

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
