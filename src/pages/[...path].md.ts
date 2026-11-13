import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { slugify } from "@lib/utils";

const ABOUT = `Kon'nichiwa! I am John, a software engineer with years of experience in software development. Currently working at a Stealth Startup (Manchester, England), previously at Smartqix LLC (Ohio, USA) and Tirith Technology LLC (Ohio, USA). I am constantly learning and very keen on crafting the type of software experience I'd like to use and you can fall in love with. I write here from time to time.`;

const TOOLS = [
  {
    category: "Languages",
    items: [
      ["Dart", "My primary language for Flutter apps, clean and productive."],
      [
        "TypeScript",
        "Better JavaScript with static typing, making codebases more predictable.",
      ],
      ["Swift", "Native iOS development language."],
      ["JavaScript", "For web frontends and quick scripts."],
      [
        "C#",
        "My primary language for building robust full-stack web applications.",
      ],
      ["PHP", "Picked up PHP (Laravel) because I needed it for work."],
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: [
      [
        "Flutter",
        "My go-to framework for building beautiful, cross-platform applications.",
      ],
      ["SwiftUI", "Declarative UI for Apple platforms."],
      ["React.js", "Building dynamic and reusable UI components."],
      ["ASP.NET MVC", "Robust web apps with C#."],
      ["Laravel", "PHP web framework for quick, elegant apps."],
      ["Riverpod", "State management for Flutter that scales."],
      ["Bloc", "Predictable state management for Flutter."],
    ],
  },
  {
    category: "Databases",
    items: [
      ["PostgreSQL", "Relational database for structured data."],
      ["MySQL", "Classic relational database."],
      ["MongoDB", "NoSQL for flexible schemas."],
      ["SQLite", "Embedded database for mobile apps."],
      ["Supabase", "Open source Firebase alternative."],
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      ["AWS", "Cloud services for hosting and scaling."],
      ["GCP", "Google Cloud Platform."],
      ["DigitalOcean", "Simple and reliable cloud hosting."],
      ["Docker", "Containerizing everything."],
      ["Kubernetes", "Orchestrating containers at scale."],
      ["GitHub Actions", "CI/CD pipelines that just work."],
      ["Hostinger", "Affordable hosting for quick deploys."],
    ],
  },
  {
    category: "AI & ML",
    items: [
      ["OpenAI API", "Building AI-powered features."],
      ["Gemini API", "Google's AI models."],
      ["Gemma", "Running models on-device with LiteRT-LM."],
      ["LLM Integration", "Weaving AI into products."],
      ["AI-Powered Features", "AI features in production apps."],
    ],
  },
];

const PRACTICES = [
  "Agile / Scrum",
  "REST APIs",
  "Code Review",
  "TDD",
  "Systems Design",
  "Mobile (iOS & Android)",
];

function link(title: string, url: string, description?: string) {
  return `- [${title}](${url})${description ? `: ${description}` : ""}`;
}

function isoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export const getStaticPaths: GetStaticPaths = async () => {
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

  return [
    { params: { path: "index" } },
    { params: { path: "posts" } },
    { params: { path: "projects" } },
    { params: { path: "notes" } },
    { params: { path: "talks" } },
    { params: { path: "tools" } },
    { params: { path: "ai" } },
    ...posts.map((post) => ({ params: { path: `posts/${post.slug}` } })),
    ...tags.map((tag) => ({ params: { path: `tags/${slugify(tag)}` } })),
  ];
};

export const GET: APIRoute = async ({ params, site }) => {
  const base = site ?? new URL("https://thejohncaleb.com");
  const path = params.path ?? "";
  const url = (pathname: string) => new URL(pathname, base).href;

  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  const notes = await getCollection("notes", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  const projects = (await getCollection("projects"))?.[0]?.data ?? [];
  const talks = ((await getCollection("talks"))?.[0]?.data ?? []).sort(
    (a, b) => b.date.valueOf() - a.date.valueOf(),
  );

  const sortedPosts = [...posts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const sortedNotes = [...notes].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  let markdown = "";

  if (path === "index") {
    markdown = [
      `# John Caleb`,
      ``,
      `> Software engineer based in Manchester, England.`,
      ``,
      `Canonical page: ${url("/")}`,
      ``,
      `## About`,
      ``,
      ABOUT,
      ``,
      `## Featured projects`,
      ``,
      ...projects
        .slice(0, 4)
        .map((project) =>
          link(
            project.name,
            project.links?.[0]?.url ?? url("/projects"),
            project.description,
          ),
        ),
      ``,
      `## Latest posts`,
      ``,
      ...sortedPosts
        .slice(0, 4)
        .map((post) =>
          link(
            post.data.title,
            url(`/posts/${post.slug}`),
            `${post.data.description} (${isoDate(post.data.date)})`,
          ),
        ),
      ``,
      `## Talks`,
      ``,
      ...talks.map((talk) =>
        link(talk.title, talk.url, `Presented on ${isoDate(talk.date)}`),
      ),
      ``,
      `## Main pages`,
      ``,
      link("Posts", url("/posts")),
      link("Notes", url("/notes")),
      link("Projects", url("/projects")),
      link("Talks", url("/talks")),
      link("Tools", url("/tools")),
      link("AI Masterclass", url("/ai")),
      ``,
      `## Contact`,
      ``,
      `- Email: hey@thejohncaleb.com`,
      `- X: https://x.com/thejohncaleb`,
      `- GitHub: https://github.com/thejohncaleb`,
      `- LinkedIn: https://linkedin.com/in/thejohncaleb`,
      `- Book a call: https://cal.com/thejohncaleb/15min`,
      ``,
    ].join("\n");
  } else if (path === "posts") {
    markdown = [
      `# Posts`,
      ``,
      `Thoughts on building stuff, life, and whatever I find interesting.`,
      ``,
      `Canonical page: ${url("/posts")}`,
      ``,
      ...sortedPosts.map((post) =>
        link(
          post.data.title,
          url(`/posts/${post.slug}`),
          `${post.data.description} (${isoDate(post.data.date)})`,
        ),
      ),
      ``,
    ].join("\n");
  } else if (path.startsWith("posts/")) {
    const slug = path.slice("posts/".length);
    const post = posts.find((entry) => entry.slug === slug);

    if (!post) {
      return new Response("Not found", { status: 404 });
    }

    markdown = [
      `# ${post.data.title}`,
      ``,
      `Canonical page: ${url(`/posts/${post.slug}`)}`,
      `Published: ${isoDate(post.data.date)}`,
      `Description: ${post.data.description}`,
      `Tags: ${(post.data.tags ?? []).join(", ") || "none"}`,
      ``,
      post.body.trim(),
      ``,
    ].join("\n");
  } else if (path === "projects") {
    markdown = [
      `# Projects`,
      ``,
      `In my free time, I enjoy working on side projects to explore new tools and technologies. I focus on building solutions people love and experimenting with diverse stacks to expand my skills.`,
      ``,
      `Canonical page: ${url("/projects")}`,
      ``,
      ...projects.flatMap((project) => [
        `## ${project.name}`,
        ``,
        project.description,
        ``,
        `- Status: ${project.status}`,
        `- Tags: ${project.tags?.filter(Boolean).join(", ") || "none"}`,
        ...(project.links ?? []).map(
          (projectLink) => `- ${projectLink.title}: ${projectLink.url}`,
        ),
        ``,
      ]),
      `More on GitHub: https://github.com/thejohncaleb`,
      ``,
    ].join("\n");
  } else if (path === "notes") {
    markdown = [
      `# Notes`,
      ``,
      `My (short) notes on a variety of topics, including software development, design, and more that I find useful or interesting enough.`,
      ``,
      `Canonical page: ${url("/notes")}`,
      ``,
      ...(sortedNotes.length > 0
        ? sortedNotes.map((note) =>
            link(
              note.data.title,
              url("/notes"),
              `${note.data.description ?? ""} (${isoDate(note.data.date)})`.trim(),
            ),
          )
        : ["No notes have been published yet."]),
      ``,
    ].join("\n");
  } else if (path === "talks") {
    markdown = [
      `# Talks & Slides`,
      ``,
      `Conference talks, workshops, and presentations I've delivered. I enjoy sharing knowledge and connecting with the developer community.`,
      ``,
      `Canonical page: ${url("/talks")}`,
      ``,
      ...talks.map((talk) =>
        link(talk.title, talk.url, `Presented on ${isoDate(talk.date)}`),
      ),
      ``,
    ].join("\n");
  } else if (path === "tools") {
    markdown = [
      `# Tools`,
      ``,
      `My primary stack includes Flutter, C#, and TypeScript, but I have also explored other tools and languages, either out of necessity or curiosity.`,
      ``,
      `Canonical page: ${url("/tools")}`,
      ``,
      ...TOOLS.flatMap((group) => [
        `## ${group.category}`,
        ``,
        ...group.items.map(
          ([name, description]) => `- **${name}**: ${description}`,
        ),
        ``,
      ]),
      `## Practices`,
      ``,
      ...PRACTICES.map((practice) => `- ${practice}`),
      ``,
    ].join("\n");
  } else if (path === "ai") {
    markdown = [
      `# The AI Builder's Masterclass`,
      ``,
      `> Learn by building. A 4-week live masterclass where you build real projects - websites, apps, games and AI agents. Starts 9th Nov 2026. Only 30 seats. N30K early bird.`,
      ``,
      `Canonical page: ${url("/ai")}`,
      ``,
      `## What you'll get`,
      ``,
      `- Live, hands-on sessions: Build real AI projects as you learn, with direct feedback in every class.`,
      `- Launch your own app, game, website and AI agent: You don't just learn the theory, you ship real, working projects.`,
      `- Beginner-friendly: No prior coding experience needed. We start from the very foundations.`,
      `- Certificate + community access: Get a certificate on completion and lifetime access to a private WhatsApp community.`,
      `- Career toolkit: Use AI to improve your CV, cover letters, LinkedIn profile and interview prep.`,
      ``,
      `## Course outline`,
      ``,
      `- Week 1 - AI foundations: How AI tools work; writing prompts that get results; setting up your tools and workspace; building your first mini project.`,
      `- Week 2 - Websites & apps: Turn an idea into a working website; build a simple app with AI; connect forms, data and basic features; deploy it live.`,
      `- Week 3 - Games: Plan a simple game with AI; build and test gameplay; add visuals, scoring and levels; publish and share it.`,
      `- Week 4 - AI agents, career toolkit & final project: Build an AI agent that performs tasks; connect it to tools; use AI to tailor your CV and write strong cover letters; optimize your LinkedIn profile and prepare for interviews with AI; finish and present your own final project; get next steps and a certificate.`,
      ``,
      `## About the instructor`,
      ``,
      `John Caleb is a Senior Software Engineer and the CTO of Naijaradar, where he leads engineering on AI-powered products. He has shipped software for startups and teams across the US and UK, and now helps other people learn to build real things with AI.`,
      ``,
      `- X: https://x.com/thejohncaleb`,
      `- GitHub: https://github.com/thejohncaleb`,
      `- LinkedIn: https://linkedin.com/in/thejohncaleb`,
      ``,
      `## Class details`,
      ``,
      `- Starts: Monday, 9th Nov 2026`,
      `- Format: Live online on Google Meet`,
      `- Schedule: 2 sessions a week`,
      `- Session length: 1 hour 30 minutes`,
      `- Duration: 4 weeks (8 sessions)`,
      `- Meeting link: Shared in the private WhatsApp community after payment`,
      ``,
      `## Who it's for`,
      ``,
      `Students, creators, freelancers, entrepreneurs and anyone who wants to build with AI. No coding experience needed. Job seekers who want to stand out with real projects and AI-assisted applications.`,
      ``,
      `## Pricing`,
      ``,
      `- Early Bird: N30,000`,
      `- Regular: N50,000`,
      `- Limited to 30 seats`,
      `- Register: https://selar.com/6291g2y875`,
      ``,
      `## Refund policy`,
      ``,
      `Refunds are available. Request a full refund before the second session by messaging us on WhatsApp - just DM us and we'll sort it out, no hassle.`,
      ``,
      `## FAQ`,
      ``,
      `### Do I need coding experience?`,
      `No, the class is beginner-friendly and we start from the foundations.`,
      ``,
      `### Is it live or recorded?`,
      `It's live on Google Meet, with 2 sessions a week (Monday & Wednesday) at 7:00 PM WAT.`,
      ``,
      `### Will this help with job applications?`,
      `Yes. Week 4 covers using AI for your CV, cover letters, LinkedIn profile and interview preparation, and you'll finish with projects you can show employers.`,
      ``,
      `### What do I need to join?`,
      `A laptop (preferred), a stable internet connection and a free Google account.`,
      ``,
      `### How do I join the class?`,
      `Pay on Selar, then you'll receive the private WhatsApp community invite with the Google Meet details.`,
      ``,
      `### Will I get a certificate?`,
      `Yes, you'll get a certificate on completing the class.`,
      ``,
      `### What if I miss a session?`,
      `Recordings are shared in the private WhatsApp community, and you can ask questions there anytime.`,
      ``,
      `### Can I get a refund?`,
      `Yes - see the refund policy above.`,
      ``,
    ].join("\n");
  } else if (path.startsWith("tags/")) {
    const tag = path.slice("tags/".length);
    const taggedPosts = sortedPosts.filter((post) =>
      (post.data.tags ?? []).some((postTag) => slugify(postTag) === tag),
    );
    const taggedProjects = projects.filter((project) =>
      (project.tags ?? []).some(
        (projectTag) => projectTag && slugify(projectTag) === tag,
      ),
    );

    markdown = [
      `# Tag: ${tag}`,
      ``,
      `Canonical page: ${url(`/tags/${tag}`)}`,
      ``,
      `## Articles`,
      ``,
      ...(taggedPosts.length > 0
        ? taggedPosts.map((post) =>
            link(
              post.data.title,
              url(`/posts/${post.slug}`),
              `${post.data.description} (${isoDate(post.data.date)})`,
            ),
          )
        : ["No articles found with this tag."]),
      ``,
      `## Projects`,
      ``,
      ...(taggedProjects.length > 0
        ? taggedProjects.map((project) =>
            link(
              project.name,
              project.links?.[0]?.url ?? url("/projects"),
              project.description,
            ),
          )
        : ["No projects found with this tag."]),
      ``,
    ].join("\n");
  }

  if (!markdown) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
