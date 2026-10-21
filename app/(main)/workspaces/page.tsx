import { checkUser } from "@/actions/check-user";
import { Button } from "@/components/ui/button";
import WorkspaceDialog from "@/components/WorkspaceDialog";
import { prisma } from "@/lib/prisma";
import { getWorkspaceScope } from "@/lib/workspace-scope";
import { withLastActivity } from "@/lib/workspace-status";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { WorkspaceBoard } from "./_components/WorkspaceBoard";

const WorkspacesPage = async () => {
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

export default WorkspacesPage;
