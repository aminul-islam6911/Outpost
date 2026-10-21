import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { FREE_MONTHLY_PROMPTS } from "./plan-limits";

// Paid prompt allowances come from Clerk plan features (checked in order), per member for team plans.
const PROMPT_FEATURES = [
  { feature: "agent_prompts_2000", perMember: 2000 },
  { feature: "agent_prompts_500", perMember: 500 },
];

export function workspaceOwnerId(workspace: {
  clerkOrgId: string | null;
  creator: { clerkId: string } | null;
}) {
  if (workspace.clerkOrgId !== null) return workspace.clerkOrgId;
  if (!workspace.creator) throw new Error("Workspace creator not found");
  return workspace.creator.clerkId;
}

export async function getWorkspaceOwnerId(workspaceId: string) {
  const workspace = await prisma.orm.public.Workspace.select("clerkOrgId")
    .include("creator", (creator) => creator.select("clerkId"))
    .where({ id: workspaceId })
    .first();
  if (!workspace) throw new Error(`Workspace not found: ${workspaceId}`);
  return workspaceOwnerId(workspace);
}

export async function getEntitlements(ownerId: string) {
  const clerk = await clerkClient();
  const isOrg = ownerId.startsWith("org_");
  const features = new Set<string>();

  try {
    const subscription = isOrg
      ? await clerk.billing.getOrganizationBillingSubscription(ownerId)
      : await clerk.billing.getUserBillingSubscription(ownerId);
    for (const item of subscription.subscriptionItems) {
      if (item.status === "active" || item.status === "past_due") {
        item.plan?.features.forEach((feature) => features.add(feature.slug));
      }
    }
  } catch {}
  const paid = PROMPT_FEATURES.find(({ feature }) => features.has(feature));
  let promptLimit = FREE_MONTHLY_PROMPTS;
  if (paid) {
    const members = isOrg
      ? ((
          await clerk.organizations.getOrganization({
            organizationId: ownerId,
            includeMembersCount: true,
          })
        ).membersCount ?? 1)
      : 1;
    promptLimit = paid.perMember * members;
  }
  return {
    isPaid: !!paid,
    promptLimit,
    unlimitedWorkspaces: features.has("workspaces_unlimited"),
    publicSharing: features.has("public_sharing"),
    pdfExport: features.has("pdf_export"),
  };
}
