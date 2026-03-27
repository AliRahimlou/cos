import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserById, toSessionUser } from "@/lib/portal/store";

import { getHomeRouteForRole } from "./access";
import { createSessionToken, getSessionExpiry, SESSION_COOKIE, verifySessionToken } from "./token";
import type { SessionUser, UserRole } from "./types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);

  if (!payload) {
    return null;
  }

  const user = await getUserById(payload.id);

  if (!user || !user.active) {
    return null;
  }

  return toSessionUser(user);
}

export async function setSessionUser(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: getSessionExpiry(),
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireSessionUser(expectedRole?: UserRole) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (expectedRole && user.role !== expectedRole) {
    redirect(getHomeRouteForRole(user.role));
  }

  return user;
}
