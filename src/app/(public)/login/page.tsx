import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/portal/login-form";
import { getHomeRouteForRole } from "@/lib/auth/access";
import { getSessionUser } from "@/lib/auth/session";
import { THEME_COOKIE_NAME, parsePortalTheme } from "@/lib/portal/theme";

export const metadata: Metadata = {
  title: "Login",
  description: "Login for the COS onboarding portal.",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  const cookieStore = await cookies();

  if (user) {
    redirect(getHomeRouteForRole(user.role));
  }

  return <LoginForm initialTheme={parsePortalTheme(cookieStore.get(THEME_COOKIE_NAME)?.value)} />;
}
