import type { Models } from "@/src/prisma/contract.d";

type Timestamp = { epochMilliseconds: number };
type Dated = { updatedAt: Timestamp } | null;

type WorkspaceStatus = Models.public_Workspace["status"];

// A workspace's own updatedAt only changes on rename or move, so real activity also counts
// edits to its doc and canvas.
export function withLastActivity<
  T extends { updatedAt: Timestamp; doc: Dated; canvas: Dated },
>(workspace: T) {
  const { updatedAt, doc, canvas, ...workspaceData } = workspace;
  const times = [
    updatedAt.epochMilliseconds,
    doc?.updatedAt.epochMilliseconds ?? 0,
    canvas?.updatedAt.epochMilliseconds ?? 0,
  ];
  return {
    ...workspaceData,
    lastActivity: new Date(Math.max(...times)),
  };
}

export const WORKSPACE_STATUSES: { status: WorkspaceStatus; title: string }[] =
  [
    { status: "PLANNING", title: "Planning" },
    { status: "IN_PROGRESS", title: "In progress" },
    { status: "IN_REVIEW", title: "In review" },
    { status: "DONE", title: "Done" },
  ];

export function statusTitle(status: WorkspaceStatus) {
  return WORKSPACE_STATUSES.find((s) => s.status === status)?.title ?? status;
}
