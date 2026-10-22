"use client";

import type { Models } from "@/src/prisma/contract.d";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { deleteWorkspace, moveWorkspace, updateWorkspace } from "@/actions/workspace";
import { useFetch } from "@/hooks/use-fetch";
import { WORKSPACE_STATUSES } from "@/lib/workspace-status";
import { WorkspaceCard, type WorkspaceCardData } from "@/components/WorkspaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BoardWorkspace = WorkspaceCardData & { position: number };
type WorkspaceStatus = Models.public_Workspace["status"];

function columnItems(workspaces: BoardWorkspace[], status: WorkspaceStatus) {
  return workspaces.filter((w) => w.status === status).sort((a, b) => a.position - b.position);
}

// Midpoint between the new neighbors, so only the dropped card needs saving.
function positionBetween(before?: BoardWorkspace, after?: BoardWorkspace) {
  if (before && after) return (before.position + after.position) / 2;
  if (before) return before.position + 1;
  if (after) return after.position - 1;
  return 0;
}

export function WorkspaceBoard({ workspaces }: { workspaces: BoardWorkspace[] }) {
  const [items, setItems] = useState(workspaces);

  // Re-sync when the server sends a fresh list (e.g. after creating a workspace).
  const [prevWorkspaces, setPrevWorkspaces] = useState(workspaces);
  if (workspaces !== prevWorkspaces) {
    setPrevWorkspaces(workspaces);
    setItems(workspaces);
  }

  // `selected` outlives the open flag, so dialog text doesn't blank out during the close animation.
  const [selected, setSelected] = useState<BoardWorkspace | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { fn: deleteWorkspaceFn, loading: isDeleting } = useFetch(deleteWorkspace);
  const { fn: updateWorkspaceFn, loading: isUpdating } = useFetch(updateWorkspace);

  const openDeleteDialog = (workspace: BoardWorkspace) => {
    setSelected(workspace);
    setOpenDialog(true);
  };

  const openEditWorkspaceDialog = (workspace: BoardWorkspace) => {
    setSelected(workspace);
    setEditName(workspace.name);
    setEditDescription(workspace.description ?? "");
    setOpenEditDialog(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    // Keep the dialog open until the delete finishes (AlertDialogAction closes it by default).
    e.preventDefault();
    if (!selected) return;
    await deleteWorkspaceFn(selected.id);
    setOpenDialog(false);
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selected) return;
    const name = editName.trim();
    if (!name) return;

    const updated = await updateWorkspaceFn(
      selected.id,
      name,
      editDescription,
    );
    if (!updated) return;

    setItems((current) =>
      current.map((workspace) =>
        workspace.id === selected.id
          ? { ...workspace, name, description: editDescription.trim() || null }
          : workspace,
      ),
    );
    setOpenEditDialog(false);
  };

  const handleDragEnd = async ({ draggableId, source, destination }: DropResult) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const status = destination.droppableId as WorkspaceStatus;
    const target = columnItems(items, status).filter((w) => w.id !== draggableId);
    const position = positionBetween(target[destination.index - 1], target[destination.index]);

    const previous = items;
    setItems(items.map((w) => (w.id === draggableId ? { ...w, status, position } : w)));

    try {
      await moveWorkspace(draggableId, status, position);
    } catch {
      setItems(previous);
      toast.error("Couldn't move workspace");
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {WORKSPACE_STATUSES.map((column) => {
          const columnWorkspaces = columnItems(items, column.status);
          return (
            <div key={column.status} className="flex flex-col rounded-lg bg-white/3">
              <div className="flex items-center gap-2 px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {column.title}
                <span className="font-normal">{columnWorkspaces.length}</span>
              </div>
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-40 flex-1 flex-col gap-1.5 rounded-b-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    {columnWorkspaces.map((workspace, index) => (
                      <Draggable key={workspace.id} draggableId={workspace.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <WorkspaceCard
                              workspace={workspace}
                              highlighted={snapshot.isDragging}
                              actions={
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      aria-label="Workspace options"
                                      className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem variant="destructive" onSelect={() => openDeleteDialog(workspace)}>
                                      <Trash2 className="size-4" />
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => openEditWorkspaceDialog(workspace)}>
                                      <Pencil className="size-4" />
                                      Edit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{selected?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the workspace, including its doc and canvas. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={!!isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit workspace</DialogTitle>
            <DialogDescription>
              Update the name and description for this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-workspace-name">Name</Label>
              <Input
                id="edit-workspace-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-workspace-description">
                Description <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="edit-workspace-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditDialog(false)}
              disabled={isUpdating ?? false}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={(isUpdating ?? false) || !editName.trim()}
            >
              {isUpdating ? "Saving..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
}