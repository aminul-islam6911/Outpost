"use client";

import { useAuth } from "@clerk/nextjs";
import { ClientPricingTable } from "@/components/ClientPricingTable";
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type UpgradeReason = { title: string; description: string };

const DEFAULT_REASON: UpgradeReason = {
  title: "Upgrade your Plan",
  description:
    "Get more agent prompts, Unlimited workspaces, Share links and PDF export.",
};

const UpgradeDialogContext = createContext<(reason?: UpgradeReason) => void>(
  () => {},
);

export const UpgradeDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reason, setReason] = useState<UpgradeReason | null>(null);
  const { orgId } = useAuth();
  const close = () => setReason(null);
  return (
    <UpgradeDialogContext.Provider
      value={(next) => setReason(next ?? DEFAULT_REASON)}
    >
      {children}
      <Dialog
        modal={false}
        open={reason !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl">{reason?.title}</DialogTitle>
            {reason?.description && (
              <DialogDescription>{reason.description}</DialogDescription>
            )}
          </DialogHeader>
          <ClientPricingTable for={orgId ? "organization" : "user"} />
        </DialogContent>
      </Dialog>
    </UpgradeDialogContext.Provider>
  );
};

export function useUpgradeDialog() {
  return useContext(UpgradeDialogContext);
}
