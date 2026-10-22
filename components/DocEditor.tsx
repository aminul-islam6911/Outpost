"use client";

import type { Block } from "@blocknote/core";
import React, { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { useWorkspaceEditors } from "@/components/WorkspaceEditorsContext";
import { BlockNoteView } from "@blocknote/mantine";
import { outpostDarkTheme } from "@/lib/blacknote-theme";
import "@blocknote/mantine/style.css";
import { saveDocContent } from "@/actions/doc";
import type { FieldInputTypes } from "@/src/prisma/contract.d";
import { SupabaseYjsProvider } from "@/lib/supabase-yjs-provider";
import * as Y from "yjs";
import { useUser } from "@clerk/nextjs";
import { useCollaborativeDoc } from "@/hooks/use-collaborative-doc";
import { colorForUser } from "@/lib/utils";
import { CollaborationExtension } from "@blocknote/core/yjs";
import { toBase64 } from "@/lib/base64";

type DocEditorProps = {
  workspaceId: string;
  initialContent: Block[] | null;
  initialState: string | null;
};

const SAVE_DEBOUNCE_MS = 1000;

export function DocEditor({
  workspaceId,
  initialContent,
  initialState,
}: DocEditorProps) {
  const { user } = useUser();
  const collab = useCollaborativeDoc(workspaceId, initialState);

  if (!collab || !user) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading document...
      </div>
    );
  }
  return (
    <CollaborativeEditor
      workspaceId={workspaceId}
      initialContent={initialContent}
      doc={collab.doc}
      provider={collab.provider}
      user={{
        name: user.fullName ?? user.username ?? "Anonymous",
        color: colorForUser(user.id),
      }}
    />
  );
}

export const CollaborativeEditor = ({
  workspaceId,
  initialContent,
  doc,
  provider,
  user,
}: Omit<DocEditorProps, "initialState"> & {
  doc: Y.Doc;
  provider: SupabaseYjsProvider;
  user: { name: string; color: string };
}) => {
  const fragment = doc.getXmlFragment("document-store");
  const editor = useCreateBlockNote({
    extensions: [CollaborationExtension({ fragment, user, provider })],
  });

  const { setDocEditor } = useWorkspaceEditors();

  useEffect(() => {
    setDocEditor(editor);
    return () => setDocEditor(null);
  }, [editor, setDocEditor]);

  // Docs saved before collaboration existed only have JSON — import it once into the shared doc.
  useEffect(() => {
    if (fragment.length === 0 && initialContent?.length) {
      editor.replaceBlocks(editor.document, initialContent);
    }
  }, [editor, fragment, initialContent]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      timeout = undefined;
      const content = JSON.parse(
        JSON.stringify(editor.document),
      ) as FieldInputTypes["public"]["Doc"]["content"];
      saveDocContent(
        workspaceId,
        toBase64(Y.encodeStateAsUpdate(doc)),
        content,
      );
    };

    const handleUpdate = (_update: Uint8Array, origin: unknown) => {
      if (origin === provider) return;
      clearTimeout(timeout);
      timeout = setTimeout(save, SAVE_DEBOUNCE_MS);
    };

    doc.on("update", handleUpdate);
    return () => {
      doc.off("update", handleUpdate);
      // Flush a pending save rather than dropping the last edits when leaving the page.
      if (timeout) {
        clearTimeout(timeout);
        save();
      }
    };
  }, [doc, editor, provider, workspaceId]);

  return (
    <div>
      <BlockNoteView editor={editor} theme={outpostDarkTheme} />
    </div>
  );
};
