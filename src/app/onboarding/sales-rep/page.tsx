import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getHomeRouteForRole } from "@/lib/auth/access";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sales Rep Onboarding",
  description:
    "Legacy onboarding entrypoint redirected into the routed portal experience.",
};

export default async function SalesRepOnboardingPage() {
  const user = await getSessionUser();
  redirect(user ? getHomeRouteForRole(user.role) : "/login");
}
