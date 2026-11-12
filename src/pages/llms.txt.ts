import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

function link(title: string, url: string, description?: string) {
  return `- [${title}](${url})${description ? `: ${description}` : ""}`;
}

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

  const sections = [
    `# John Caleb`,
    ``,
    `> John Caleb is a software engineer based in Manchester, England. He builds mobile and web software, writes about engineering and life, and shares his projects, talks, and tools.`,
    ``,
    `This site contains all of John's public content: blog posts, notes, projects, talks, a tools list, and details about his AI masterclass. Everything is publicly accessible to crawlers and AI bots.`,
    ``,
    `## Main pages`,
    ``,
    link("Home", new URL("/", base).href, "About John and latest content"),
    link("Posts", new URL("/posts", base).href, "All blog posts"),
    link("Notes", new URL("/notes", base).href, "Short notes on software, design, and more"),
    link("Projects", new URL("/projects", base).href, "Side projects and products"),
    link("Talks", new URL("/talks", base).href, "Conference talks and slides"),
    link("Tools", new URL("/tools", base).href, "Languages, frameworks, databases, cloud, and AI tools John uses"),
    link("AI Masterclass", new URL("/ai", base).href, "The AI Builder's Masterclass course details"),
    ``,
    `## Posts`,
    ``,
    ...sortedPosts.map((post) =>
      link(
        post.data.title,
        new URL(`/posts/${post.slug}`, base).href,
        `${post.data.description} (${post.data.date.toISOString().split("T")[0]})`,
      ),
    ),
    ``,
    ...(sortedNotes.length > 0
      ? [
          `## Notes`,
          ``,
          ...sortedNotes.map((note) =>
            link(
              note.data.title,
              new URL(`/notes/${note.slug}`, base).href,
              `${note.data.description ?? ""} (${note.data.date.toISOString().split("T")[0]})`.trim(),
            ),
          ),
          ``,
        ]
      : []),
    `## Projects`,
    ``,
    ...projects.map((project) =>
      link(
        project.name,
        project.links?.[0]?.url ?? new URL("/projects", base).href,
        `${project.description} (status: ${project.status}${
          project.tags?.length
            ? `; tags: ${project.tags.filter(Boolean).join(", ")}`
            : ""
        })`,
      ),
    ),
    ``,
    `## Talks`,
    ``,
    ...talks.map((talk) =>
      link(
        talk.title,
        talk.url,
        `Presented on ${talk.date.toISOString().split("T")[0]}`,
      ),
    ),
    ``,
    `## Feeds and indexes`,
    ``,
    link("RSS feed", new URL("/rss.xml", base).href),
    link("JSON Feed", new URL("/feed.json", base).href),
    link("Sitemap", new URL("/sitemap.xml", base).href),
    link(
      "Full site content (llms-full.txt)",
      new URL("/llms-full.txt", base).href,
      "Complete plain-text contents of every post, note, project, and talk",
    ),
    ``,
    `## Contact`,
    ``,
    `- Email: [hey@thejohncaleb.com](mailto:hey@thejohncaleb.com)`,
    `- X: [@thejohncaleb](https://x.com/thejohncaleb)`,
    `- GitHub: [thejohncaleb](https://github.com/thejohncaleb)`,
    `- LinkedIn: [thejohncaleb](https://linkedin.com/in/thejohncaleb)`,
    `- Book a call: [cal.com/thejohncaleb/15min](https://cal.com/thejohncaleb/15min)`,
    ``,
  ];

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
