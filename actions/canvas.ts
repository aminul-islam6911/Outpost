"use server";

import { prisma } from "@/lib/prisma";
import { canAccessWorkspace } from "@/lib/workspace-access";
import type { FieldInputTypes } from "@/src/prisma/contract.d";

export async function saveCanvasContent(
  workspaceId: string,
  content: FieldInputTypes["public"]["Canvas"]["content"],
) {
  if (!(await canAccessWorkspace(workspaceId)))
    throw new Error("Workspace not found");

  await prisma.orm.public.Canvas.where({ workspaceId }).update({ content });
}
