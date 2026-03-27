import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getHomeRouteForRole } from "@/lib/auth/access";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sales Rep Onboarding",
  description: "Sales rep onboarding for Creative Office Solutions.",
};

export default async function SalesRepOnboardingPage() {
  const user = await getSessionUser();
  redirect(user ? getHomeRouteForRole(user.role) : "/login");
}
