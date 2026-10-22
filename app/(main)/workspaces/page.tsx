import { checkUser } from "@/actions/check-user";
import { Button } from "@/components/ui/button";
import WorkspaceDialog from "@/components/WorkspaceDialog";
import { prisma } from "@/lib/prisma";
import { getWorkspaceScope } from "@/lib/workspace-scope";
import { withLastActivity } from "@/lib/workspace-status";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { WorkspaceBoard } from "./_components/WorkspaceBoard";

function WorkspacesLoadingSkeleton() {
  return (
    <div className="p-8" role="status" aria-label="Loading workspaces">
      <span className="sr-only">Loading workspaces...</span>
      <div aria-hidden="true" className="animate-pulse">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-8 w-48 rounded bg-white/10" />
          </div>
          <div className="h-10 w-36 rounded-md bg-white/10" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, column) => (
            <div key={column} className="flex flex-col gap-2 rounded-lg bg-white/3 p-2">
              <div className="mb-1 h-4 w-24 rounded bg-white/10" />
              {Array.from({ length: 2 }, (_, card) => (
                <div key={card} className="h-36 rounded-md bg-muted p-3.5">
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-full rounded bg-white/10" />
                  <div className="mt-1 h-3 w-2/3 rounded bg-white/10" />
                  <div className="mt-12 h-3 w-1/2 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function WorkspacesContent() {
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  const { orgName, where } = await getWorkspaceScope(user.id);
  const workspaces = await prisma.orm.public.Workspace.where(where)
    .select("id", "name", "description", "status", "updatedAt", "position")
    .include("creator", (creator) => creator.select("name", "imageUrl"))
    .include("doc", (doc) => doc.select("updatedAt"))
    .include("canvas", (canvas) => canvas.select("updatedAt"))
    .orderBy((workspace) => workspace.position.asc())
    .all();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{orgName}</p>
          <h1 className="text-2xl font-semibold">All workspaces</h1>
        </div>
        <WorkspaceDialog
          trigger={
            <Button className="gap-2">
              <Plus className="size-4" />
              New workspace
            </Button>
          }
        />
      </div>
      {workspaces.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-16 text-center text-sm text-muted-foreground">
          No workspaces yet. Start one from the dashboard or with New workspace.
        </p>
      ) : (
        <WorkspaceBoard workspaces={workspaces.map(withLastActivity)} />
      )}
    </div>
  );
};

export default function WorkspacesPage() {
  return (
    <Suspense fallback={<WorkspacesLoadingSkeleton />}>
      <WorkspacesContent />
    </Suspense>
  );
}
