import {
  AlignLeft,
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bold,
  Check,
  ChevronDown,
  Circle,
  Command,
  FileText,
  Frame,
  LayoutGrid,
  Layers2,
  MoreHorizontal,
  MousePointer2,
  Plus,
  Sparkles,
  StickyNote,
  Type,
  Workflow,
} from "lucide-react";

type FeatureSurface = "canvas" | "docs" | "team-board";

const chrome =
  "overflow-hidden rounded-xl border border-white/10 bg-[#111112] shadow-2xl shadow-black/20";

function SurfaceHeader({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Workflow;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-white/8 px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-3.5" />
        </div>
        <span className="truncate text-[11px] font-medium text-foreground/90 sm:text-xs">
          {title}
        </span>
        <span className="hidden text-[10px] text-muted-foreground sm:inline">
          / {detail}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-3 text-muted-foreground sm:block"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex -space-x-1.5">
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#111112] bg-indigo-400 text-[8px] font-semibold text-black">
            A
          </span>
          <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#111112] bg-emerald-300 text-[8px] font-semibold text-black">
            M
          </span>
        </div>
        <button
          type="button"
          aria-label="More options"
          className="ml-1 flex size-7 items-center justify-center rounded-md text-muted-foreground"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}

function CanvasMock() {
  return (
    <div
      role="img"
      aria-label="Canvas mockup showing a web app flow branching into API and database services"
      className={chrome}
    >
      <SurfaceHeader icon={Workflow} title="Launch flow" detail="Canvas" />
      <div className="flex h-[19rem]">
        <div className="hidden w-11 shrink-0 flex-col items-center gap-2 border-r border-white/8 py-3 sm:flex">
          {[MousePointer2, Frame, StickyNote, Type, Workflow].map((Icon, i) => (
            <span
              key={i}
              className={`flex size-7 items-center justify-center rounded-md ${
                i === 0
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon aria-hidden="true" className="size-3.5" />
            </span>
          ))}
          <span className="mt-auto flex size-7 items-center justify-center rounded-md border border-white/8 text-muted-foreground">
            <Plus aria-hidden="true" className="size-3.5" />
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden bg-[#171819] [background-image:radial-gradient(oklch(1_0_0_/_10%)_1px,transparent_1px)] [background-size:18px_18px]">
          <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-md border border-white/8 bg-[#202122]/90 px-2 py-1 text-[9px] text-muted-foreground backdrop-blur">
            <Layers2 aria-hidden="true" className="size-3" />
            User onboarding
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <defs>
              <marker
                id="canvas-arrowhead"
                markerWidth="4"
                markerHeight="4"
                refX="3.5"
                refY="2"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0 0L4 2L0 4z" fill="#77736d" />
              </marker>
            </defs>
            <path
              d="M50 36V41"
              fill="none"
              stroke="#77736d"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#canvas-arrowhead)"
            />
            <path
              d="M50 60V67H27V73"
              fill="none"
              stroke="#77736d"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#canvas-arrowhead)"
            />
            <path
              d="M50 67H73V73"
              fill="none"
              stroke="#77736d"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#canvas-arrowhead)"
            />
            <circle cx="50" cy="67" r="0.9" fill="#77736d" />
          </svg>
          <div className="absolute left-1/2 top-[19%] z-10 flex w-32 -translate-x-1/2 items-center gap-2 rounded-lg border border-white/10 bg-[#242526] px-3 py-2.5 shadow-xl">
            <span className="flex size-6 items-center justify-center rounded-md bg-sky-400/10 text-sky-300">
              <ArrowDownToLine aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-medium">New visitor</span>
              <span className="block text-[8px] text-muted-foreground">
                Entry point
              </span>
            </span>
          </div>
          <div className="absolute left-1/2 top-[42%] z-10 flex w-32 -translate-x-1/2 items-center gap-2 rounded-lg border border-primary/55 bg-[#29241e] px-3 py-2.5 shadow-[0_0_24px_oklch(0.74_0.16_55_/_12%)] ring-1 ring-primary/20">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Workflow aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-medium">Create account</span>
              <span className="block text-[8px] text-muted-foreground">
                API · Auth
              </span>
            </span>
          </div>
          <div className="absolute left-[26.7%] top-[74%] z-10 flex w-28 -translate-x-1/2 items-center gap-2 rounded-lg border border-white/10 bg-[#242526] px-2.5 py-2 shadow-xl">
            <span className="flex size-6 items-center justify-center rounded-md bg-violet-400/10 text-violet-300">
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-left text-[9px] font-medium">Welcome</span>
          </div>
          <div className="absolute left-[73.3%] top-[74%] z-10 flex w-28 -translate-x-1/2 items-center gap-2 rounded-lg border border-white/10 bg-[#242526] px-2.5 py-2 shadow-xl">
            <span className="flex size-6 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-300">
              <Layers2 aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-left text-[9px] font-medium">Save profile</span>
          </div>
          <div className="absolute bottom-3 right-3 rounded-md border border-white/8 bg-[#202122]/90 px-2 py-1 text-[9px] text-muted-foreground backdrop-blur">
            80%
          </div>
          <div className="absolute bottom-[20%] left-[48%] z-20 flex items-center gap-1 text-[9px] font-medium text-sky-300">
            <MousePointer2 aria-hidden="true" className="size-3 fill-sky-300/20" />
            Alex
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsMock() {
  return (
    <div
      role="img"
      aria-label="Document editor mockup with a product spec and an AI-generated suggestion"
      className={chrome}
    >
      <SurfaceHeader icon={FileText} title="Product requirements" detail="Docs" />
      <div className="flex h-[19rem]">
        <aside className="hidden w-36 shrink-0 border-r border-white/8 p-3 sm:block">
          <p className="mb-3 font-mono text-[8px] tracking-widest text-muted-foreground uppercase">
            On this page
          </p>
          <p className="rounded-md bg-white/5 px-2 py-1.5 text-[9px] text-foreground/80">
            Overview
          </p>
          <p className="px-2 py-2 text-[9px] text-muted-foreground">
            User journeys
          </p>
          <p className="px-2 py-1 text-[9px] text-muted-foreground">
            Requirements
          </p>
          <p className="px-2 py-2 text-[9px] text-muted-foreground">
            Success metrics
          </p>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col items-center overflow-hidden">
          <div className="flex h-9 w-full items-center gap-3 border-b border-white/8 px-3 text-muted-foreground">
            {[Bold, AlignLeft, ArrowDown, Command].map((Icon, i) => (
              <Icon
                key={i}
                aria-hidden="true"
                className={`size-3 ${i === 0 ? "text-foreground" : ""}`}
              />
            ))}
            <span className="ml-auto flex items-center gap-1 rounded border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] text-primary">
              <Sparkles aria-hidden="true" className="size-2.5" />
              Ask AI
            </span>
          </div>
          <div className="w-full max-w-sm px-6 py-5 sm:px-9">
            <p className="mb-2 font-mono text-[8px] tracking-[0.16em] text-primary uppercase">
              Product spec · 5 min read
            </p>
            <h4 className="text-lg leading-tight font-semibold tracking-tight text-foreground/95 sm:text-xl">
              A calmer way to plan launches
            </h4>
            <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
              One shared space for the ideas, decisions, and details behind
              every great launch.
            </p>
            <div className="my-4 flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.025] p-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                <Workflow aria-hidden="true" className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-medium">
                  Launch flow
                </span>
                <span className="block text-[8px] text-muted-foreground">
                  Canvas · Updated moments ago
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-3 shrink-0 text-muted-foreground"
              />
            </div>
            <h5 className="mb-2 text-[11px] font-semibold text-foreground/90">
              The opportunity
            </h5>
            <div className="space-y-1.5">
              <span className="block h-1.5 w-full rounded-full bg-white/10" />
              <span className="block h-1.5 w-[94%] rounded-full bg-white/10" />
              <span className="block h-1.5 w-[82%] rounded-full bg-white/10" />
            </div>
            <div className="mt-3 rounded-lg border border-primary/15 bg-primary/[0.06] p-2.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[8px] font-medium text-primary">
                <Sparkles aria-hidden="true" className="size-3" />
                Suggested summary
              </div>
              <p className="text-[8px] leading-3.5 text-foreground/70">
                Bring launch plans, owners, and decisions together in one
                workspace.
              </p>
              <div className="mt-2 flex items-center gap-1 text-[8px] text-muted-foreground">
                <Check aria-hidden="true" className="size-2.5 text-emerald-400" />
                Insert into document
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const boardColumns = [
  {
    title: "Up next",
    count: "03",
    cards: [
      {
        title: "Map the onboarding journey",
        tag: "Research",
        color: "bg-violet-300",
        avatars: ["J", "M"],
      },
      {
        title: "Define launch metrics",
        tag: "Planning",
        color: "bg-sky-300",
        avatars: ["A"],
      },
    ],
  },
  {
    title: "In progress",
    count: "02",
    cards: [
      {
        title: "Workspace invite flow",
        tag: "Product",
        color: "bg-primary",
        avatars: ["M", "K"],
      },
      {
        title: "Review API contracts",
        tag: "Engineering",
        color: "bg-emerald-300",
        avatars: ["D"],
      },
    ],
  },
  {
    title: "Done",
    count: "04",
    cards: [
      {
        title: "Customer interviews",
        tag: "Research",
        color: "bg-violet-300",
        avatars: ["J"],
      },
    ],
  },
];

function TeamBoardMock() {
  return (
    <div
      role="img"
      aria-label="Team kanban board mockup with up next, in progress, and done columns"
      className={chrome}
    >
      <div className="flex h-12 items-center justify-between border-b border-white/8 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <LayoutGrid aria-hidden="true" className="size-3.5" />
          </div>
          <span className="truncate text-[11px] font-medium sm:text-xs">
            Product launch
          </span>
          <span className="hidden rounded bg-white/5 px-1.5 py-0.5 text-[8px] text-muted-foreground sm:inline">
            TEAM BOARD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[8px] text-emerald-300">
            <Circle aria-hidden="true" className="size-1.5 fill-current" />
            Live
          </span>
          <div className="flex -space-x-1.5">
            {["A", "M", "J"].map((initial, i) => (
              <span
                key={initial}
                className={`flex size-6 items-center justify-center rounded-full border-2 border-[#111112] text-[8px] font-semibold text-black ${
                  i === 0
                    ? "bg-amber-300"
                    : i === 1
                      ? "bg-sky-300"
                      : "bg-violet-300"
                }`}
              >
                {initial}
              </span>
            ))}
          </div>
          <button
            type="button"
            aria-label="Add a task"
            className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <Plus aria-hidden="true" className="size-3" />
          </button>
        </div>
      </div>
      <div className="grid h-[19rem] grid-cols-3 gap-2 overflow-hidden bg-[#171819] p-2.5 sm:gap-3 sm:p-4">
        {boardColumns.map((column, columnIndex) => (
          <div
            key={column.title}
            className={`min-w-0 rounded-lg border p-2 sm:p-2.5 ${
              columnIndex === 1
                ? "border-primary/15 bg-primary/[0.025]"
                : "border-white/6 bg-white/[0.015]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-1 sm:mb-3">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={`size-1.5 shrink-0 rounded-full ${
                    columnIndex === 0
                      ? "bg-sky-300"
                      : columnIndex === 1
                        ? "bg-primary"
                        : "bg-emerald-300"
                  }`}
                />
                <span className="truncate text-[9px] font-medium sm:text-[10px]">
                  {column.title}
                </span>
              </div>
              <span className="text-[8px] text-muted-foreground">
                {column.count}
              </span>
            </div>
            <div className="space-y-2">
              {column.cards.map((card, cardIndex) => (
                <div
                  key={card.title}
                  className="relative rounded-md border border-white/8 bg-[#202122] p-2 shadow-sm sm:p-2.5"
                >
                  {columnIndex === 1 && cardIndex === 0 && (
                    <div className="absolute -right-1.5 -top-1.5 z-10 flex size-4 items-center justify-center rounded-full border border-[#171819] bg-sky-300 text-[7px] font-bold text-black">
                      M
                    </div>
                  )}
                  <p className="min-h-7 text-[8px] leading-3.5 font-medium text-foreground/90 sm:text-[9px]">
                    {card.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="flex min-w-0 items-center gap-1 truncate text-[7px] text-muted-foreground sm:text-[8px]">
                      <span className={`size-1.5 shrink-0 rounded-full ${card.color}`} />
                      {card.tag}
                    </span>
                    <div className="flex shrink-0 -space-x-1">
                      {card.avatars.map((avatar, i) => (
                        <span
                          key={avatar}
                          className={`flex size-4 items-center justify-center rounded-full border border-[#202122] text-[6px] font-semibold text-black ${
                            i === 0 ? "bg-amber-200" : "bg-sky-200"
                          }`}
                        >
                          {avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {columnIndex !== 2 && (
                <div className="flex items-center gap-1 px-1 py-1 text-[8px] text-muted-foreground/60">
                  <Plus aria-hidden="true" className="size-2.5" />
                  Add task
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-7 items-center justify-end gap-1.5 border-t border-white/8 px-3 text-[8px] text-muted-foreground">
        <MousePointer2 aria-hidden="true" className="size-3 text-sky-300" />
        Maya is viewing this board
      </div>
    </div>
  );
}

export function FeatureMock({ surface }: { surface: FeatureSurface }) {
  if (surface === "canvas") return <CanvasMock />;
  if (surface === "docs") return <DocsMock />;
  return <TeamBoardMock />;
}
