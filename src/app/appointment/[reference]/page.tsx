import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dataStore } from "@/lib/db";
import { formatDateLong, formatDuration, formatZAR } from "@/lib/format";
import { site, whatsappHref } from "@/lib/site";
import { ArrowRight, Calendar, Check, Clock, Pin, WhatsApp } from "@/components/icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Appointment ${reference.toUpperCase()}`,
    robots: { index: false, follow: false },
  };
}

const statusCopy: Record<string, { label: string; tone: string; message: string }> = {
  pending: {
    label: "Awaiting confirmation",
    tone: "bg-champagne/25 text-ink/70",
    message:
      "Your request is in. The studio will confirm it personally — usually the same day. Nothing has been charged.",
  },
  confirmed: {
    label: "Confirmed",
    tone: "bg-ink text-ivory",
    message: "You are confirmed. Please arrive five minutes early so the appointment starts on time.",
  },
  completed: {
    label: "Completed",
    tone: "bg-ink/10 text-ink/60",
    message: "This appointment has been completed. Thank you for sitting in the chair.",
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-red-900/10 text-red-900",
    message: "This appointment was cancelled. You are welcome to book a new time whenever you are ready.",
  },
};

export default async function AppointmentPage({ params }: Props) {
  const { reference } = await params;
  const booking = await dataStore
    .getBooking(reference.toUpperCase())
    .catch(() => null);

  if (!booking) notFound();

  const status = statusCopy[booking.status] ?? statusCopy.pending;
  const whatsapp = whatsappHref(`Hi Crankified's — about appointment ${booking.reference}.`);

  return (
    <div className="bg-[#f6f0e6]">
      <div className="shell max-w-4xl py-16 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15">
              <Check className="h-4 w-4 text-champagne" />
            </span>
            <div>
              <p className="label text-stone">Appointment</p>
              <p className="font-display text-2xl tracking-wide">{booking.reference}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] ${status.tone}`}
          >
            {status.label}
          </span>
        </div>

        <h1 className="display mt-10 text-[clamp(2.6rem,6vw,4.6rem)]">
          {booking.status === "cancelled" ? "This appointment" : "You&rsquo;re booked,"}{" "}
          <span className="italic">{booking.name.split(" ")[0]}.</span>
        </h1>
        <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-ink/60">
          {status.message}
        </p>

        <div className="mt-10 border border-line bg-cream">
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-line p-7 sm:border-b-0 sm:border-r">
              <p className="label text-stone">When</p>
              <p className="mt-3 flex items-start gap-2.5 font-display text-[1.45rem] leading-snug">
                <Calendar className="mt-1 h-4 w-4 shrink-0 text-champagne" />
                <span>
                  {formatDateLong(booking.date)}
                  <br />
                  {booking.time} &ndash; {" "}
                  {(() => {
                    const [hours, minutes] = booking.time.split(":").map(Number);
                    const total = hours * 60 + minutes + booking.duration;
                    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
                      total % 60,
                    ).padStart(2, "0")}`;
                  })()}
                </span>
              </p>
              <p className="mt-3 flex items-center gap-2 text-[11.5px] uppercase tracking-[0.16em] text-ink/45">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(booking.duration)} with Crankified
              </p>
            </div>
            <div className="p-7">
              <p className="label text-stone">The service</p>
              <p className="mt-3 font-display text-[1.45rem] leading-snug">
                {booking.serviceName}
              </p>
              {booking.addons.length > 0 && (
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/55">
                  + {booking.addons.map((addon) => addon.name).join(", ")}
                </p>
              )}
              <p className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink/45">
                  Total
                </span>
                <span className="font-display text-2xl">{formatZAR(booking.price)}</span>
              </p>
            </div>
          </div>

          <div className="border-t border-line p-7">
            <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink/60">
              <Pin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
              <span>
                {site.addressLine} &middot; {site.city}, {site.province}.
                <br />
                The studio is by appointment only. Walk-ins are welcome on Thursdays.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {booking.status !== "cancelled" && (
            <a href={`/api/appointment/${booking.reference}/calendar`} className="btn btn-ink">
              Add to calendar <ArrowRight />
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <WhatsApp /> Message the studio
            </a>
          )}
          <Link href="/book" className="btn btn-outline">
            Book another
          </Link>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-[11.5px] leading-relaxed text-ink/45">
          Need to move it? Send the reference{" "}
          <span className="text-ink/70">{booking.reference}</span> at least 24 hours before
          your slot. Keep this page bookmarked — it always shows the latest status.
        </p>
      </div>
    </div>
  );
}
