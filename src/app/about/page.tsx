import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { images } from "@/lib/images";
import { site, whatsappHref } from "@/lib/site";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Pin,
  Sparkle,
  WhatsApp,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "The studio",
  description:
    "Inside Crankified's Beauty Bar in Ermelo: a private, one-on-one studio for hair, lashes and nails. Studio etiquette, appointment policies, location and contact.",
  alternates: { canonical: "/about" },
};

const nonNegotiables = [
  {
    index: "01",
    title: "Hygiene you can see",
    body: "Tools are disinfected between every client, files and buffers are single-use, and the bed, basin and station are reset before you sit down.",
  },
  {
    index: "02",
    title: "Time is respected",
    body: "One client at a time means the appointment starts when it is booked. If something runs over, you are told — not left guessing.",
  },
  {
    index: "03",
    title: "Honest pricing",
    body: "The price is the price. If length, density or art will change it, you hear the number before the service starts, not at the till.",
  },
  {
    index: "04",
    title: "Your business stays yours",
    body: "Details shared for a booking are used to confirm it. They are not sold, shared or added to a mailing list you did not ask for.",
  },
];

const etiquette = [
  {
    title: "Arrive on time",
    body: "Five minutes early is perfect — enough time to settle, not enough to wait. Arrivals more than 15 minutes late may need to shorten the service so the next client is not delayed.",
  },
  {
    title: "Come with clean hair or lashes",
    body: "Where relevant, arrive with product-free hair and clean lashes. It protects the finish and keeps your full appointment time for the work itself.",
  },
  {
    title: "Guests",
    body: "The studio is small and private. Please come alone unless the appointment is for a child or you have arranged otherwise with us in advance.",
  },
  {
    title: "Phones",
    body: "Calls are fine. Long video calls are not — the chair is a place to put the phone down for a while.",
  },
  {
    title: "Payment",
    body: "Cash or EFT, confirmed when your booking is accepted. Nothing is charged through the website.",
  },
  {
    title: "Rescheduling",
    body: "Send your reference at least 24 hours ahead and we will move you. Repeated late cancellations may need a deposit for future bookings.",
  },
];

const faqs = [
  {
    q: "Do you accept walk-ins?",
    a: "Thursdays only, and subject to the chair being free. Every other day is by appointment so each client gets the full time they booked.",
  },
  {
    q: "Where exactly is the studio?",
    a: "In Ermelo, Mpumalanga. The exact address is shared when your appointment is confirmed — it is a private studio, not a walk-in shopping centre salon.",
  },
  {
    q: "Do you require a deposit?",
    a: "Usually not. Longer services such as braids, colour and installs may need a small deposit to hold the chair. We tell you before you commit.",
  },
  {
    q: "What happens if I am late?",
    a: "Tell us as soon as you know. We will do what we can within the remaining time. If the service cannot be completed properly, we may need to move you to another slot.",
  },
  {
    q: "Can I bring my own hair or nails?",
    a: "Yes, if it is the right quality for the service. Mention it when booking so we can allow the correct time and confirm what works.",
  },
];

