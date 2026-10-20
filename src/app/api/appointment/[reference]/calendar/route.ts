import { dataStore } from "@/lib/db";
import { site, siteUrl } from "@/lib/site";
import { formatZAR } from "@/lib/format";

export const dynamic = "force-dynamic";

const stamp = (iso: string, time: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours - 2, minutes));
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
};

const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const booking = await dataStore.getBooking(reference.toUpperCase()).catch(() => null);

  if (!booking || booking.status === "cancelled") {
    return new Response("Appointment not found", { status: 404 });
  }

  const start = stamp(booking.date, booking.time);
  const [hours, minutes] = booking.time.split(":").map(Number);
  const endDate = new Date(
    Date.UTC(
      Number(booking.date.slice(0, 4)),
      Number(booking.date.slice(5, 7)) - 1,
      Number(booking.date.slice(8, 10)),
      hours - 2,
      minutes + booking.duration,
    ),
  );
  const end = endDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  const description = [
    `Reference: ${booking.reference}`,
    `Service: ${booking.serviceName}`,
    booking.addons.length
      ? `Add-ons: ${booking.addons.map((addon) => addon.name).join(", ")}`
      : null,
    `Total: ${formatZAR(booking.price)}`,
    `Studio: ${site.city}, ${site.province}. The exact address is shared when the booking is confirmed.`,
    "Please arrive on time. Reschedule at least 24 hours ahead.",
    `Status: ${booking.status}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Crankified's Beauty Bar//Appointments//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.reference}@crankifiedsbeautybar`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escape(`${booking.serviceName} — Crankified's Beauty Bar`)}`,
    `DESCRIPTION:${escape(description)}`,
    `LOCATION:${escape(`${site.city}, ${site.province}, South Africa`)}`,
    `URL:${siteUrl()}/appointment/${booking.reference}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Appointment at Crankified's tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="crankifieds-${booking.reference}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
