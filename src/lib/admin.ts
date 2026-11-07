import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "crankified_admin";
const TOKEN_MESSAGE = "crankified-admin-v3";
const SESSION_SECRET_MIN_LENGTH = 32;

export function adminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return secret.length >= SESSION_SECRET_MIN_LENGTH ? secret : "";
}
const SESSION_SECONDS = 8 * 60 * 60;

export function adminPasscode() {
  // Never ship a default administrator credential, including in development.
  return process.env.ADMIN_PASSCODE ?? "";
}

function digest(secret: string, message: string) {
  return createHmac("sha256", secret).update(message).digest("hex");
}

export function tokenFor() {
  const secret = adminSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  const issued = Math.floor(Date.now() / 1000);
  return `${issued}.${digest(secret, `${TOKEN_MESSAGE}:${issued}`)}`;
}

export function checkPasscode(candidate: string) {
  const expected = adminPasscode();
  if (!expected) return false;
  const a = Buffer.from(digest(candidate, "passcode-check"));
  const b = Buffer.from(digest(expected, "passcode-check"));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminToken(token: string, secret: string, now = Math.floor(Date.now() / 1000)) {
  if (!secret || secret.length < SESSION_SECRET_MIN_LENGTH || !/^\d{10}\.[a-f0-9]{64}$/.test(token)) return false;
  const [issuedText, signature] = token.split(".");
  const issued = Number(issuedText);
  if (!Number.isSafeInteger(issued) || issued > now + 30 || now - issued > SESSION_SECONDS) return false;
  const expected = Buffer.from(digest(secret, `${TOKEN_MESSAGE}:${issued}`), "hex");
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function isAdmin() {
  const passcode = adminPasscode();
  const secret = adminSessionSecret();
  if (!passcode || !secret) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(token && verifyAdminToken(token, secret));
}
