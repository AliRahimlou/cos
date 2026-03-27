import { redirect } from "next/navigation";

import { getHomeRouteForRole } from "@/lib/auth/access";
import { getSessionUser } from "@/lib/auth/session";

export default async function ManagerLoginPage() {
  const user = await getSessionUser();
  redirect(user ? getHomeRouteForRole(user.role) : "/login");
}
