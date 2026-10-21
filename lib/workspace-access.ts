import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Org workspaces are open to every member of that org; personal (org-less) ones only to their creator.
export async function canAccessWorkspace(workspaceId: string) {
  const { userId, orgId } = await auth();
  if (!userId) return false;

  const workspace = await prisma.orm.public.Workspace.select("clerkOrgId")
    .include("creator", (creator) => creator.select("clerkId"))
    .first({ id: workspaceId });
  if (!workspace) return false;
  if (!workspace.clerkOrgId) return workspace.creator?.clerkId === userId;
  if (workspace.clerkOrgId === orgId) return true;

  const clerk = await clerkClient();
  const { data: memberships } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: workspace.clerkOrgId,
      userId: [userId],
      limit: 1,
    });
  return memberships.length > 0;
}
