import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPasscode, tokenFor } from "@/lib/admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean } from "@/lib/validation";

export const dynamic = "force-dynamic";

function trustedMutation(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === new URL(request.url).origin && (!fetchSite || fetchSite === "same-origin");
}

export async function POST(request: Request) {
  if (!trustedMutation(request)) {
    return NextResponse.json({ error: "Untrusted origin." }, { status: 403 });
  }
  // Global in-process cap reduces header-spoofing bypass on one instance.
  // A shared persistent limiter is still required for multi-instance deployment.
  const globalLimit = rateLimit("admin-login:all", 40, 15 * 60 * 1000);
  const limit = rateLimit(clientKey(request, "admin-login"), 8, 15 * 60 * 1000);
  if (!limit.allowed || !globalLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let passcode = "";
  try {
    const body = (await request.json()) as { passcode?: string };
    passcode = clean(body.passcode, 120);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!passcode || !checkPasscode(passcode)) {
    return NextResponse.json({ error: "That passcode is not right." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: tokenFor(passcode),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE(request: Request) {
  if (!trustedMutation(request)) {
    return NextResponse.json({ error: "Untrusted origin." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
