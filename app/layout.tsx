import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/AppShell";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { UpgradeDialogProvider } from "@/components/UpgradeDialog";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headings only; the optical-size axis gives large headings a tighter, more characterful cut.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Outpost: Agentic Workspace",
  description:
    "An AI agent that draws and writes alongside you and your team, live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: { colorPrimary: "oklch(0.74 0.16 55)" },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <TooltipProvider>
            <UpgradeDialogProvider>
              <Suspense fallback={children}>
                <AppShell>{children}</AppShell>
              </Suspense>
            </UpgradeDialogProvider>
          </TooltipProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
