import type { ShorthandWhereFilter } from "@prisma/orm-postgres/orm-client";
import type { Contract } from "@/src/prisma/contract.d";
import { clerkClient, auth } from "@clerk/nextjs/server";

// The active org's workspaces, or the user's personal ones when no org is selected.
export function scopeWhere(
  orgId: string | null | undefined,
  userId: string,
): ShorthandWhereFilter<Contract, "public", "Workspace"> {
  return orgId
    ? { clerkOrgId: orgId }
    : { clerkOrgId: null, creatorId: userId };
}

// What the dashboard and the board list, plus the name to show above it.
export async function getWorkspaceScope(userId: string) {
  const { orgId } = await auth();
  const orgName = orgId
    ? (
        await (
          await clerkClient()
        ).organizations.getOrganization({ organizationId: orgId })
      ).name
    : "Personal";
  return { orgName, where: scopeWhere(orgId, userId) };
}
