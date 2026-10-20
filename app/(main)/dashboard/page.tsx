import { checkUser } from "@/actions/check-user";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent() {
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Welcome, {user.name ?? user.email}!</h1>
      <p>User id in Database: {user.id}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
