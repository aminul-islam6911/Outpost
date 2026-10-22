import { EditableWorkspaceName } from "@/components/EditableWorkspaceName";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceEditorsProvider } from "@/components/WorkspaceEditorsContext";
import { prisma } from "@/lib/prisma";
import { canAccessWorkspace } from "@/lib/workspace-access";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import CanvasEditor from "./_components/CanvasEditor";
import type { TLEditorSnapshot } from "tldraw";
import type { Block } from "@blocknote/core";
import { DocEditor } from "../../../../components/DocEditorLoader";

type ViewMode = "doc" | "canvas" | "both";

function parseViewMode(value: string | string[] | undefined): ViewMode {
  return value === "doc" || value === "canvas" ? value : "both";
}

async function WorkspaceContent({
  params,
  searchParams,
}: PageProps<"/workspace/[id]">) {
  const { id } = await params;
  const { view: viewParam } = await searchParams;
  const view = parseViewMode(viewParam);

  await connection();

  if (!(await canAccessWorkspace(id))) notFound();

  const workspace = await prisma.orm.public.Workspace.where({ id })
    .select("name")
    .include("canvas", (canvas) => canvas.select("content"))
    .include("doc", (doc) => doc.select("content", "yjsState"))
    .first();

  if (!workspace) notFound();

  const showDoc = view === "doc" || view === "both";
  const showCanvas = view === "canvas" || view === "both";

  return (
    <WorkspaceEditorsProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-white/6 bg-background px-4">
          <div className="flex flex-1 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex size-8 items-center justify-center rounded-md transition-opacity hover:opacity-80"
            >
              <Image
                src="/brand/mascot-dark.png"
                alt="Back to dashboard"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
            <EditableWorkspaceName
              workspaceId={id}
              initialName={workspace.name}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/3 p-1">
            {(["doc", "both", "canvas"] as const).map((mode) => (
              <Button
                key={mode}
                asChild
                variant={view === mode ? "secondary" : "ghost"}
                size="sm"
                className="capitalize"
              >
                <Link
                  href={
                    mode === "both"
                      ? `/workspace/${id}`
                      : `/workspace/${id}?view=${mode}`
                  }
                >
                  {mode === "doc" ? "Document" : mode}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {/*some todo*/}
          </div>
        </header>
        <ResizablePanelGroup
          key={view}
          orientation="horizontal"
          className="flex-1"
        >
          {showDoc && (
            <ResizablePanel defaultSize={25} minSize={20}>
              <DocEditor
                key={id}
                workspaceId={id}
                initialContent={workspace.doc?.content as Block[] | null}
                initialState={
                  workspace.doc?.yjsState
                    ? Buffer.from(workspace.doc.yjsState).toString("base64")
                    : null
                }
              />
            </ResizablePanel>
          )}
          {showDoc && showCanvas && <ResizableHandle withHandle />}
          {showCanvas && (
            <ResizablePanel defaultSize={75} minSize={20}>
              <CanvasEditor
                workspaceId={id}
                initialSnapshot={
                  workspace.canvas?.content as TLEditorSnapshot | null
                }
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </WorkspaceEditorsProvider>
  );
}

export default function WorkspacePage(props: PageProps<"/workspace/[id]">) {
  return (
    <Suspense
      fallback={
        <div
          className="flex h-dvh items-center justify-center text-sm text-muted-foreground"
          role="status"
          aria-label="Loading workspace"
        >
          Loading workspace...
        </div>
      }
    >
      <WorkspaceContent {...props} />
    </Suspense>
  );
}
