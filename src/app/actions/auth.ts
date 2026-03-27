"use server";

import { redirect } from "next/navigation";

import { getHomeRouteForRole } from "@/lib/auth/access";
import { clearSessionUser, setSessionUser } from "@/lib/auth/session";
import { authenticateUser, toSessionUser } from "@/lib/portal/store";

export type LoginActionState = {
  error: string | null;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Enter both email and password.",
    };
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return {
      error: "Invalid credentials for this portal.",
    };
  }

  await setSessionUser(toSessionUser(user));
  redirect(getHomeRouteForRole(user.role));
}

export async function logoutAction() {
  await clearSessionUser();
  redirect("/login");
}