export default function AboutPage() {
  const whatsapp = whatsappHref();

  return (
    <div>
      <section className="border-b border-line bg-[#f6f0e6]">
        <div className="shell py-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="label flex items-center gap-3 text-stone">
                <Sparkle className="h-3.5 w-3.5 text-champagne" />
                The studio
              </p>
              <h1 className="display mt-6 text-[clamp(3rem,7vw,5.8rem)]">
                One chair.
                <br />
                One <span className="italic">standard.</span>
              </h1>
              <p className="lede mt-6 max-w-lg text-ink/65">
                Crankified&rsquo;s is a private beauty bar in {site.city} for hair, lashes
                and nails. No crowded floor, no double-booked chairs — just a proper
                appointment, done properly.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/book" className="btn btn-ink">
                  Book an appointment <ArrowRight />
                </Link>
                <a href="#contact" className="btn btn-outline">
                  Ask a question
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                <img
                  src={images.studio}
                  alt="The Crankified's studio interior"
                  className="img-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6 pt-16">
                  <p className="text-[9.5px] uppercase tracking-[0.2em] text-ivory/55">
                    {site.city} &middot; {site.province}
                  </p>
                  <p className="mt-1.5 font-display text-xl text-ivory">
                    By appointment, since {site.established}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">The story</p>
            <h2 className="display mt-4 text-[clamp(2.3rem,4vw,3.4rem)]">
              Built on
              <br />
              <span className="italic">repeat clients.</span>
            </h2>
          </div>
          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            <p className="font-display text-[1.5rem] leading-snug text-ink/85 md:text-[1.7rem]">
              Crankified&rsquo;s started with a simple frustration: beauty appointments
              that felt rushed, chairs that were double-booked, and finishes that looked
              good for two days.
            </p>
            <div className="mt-6 space-y-5 text-[13.5px] leading-relaxed text-ink/60">
              <p>
                The answer was not more clients in a day. It was fewer, done better. One
                chair, one client, enough time to prep properly and finish deliberately.
                That is still the whole model.
              </p>
              <p>
                Hair, lashes and nails are offered under one roof because they are the
                same discipline at different scales: preparation, structure and restraint.
                The same eye that maps a lash line can balance a nail shape or place a
                part. The standard does not change with the service.
              </p>
              <p>
                The vault came later, and for the same reason. Clients kept asking where
                to find a clean iPhone or an honest pair of sneakers. So we started
                sourcing them by hand — checked, graded and priced without the theatre.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { value: "3", label: "Disciplines" },
                { value: "1:1", label: "Appointments" },
                { value: "1–3", label: "Day orders" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#f6f0e6]">
        <div className="shell py-16 md:py-24">
          <div className="reveal max-w-2xl">
            <p className="label text-champagne">The non-negotiables</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.4vw,3.8rem)]">
              What you can count on.
            </h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {nonNegotiables.map((item, index) => (
              <div key={item.title} className="reveal grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line pt-5" data-delay={index > 2 ? undefined : index + 1}>
                <span className="font-display text-sm italic text-champagne">
                  {item.index}
                </span>
                <div>
                  <h3 className="font-display text-[1.35rem] leading-tight">{item.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink/55">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="etiquette" className="shell scroll-mt-24 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">Studio etiquette</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,3.8vw,3.2rem)]">
              How we
              <br />
              <span className="italic">run the room.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-ink/50">
              A few small agreements that keep the studio calm and the appointments on
              time.
            </p>
          </div>
          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            <div className="grid gap-x-8 sm:grid-cols-2">
              {etiquette.map((item) => (
                <div key={item.title} className="border-t border-line py-5">
                  <h3 className="text-[13px] font-medium uppercase tracking-[0.12em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink/55">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 border-y border-line bg-[#f6f0e6]">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">Policies &amp; questions</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,3.8vw,3.2rem)]">
              No small
              <br />
              print.
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-ink/50">
              The policies are short enough to read before you book. If anything is
              unclear, call the studio or send a message.
            </p>
          </div>

          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            <div className="space-y-1">
              {site.policies.map((policy, index) => (
                <details key={policy.title} className="group border-b border-line first:border-t">
                  <summary className="flex items-start justify-between gap-6 py-5">
                    <span className="flex gap-4 text-[14px] leading-snug">
                      <span className="font-display text-sm italic text-champagne">
                        0{index + 1}
                      </span>
                      {policy.title}
                    </span>
                    <span className="faq-plus mt-0.5 shrink-0 transition-transform duration-300">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-6 pl-8 pr-8 text-[12.5px] leading-relaxed text-ink/55">
                    {policy.body}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="label text-stone">Common questions</h3>
              <div className="mt-4">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group border-b border-line">
                    <summary className="flex items-start justify-between gap-6 py-4">
                      <span className="text-[13.5px] leading-snug">{faq.q}</span>
                      <span className="faq-plus mt-0.5 shrink-0 transition-transform duration-300">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </span>
                    </summary>
                    <p className="pb-5 pr-8 text-[12.5px] leading-relaxed text-ink/55">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="shell scroll-mt-24 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">Contact</p>
            <h2 className="display mt-4 text-[clamp(2.3rem,4vw,3.4rem)]">
              Say hello.
              <br />
              <span className="italic">Or ask first.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-ink/55">
              For a question about a service, a product you are looking for, or a date you
              have in mind — send a note. Appointments are booked through the booking
              flow.
            </p>

            <div className="mt-7 space-y-4 border-t border-line pt-6 text-[12.5px] text-ink/60">
              <p className="flex items-start gap-3">
                <Pin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                <span>
                  {site.addressLine}
                  <br />
                  {site.city}, {site.province}, {site.country}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                <span>
                  Mon &ndash; Fri 09:00 &ndash; 18:00
                  <br />
                  Saturday 09:00 &ndash; 15:00 &middot; Sunday closed
                </span>
              </p>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-ink"
                >
                  <WhatsApp className="h-4 w-4 shrink-0 text-champagne" />
                  Message us on WhatsApp
                </a>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  site.mapsQuery,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-ink"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-champagne" />
                Get directions to {site.city}
              </a>
            </div>

            <Link href="/book" className="arrow-link mt-7">
              Book instead <ArrowRight />
            </Link>
          </div>

          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
