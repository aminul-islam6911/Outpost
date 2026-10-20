"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function checkUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.orm.public.User.where({
    clerkId: clerkUser.id,
  }).first();

  if (existing) return existing;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.orm.public.User.create({
    clerkId: clerkUser.id,
    email,
    name:
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
    imageUrl: clerkUser.imageUrl,
  });
}
