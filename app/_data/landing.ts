export const landingCopy = {
  hero: {
    eyebrow: "Early access",
    titleStart: "An",
    titleHighlight: "outpost",
    titleEnd: "for whatever you're building",
    description:
      "A shared space for your team and an AI agent to think, plan, and make things together.",
    primaryAction: "Start Building free",
    secondaryAction: "See how it works",
    videoLabel: "A preview of the Outpost workspace",
  },
  audience: {
    label: "A place to build, for",
    groups: [
      "Product teams",
      "Founders",
      "Solo builders",
      "Agencies",
      "Consultants",
    ],
  },
  features: {
    eyebrow: "Made to work together",
    heading: "One agent, one workspace, your whole team.",
    description:
      "Go from first sketch to shared plan without losing the thread.",
    items: [
      {
        id: "canvas",
        title: "Canvas",
        description:
          "An infinite whiteboard where the agent draws flowcharts, ERDs, architecture diagrams, and org charts shape by shape—and edits them in place when you ask.",
        bullets: [
          "Turn a prompt into a diagram, one shape at a time",
          "Ask for changes without starting over",
          "Keep the whole team on the same canvas",
        ],
      },
      {
        id: "docs",
        title: "Docs",
        description:
          "A block editor where the agent turns a diagram into a written spec, and rewrites or summarizes sections on command.",
        bullets: [
          "Draft a spec from your canvas",
          "Rewrite or summarize any section",
          "Keep decisions and diagrams together",
        ],
      },
      {
        id: "team-board",
        title: "Team board",
        description:
          "A kanban board of every workspace in your org, with live cursors so teammates can jump in together.",
        bullets: [
          "See work across every workspace",
          "Know what is moving and what is blocked",
          "Jump in together with live cursors",
        ],
      },
    ],
  },
  howItWorks: {
    eyebrow: "A simple way to get there",
    heading: "From first thought to finished work.",
    description:
      "Bring an idea, shape it with your agent, and make it better with your team.",
    steps: [
      {
        title: "Describe it",
        description:
          "Start with a question, a rough idea, or the problem you want to solve.",
      },
      {
        title: "Watch the agent draw",
        description:
          "See your idea take shape on the canvas, then turn it into a clear plan.",
      },
      {
        title: "Keep iterating together",
        description:
          "Make changes in place, invite your team in, and keep building from there.",
      },
    ],
  },
  pricing: {
    eyebrow: "Straightforward plans",
    heading: "Plans for how you build.",
    description:
      "Choose a plan that fits how you work, whether you're building solo or with your team.",

  },
  closing: {
    eyebrow: "Your next idea starts here",
    heading: "Let's see where you take it.",
    description:
      "Bring your team, bring your questions, and start building in Outpost.",
    action: "Start Building free",
    mascotAlt: "Outpost mascot",
  },
  footer: {
    copyright: "Made by Kayoum",
    tagline: "A little room to explore.",
  },
} as const;
