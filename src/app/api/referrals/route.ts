import { NextResponse } from "next/server";
import { dataStore, makeReference } from "@/lib/db";
import { rewards } from "@/lib/services";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail, isPhone } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Referred = { name?: string; phone?: string };
type Body = {
  name?: string;
  phone?: string;
  email?: string;
  rewardId?: string;
  referred?: Referred[];
};

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "referral"));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reward = rewards.find((item) => item.id === clean(body.rewardId, 60));
  if (!reward) {
    return NextResponse.json({ error: "Choose your reward." }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 24);
  const email = clean(body.email, 120).toLowerCase();

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Please tell us your name.";
  if (!isPhone(phone)) fields.phone = "Enter a phone number we can reach you on.";
  if (!isEmail(email)) fields.email = "That email address does not look right.";

  const referred = (Array.isArray(body.referred) ? body.referred : [])
    .slice(0, 3)
    .map((person) => ({
      name: clean(person?.name, 80),
      phone: clean(person?.phone, 24),
    }))
    .filter((person) => person.name.length > 0 || person.phone.length > 0);

  if (referred.length !== 3) {
    fields.referred = "Add all three clients you referred.";
  } else {
    referred.forEach((person, index) => {
      if (person.name.length < 2) fields[`referred-${index}-name`] = "Enter their name.";
      if (!isPhone(person.phone)) fields[`referred-${index}-phone`] = "Enter their number.";
    });
  }

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 400 },
    );
  }

  try {
    const referral = await dataStore.createReferral({
      reference: makeReference("REF"),
      name,
      phone,
      email: email || null,
      referred,
      rewardId: reward.id,
      rewardName: reward.name,
    });
    console.info(`[referral] ${referral.reference} ${reward.name}`);
    return NextResponse.json({ referral }, { status: 201 });
  } catch (error) {
    console.error("referral failed", error);
    return NextResponse.json(
      { error: "We could not log that claim. Please try again in a moment." },
      { status: 503 },
    );
  }
}
