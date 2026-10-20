import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { dataStore, type BookingStatus, type OrderStatus } from "@/lib/db";
import { clean } from "@/lib/validation";

export const dynamic = "force-dynamic";

const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const orderStatuses: OrderStatus[] = ["new", "sourcing", "ready", "collected", "cancelled"];
const referralStatuses = ["pending", "rewarded", "cancelled"] as const;

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { type?: string; reference?: string; status?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const type = clean(body.type, 20);
  const reference = clean(body.reference, 40);
  const status = clean(body.status, 20);

  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  try {
    if (type === "booking" && bookingStatuses.includes(status as BookingStatus)) {
      const booking = await dataStore.setBookingStatus(reference, status as BookingStatus);
      return NextResponse.json({ ok: true, booking });
    }
    if (type === "order" && orderStatuses.includes(status as OrderStatus)) {
      const order = await dataStore.setOrderStatus(reference, status as OrderStatus);
      return NextResponse.json({ ok: true, order });
    }
    if (
      type === "referral" &&
      referralStatuses.includes(status as (typeof referralStatuses)[number])
    ) {
      const referral = await dataStore.setReferralStatus(
        reference,
        status as (typeof referralStatuses)[number],
      );
      return NextResponse.json({ ok: true, referral });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("status update failed", error);
    return NextResponse.json({ error: "Could not update that record." }, { status: 503 });
  }
}
