import { describe, expect, it } from "vitest";

import {
  getHomeRouteForRole,
  isLearnerRoute,
  isManagerRoute,
  resolveProtectedRedirect,
} from "./access";

describe("auth access helpers", () => {
  it("returns the correct default home route for each role", () => {
    expect(getHomeRouteForRole("learner")).toBe("/dashboard");
    expect(getHomeRouteForRole("manager")).toBe("/manager");
  });

  it("redirects unauthenticated users away from protected learner and manager routes", () => {
    expect(resolveProtectedRedirect("/dashboard", null)).toBe("/login");
    expect(resolveProtectedRedirect("/training/cos-foundations", null)).toBe("/login");
    expect(resolveProtectedRedirect("/manager/users", null)).toBe("/login");
  });

  it("redirects authenticated users away from login to the correct landing route", () => {
    expect(resolveProtectedRedirect("/login", "learner")).toBe("/dashboard");
    expect(resolveProtectedRedirect("/login", "manager")).toBe("/manager");
  });

  it("blocks learners from manager routes and managers from learner routes", () => {
    expect(resolveProtectedRedirect("/manager", "learner")).toBe("/dashboard");
    expect(resolveProtectedRedirect("/training", "manager")).toBe("/manager");
    expect(resolveProtectedRedirect("/onboarding/sales-rep", "manager")).toBe("/manager");
  });

  it("allows users onto the correct side of the app", () => {
    expect(resolveProtectedRedirect("/dashboard", "learner")).toBeNull();
    expect(resolveProtectedRedirect("/training", "learner")).toBeNull();
    expect(resolveProtectedRedirect("/manager/analytics", "manager")).toBeNull();
  });

  it("classifies learner and manager route prefixes correctly", () => {
    expect(isLearnerRoute("/quizzes/cos-foundations")).toBe(true);
    expect(isLearnerRoute("/results")).toBe(true);
    expect(isManagerRoute("/manager/users")).toBe(true);
    expect(isManagerRoute("/dashboard")).toBe(false);
  });
});
