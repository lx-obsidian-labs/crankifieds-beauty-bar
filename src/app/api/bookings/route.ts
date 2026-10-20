import { NextResponse } from "next/server";
import { dataStore, makeReference } from "@/lib/db";
import { availabilityForDate } from "@/lib/schedule";
import { resolveSelection } from "@/lib/services";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail, isIsoDate, isPhone, isTime } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Body = {
  serviceId?: string;
  addonIds?: string[];
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  referralCode?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "booking"));
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

  const addonIds = Array.isArray(body.addonIds)
    ? body.addonIds.filter((id): id is string => typeof id === "string").slice(0, 6)
    : [];
  const selection = resolveSelection(clean(body.serviceId, 60), addonIds);
  if (!selection) {
    return NextResponse.json({ error: "Please choose a service." }, { status: 400 });
  }

  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 24);
  const email = clean(body.email, 120).toLowerCase();
  const notes = clean(body.notes, 600);
  const referralCode = clean(body.referralCode, 40) || null;

  const fields: Record<string, string> = {};
  if (!isIsoDate(date)) fields.date = "Choose a valid date.";
  if (!isTime(time)) fields.time = "Choose a time.";
  if (name.length < 2) fields.name = "Please tell us your name.";
  if (!isPhone(phone)) fields.phone = "Enter a phone number we can reach you on.";
  if (!isEmail(email)) fields.email = "That email address does not look right.";
  if (body.consent !== true) fields.consent = "Please accept the appointment terms.";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 400 },
    );
  }

  try {
    const busy = await dataStore.bookingsForDate(date);
    const availability = availabilityForDate(date, selection.duration, busy);
    if (!availability.open) {
      return NextResponse.json(
        { error: availability.reason ?? "The studio is closed on that day." },
        { status: 400 },
      );
    }
    if (!availability.slots.includes(time)) {
      return NextResponse.json(
        { error: "That time has just been taken. Please choose another slot." },
        { status: 409 },
      );
    }

    const booking = await dataStore.createBooking({
      reference: makeReference("CRK"),
      serviceId: selection.service.id,
      serviceName: selection.service.name,
      addons: selection.addOns.map(({ id, name: addOnName, price, duration }) => ({
        id,
        name: addOnName,
        price,
        duration,
      })),
      date,
      time,
      duration: selection.duration,
      price: selection.price,
      name,
      phone,
      email: email || null,
      notes: notes || null,
      referralCode,
    });

    console.info(
      `[booking] ${booking.reference} ${date} ${time} ${selection.service.name}`,
    );

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("booking failed", error);
    return NextResponse.json(
      {
        error:
          "We could not save that appointment. Please try again, or send us a message from the studio page.",
      },
      { status: 503 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST to create a booking." }, { status: 405 });
}
