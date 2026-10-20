import Link from "next/link";
import type { Metadata } from "next";
import { BookingWizard } from "./BookingWizard";
import { addDays, todayInStudio } from "@/lib/format";
import { site } from "@/lib/site";
import { ArrowUpRight, Calendar, Clock, Sparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Book hair, lashes or nails at Crankified's Beauty Bar in Ermelo. Choose your service, add extras, pick a time and receive an appointment reference. No payment online.",
  alternates: { canonical: "/book" },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const today = todayInStudio();
  const horizonEnd = addDays(today, site.booking.horizonDays);

  return (
    <div className="bg-[#f6f0e6]">
      <section className="border-b border-line">
        <div className="shell py-12 md:py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="label flex items-center gap-3 text-stone">
                <span className="text-champagne">Appointments</span>
                <span className="h-px w-8 bg-line" aria-hidden="true" />
                {site.city}, {site.province}
              </p>
              <h1 className="display mt-5 text-[clamp(2.8rem,7vw,5.6rem)]">
                Book the <span className="italic">chair.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-ink/60">
                Three short steps and a reference on the spot. Nothing is charged online;
                Crankified confirms every appointment personally before it is locked in.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.18em] text-ink/45">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-champagne" /> Mon &ndash; Sat
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-champagne" /> 09:00 &ndash; 18:00
              </span>
              <span className="flex items-center gap-2">
                <Sparkle className="h-3.5 w-3.5 text-champagne" /> Walk-ins Thursdays
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="shell py-10 md:py-14">
        <BookingWizard today={today} horizonEnd={horizonEnd} initialService={service} />
      </div>

      <div className="shell border-t border-line pb-16 pt-8">
        <div className="flex flex-col justify-between gap-4 text-[11.5px] leading-relaxed text-ink/45 sm:flex-row sm:items-center">
          <p className="max-w-xl">
            Running late or need to move your appointment? Send us your reference at least
            24 hours ahead so the chair can be offered to someone else.
          </p>
          <Link href="/about#policies" className="arrow-link shrink-0">
            Read the policies <ArrowUpRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
