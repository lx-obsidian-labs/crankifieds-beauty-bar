import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "crankified_admin";
const TOKEN_MESSAGE = "crankified-admin-v1";

export function adminPasscode() {
  const configured = process.env.ADMIN_PASSCODE;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? "" : "crankified-studio";
}

export function tokenFor(passcode: string) {
  return createHmac("sha256", passcode).update(TOKEN_MESSAGE).digest("hex");
}

export function checkPasscode(candidate: string) {
  const expected = adminPasscode();
  if (!expected) return false;
  const a = Buffer.from(tokenFor(candidate));
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const passcode = adminPasscode();
  if (!passcode) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = Buffer.from(tokenFor(passcode));
  const actual = Buffer.from(token);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
