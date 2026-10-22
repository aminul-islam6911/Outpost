import { checkUser } from "@/actions/check-user";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getWorkspaceScope } from "@/lib/workspace-scope";
import { withLastActivity } from "@/lib/workspace-status";
import { KanbanSquare, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { RecentWorkspaces } from "./_components/RecentWorkspaces";
import WorkspaceDialog from "@/components/WorkspaceDialog";
import { DashboardPrompt } from "./_components/DashboardPrompts";

const RECENT_COUNT = 4;

function DashboardLoadingSkeleton() {
  return (
    <div className="p-8" role="status" aria-label="Loading dashboard">
      <span className="sr-only">Loading dashboard...</span>
      <div aria-hidden="true" className="animate-pulse">
        <section className="topo-bg mx-auto mb-14 w-full max-w-4xl px-6 py-10 text-center">
          <div className="mx-auto h-9 w-3/4 rounded bg-white/10 md:h-11 md:w-2/3" />
          <div className="mx-auto mt-3 h-5 max-w-md rounded bg-white/10" />
          <div className="mx-auto mt-7 max-w-3xl rounded-3xl border border-white/12 bg-card/80 p-3">
            <div className="h-14 rounded bg-white/5" />
            <div className="mt-2 flex justify-between">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="size-9 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
            {[0, 1, 2].map((prompt) => (
              <div key={prompt} className="h-7 w-40 rounded-full bg-white/10" />
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-40 rounded bg-white/10" />
            </div>
            <div className="h-9 w-36 rounded-md bg-white/10" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="h-36 rounded-md bg-muted p-3.5">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-full rounded bg-white/10" />
                <div className="mt-1 h-3 w-2/3 rounded bg-white/10" />
                <div className="mt-12 h-3 w-1/2 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  const { orgName, where } = await getWorkspaceScope(user.id);
  const workspaces = await prisma.orm.public.Workspace.where(where)
    .select("id", "name", "description", "status", "updatedAt")
    .include("creator", (creator) => creator.select("name", "imageUrl"))
    .include("doc", (doc) => doc.select("updatedAt"))
    .include("canvas", (canvas) => canvas.select("updatedAt"))
    .all();

  const recent = workspaces
    .map(withLastActivity)
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    .slice(0, RECENT_COUNT);

  return (
    <div className="p-8">
      <DashboardPrompt />
      <section className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{orgName}</p>
            <h2 className="text-lg font-semibold">Recent workspaces</h2>
          </div>
          <div>
            {workspaces.length > 0 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
              >
                <Link href="/workspaces">
                  <KanbanSquare className="size-4" />
                  View board ({workspaces.length})
                </Link>
              </Button>
            )}
            <WorkspaceDialog
              trigger={
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="size-4" />
                  New workspace
                </Button>
              }
            />
          </div>
        </div>
        {workspaces.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-muted-foreground">
            No workspaces yet. Describe what you want to plan above to start
            one.
          </p>
        ) : (
          <RecentWorkspaces workspaces={recent} />
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
