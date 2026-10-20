import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db";
import { availabilityForDate } from "@/lib/schedule";
import { resolveSelection } from "@/lib/services";
import { isIsoDate } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get("date") ?? "";
  const serviceId = params.get("service") ?? "";
  const addons = (params.get("addons") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!isIsoDate(date)) {
    return NextResponse.json({ error: "Choose a valid date." }, { status: 400 });
  }

  const selection = resolveSelection(serviceId, addons);
  if (!selection) {
    return NextResponse.json({ error: "Choose a valid service." }, { status: 400 });
  }

  try {
    const bookings = await dataStore.bookingsForDate(date);
    const availability = availabilityForDate(date, selection.duration, bookings);
    return NextResponse.json(
      {
        ...availability,
        duration: selection.duration,
        price: selection.price,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("availability lookup failed", error);
    return NextResponse.json(
      { error: "We could not check the calendar just now. Please try again." },
      { status: 503 },
    );
  }
}
