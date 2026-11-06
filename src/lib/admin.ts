import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "crankified_admin";
const TOKEN_MESSAGE = "crankified-admin-v2";
const SESSION_SECONDS = 8 * 60 * 60;

export function adminPasscode() {
  // Never ship a default administrator credential, including in development.
  return process.env.ADMIN_PASSCODE ?? "";
}

function digest(passcode: string, message: string) {
  return createHmac("sha256", passcode).update(message).digest("hex");
}

export function tokenFor(passcode: string) {
  const issued = Math.floor(Date.now() / 1000);
  return `${issued}.${digest(passcode, `${TOKEN_MESSAGE}:${issued}`)}`;
}

export function checkPasscode(candidate: string) {
  const expected = adminPasscode();
  if (!expected) return false;
  const a = Buffer.from(digest(candidate, "passcode-check"));
  const b = Buffer.from(digest(expected, "passcode-check"));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminToken(token: string, passcode: string, now = Math.floor(Date.now() / 1000)) {
  if (!passcode || !/^\d{10}\.[a-f0-9]{64}$/.test(token)) return false;
  const [issuedText, signature] = token.split(".");
  const issued = Number(issuedText);
  if (!Number.isSafeInteger(issued) || issued > now + 30 || now - issued > SESSION_SECONDS) return false;
  const expected = Buffer.from(digest(passcode, `${TOKEN_MESSAGE}:${issued}`), "hex");
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function isAdmin() {
  const passcode = adminPasscode();
  if (!passcode) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(token && verifyAdminToken(token, passcode));
}
