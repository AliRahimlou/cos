import { createHmac, timingSafeEqual } from "crypto";

import type { SessionUser } from "./types";

export const SESSION_COOKIE = "cos-portal-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type SessionPayload = SessionUser & {
  exp: number;
};

function getSessionSecret() {
  return process.env.COS_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "cos-local-dev-session-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function getSessionExpiry(now = Date.now()) {
  return new Date(now + SESSION_TTL_SECONDS * 1000);
}

export function createSessionToken(user: SessionUser, now = Date.now()) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token?: string | null, now = Date.now()) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (!payload.exp || payload.exp <= Math.floor(now / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
