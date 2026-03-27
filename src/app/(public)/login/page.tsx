import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/portal/login-form";
import { getHomeRouteForRole } from "@/lib/auth/access";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Login",
  description: "Login for the COS onboarding portal.",
};

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(getHomeRouteForRole(user.role));
  }

  return <LoginForm />;
}
