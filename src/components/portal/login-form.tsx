"use client";

import { useActionState } from "react";
import { ArrowRight, Building2, ShieldCheck, UserRound } from "lucide-react";

import { loginAction, type LoginActionState } from "@/app/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PortalTheme } from "@/lib/portal/theme";
import { ThemeToggle } from "./theme-toggle";

const initialState: LoginActionState = {
  error: null,
};

type LoginFormProps = {
  initialTheme: PortalTheme;
};

export function LoginForm({ initialTheme }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-6 flex justify-end lg:hidden">
            <ThemeToggle initialTheme={initialTheme} />
          </div>
          <Badge className="mb-4 rounded-full border border-[var(--glass-border)] bg-foreground/10 px-4 py-1 text-foreground hover:bg-foreground/15">
            Creative Office Solutions
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            Welcome to the COS learning and onboarding portal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Train new hires, track certifications, and manage team progress across every COS
            department in one secure workspace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Role-based dashboards for learners and managers",
              "Course modules, quizzes, and final certification",
              "Team analytics, assignments, and access controls",
              "Department learning paths built for COS operations",
            ].map((item) => (
              <div
                key={item}
                className="glass-surface rounded-3xl p-4 text-sm text-foreground/90"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-[2rem] shadow-[var(--glass-shadow-lg)]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <div className="hidden lg:block">
                <ThemeToggle initialTheme={initialTheme} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Work email
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="you@creativeofficesolutions.com"
                  className="h-12 rounded-2xl"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground/80">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="h-12 rounded-2xl"
                  autoComplete="current-password"
                  required
                />
              </div>

              {state.error ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {state.error}
                </div>
              ) : null}

              <Button type="submit" disabled={pending} className="h-12 w-full rounded-2xl text-base">
                {pending ? "Signing in..." : "Enter Portal"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-surface rounded-3xl p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <UserRound className="h-4 w-4" />
                  Learning access
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in with your COS work email and password to access assigned training,
                  quizzes, and certification progress.
                </p>
              </div>
              <div className="glass-surface rounded-3xl p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Manager access
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Managers can review team progress, unlock assessments, assign programs, and
                  oversee onboarding performance.
                </p>
              </div>
            </div>

            <div className="glass-surface-strong rounded-3xl p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4" />
                Need access?
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Contact your COS administrator or team lead if you need onboarding access, a role
                update, or a department assignment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
