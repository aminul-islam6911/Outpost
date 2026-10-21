"use server";

import type { Models } from "@/src/prisma/contract.d";

import { FREE_WORKSPACE_LIMIT, LimitError } from "@/lib/plan-limits";
import { checkUser } from "./check-user";
import { auth } from "@clerk/nextjs/server";
import { scopeWhere } from "@/lib/workspace-scope";
import { getEntitlements } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { canAccessWorkspace } from "@/lib/workspace-access";

type WorkspaceStatus = Models.public_Workspace["status"];
const WORKSPACE_STATUSES: readonly WorkspaceStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

function revalidateWorkspaceLists() {
  revalidatePath("/dashboard");
  revalidatePath("/workspaces");
}

export async function createWorkspace(
  name: string,
  description?: string,
): Promise<{ workspace: { id: string } } | { limit: LimitError }> {
  const user = await checkUser();
  if (!user) throw new Error("Not Signed In");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Workspace name is required");

  // Belongs to whichever org is active; no active org means a personal workspace.
  const { orgId } = await auth();
  const scope = scopeWhere(orgId, user.id);

  const { unlimitedWorkspaces } = await getEntitlements(orgId ?? user.clerkId);
  if (
    !unlimitedWorkspaces &&
    (
      await prisma.orm.public.Workspace.where(scope).aggregate((aggregate) => ({
        count: aggregate.count(),
      }))
    ).count >= FREE_WORKSPACE_LIMIT
  ) {
    return { limit: "workspaces" };
  }

  // New workspaces land at the top of the Planning column.
  const top = await prisma.orm.public.Workspace.where({
    status: "PLANNING",
    ...scope,
  })
    .orderBy((workspace) => workspace.position.asc())
    .select("position")
    .first();

  const workspace = await prisma.orm.public.Workspace.create({
    name: trimmedName,
    description: description?.trim() || null,
    creatorId: user.id,
    clerkOrgId: orgId ?? null,
    position: top ? top.position - 1 : 0,
    doc: (doc) => doc.create({}),
    canvas: (canvas) => canvas.create({}),
  });

  revalidateWorkspaceLists();
  return { workspace: { id: workspace.id } };
}

export async function deleteWorkspace(workspaceId: string) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !(await canAccessWorkspace(workspaceId)))
    throw new Error("Workspace not found");

  const workspace = await prisma.orm.public.Workspace.include(
    "creator",
    (creator) => creator.select("clerkId"),
  ).firstOrThrow({ id: workspaceId });

  const isCreator = workspace.creator?.clerkId === userId;
  // orgRole describes the active org only, so it counts only for a workspace in that org.
  const isOrgAdmin = orgRole === "org:admin" && workspace.clerkOrgId === orgId;
  if (!isCreator && !isOrgAdmin) {
    throw new Error(
      "Only the creator or an org admin can delete this workspace",
    );
  }
  // Doc and canvas cascade-delete with the workspace; its agent prompts stay, so usage can't reset.
  await prisma.orm.public.Workspace.where({ id: workspaceId }).delete();
  revalidateWorkspaceLists();
}

export async function moveWorkspace(
  workspaceId: string,
  status: WorkspaceStatus,
  position: number,
) {
  if (!WORKSPACE_STATUSES.includes(status) || !Number.isFinite(position)) {
    throw new Error("Invalid move");
  }
  if (!(await canAccessWorkspace(workspaceId)))
    throw new Error("Workspace not found");

  await prisma.orm.public.Workspace.where({ id: workspaceId }).update({
    status,
    position,
  });
  revalidateWorkspaceLists();
}
