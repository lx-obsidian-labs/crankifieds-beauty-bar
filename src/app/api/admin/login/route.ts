import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPasscode, tokenFor } from "@/lib/admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "admin-login"), 8, 15 * 60 * 1000);
  if (!limit.allowed) {
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

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
