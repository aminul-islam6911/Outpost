"use client";

import dynamic from "next/dynamic";

export const ClientPricingTable = dynamic(
  () => import("@clerk/nextjs").then((clerk) => clerk.PricingTable),
  { ssr: false },
);
