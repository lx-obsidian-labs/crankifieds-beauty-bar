import { NextResponse } from "next/server";
import { dataStore, makeReference } from "@/lib/db";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail, isPhone } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "inquiry"));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 24);
  const email = clean(body.email, 120).toLowerCase();
  const message = clean(body.message, 1200);

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Please tell us your name.";
  if (!isPhone(phone)) fields.phone = "Enter a phone number we can reach you on.";
  if (!isEmail(email)) fields.email = "That email address does not look right.";
  if (message.length < 5) fields.message = "Tell us a little more.";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 400 },
    );
  }

  try {
    const inquiry = await dataStore.createInquiry({
      reference: makeReference("MSG"),
      name,
      phone,
      email: email || null,
      message,
    });
    console.info(`[inquiry] ${inquiry.reference}`);
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error("inquiry failed", error);
    return NextResponse.json(
      { error: "We could not send that message. Please try again." },
      { status: 503 },
    );
  }
}
