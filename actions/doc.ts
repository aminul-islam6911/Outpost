"use server";

import { prisma } from "@/lib/prisma";
import { canAccessWorkspace } from "@/lib/workspace-access";
import type { FieldInputTypes } from "@/src/prisma/contract.d";
import * as Y from "yjs";

export async function saveDocContent(
  workspaceId: string,
  yjsState: string,
  content: FieldInputTypes["public"]["Doc"]["content"],
) {
  if (!(await canAccessWorkspace(workspaceId)))
    throw new Error("Workspace not found");

  const incoming = Buffer.from(yjsState, "base64");

  await prisma.transaction(async (tx) => {
    const row = await tx.orm.public.Doc.where({ workspaceId })
      .select("yjsState")
      .forUpdate()
      .firstOrThrow();
    const merged = row.yjsState
      ? Y.mergeUpdates([row.yjsState, incoming])
      : incoming;
    await tx.orm.public.Doc.where({ workspaceId }).update({
      yjsState: Uint8Array.from(merged),
      content,
    });
  });
}
