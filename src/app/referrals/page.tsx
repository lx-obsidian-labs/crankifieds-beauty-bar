import Link from "next/link";
import type { Metadata } from "next";
import { ReferralExperience } from "./ReferralExperience";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { ArrowRight, Sparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "The referral programme",
  description:
    "Refer three clients to Crankified's Beauty Bar and choose one of three signature services on us: a silk press, a volume lash set or a full acrylic set with art.",
  alternates: { canonical: "/referrals" },
};

const steps = [
  {
    index: "01",
    title: "Send them our way",
    body: "Share the booking page or bring them in. Your three clients book their own appointments and mention your name when they arrive.",
  },
  {
    index: "02",
    title: "We see all three",
    body: "Once each of the three has completed an appointment, the referral counts. There is no minimum spend and no limit on how long it takes.",
  },
  {
    index: "03",
    title: "Choose your gift",
    body: "Claim below with their names and numbers. We verify the appointments, then book your chosen service on us — Monday to Thursday.",
  },
];

const faqs = [
  {
    q: "Do my referrals have to be new clients?",
    a: "Yes. The programme is for new clients who have not been in the chair before, so the three appointments need to be their first with Crankified's.",
  },
  {
    q: "Can I split the gift between services?",
    a: "The gift covers one of the three listed signature services in full. If you would like a different service, we can usually apply the value against it — ask when you claim.",
  },
  {
    q: "How long is the gift valid?",
    a: "Six months from the date the claim is verified. It is personal to you and is booked Monday to Thursday.",
  },
  {
    q: "Can I refer more than three people?",
    a: "Of course. Each set of three completed referrals earns a gift. Claim once per set and we will keep track of the rest.",
  },
];

export default function ReferralsPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <img
          src={images.lifestyle}
          alt="A styled client at Crankified's Beauty Bar"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(11,10,9,0.96)_0%,rgba(11,10,9,0.8)_50%,rgba(11,10,9,0.5)_100%)]"
          aria-hidden="true"
        />
        <div className="shell py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="label flex items-center gap-3 text-ivory/55">
                <Sparkle className="h-3.5 w-3.5 text-champagne" />
                The referral programme
              </p>
              <h1 className="display mt-5 text-[clamp(3rem,7.6vw,6rem)]">
                Refer three.
                <br />
                <span className="italic text-champagne-light">Choose your gift.</span>
              </h1>
              <p className="lede mt-6 max-w-xl text-ivory/65">
                The best compliment is a friend sent our way. Send three new clients, and
                one of three signature services is on us — the silk press, the volume set
                or the full acrylic with art.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#claim" className="btn btn-gold">
                  Claim a gift <ArrowRight />
                </a>
                <Link href="/services" className="btn btn-outline-light">
                  See the menu
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-ivory/20 p-6">
                <p className="label text-champagne">The short version</p>
                <p className="mt-3 font-display text-[1.7rem] leading-tight text-ivory">
                  3 clients seen.
                  <br />
                  1 service free.
                  <br />
                  Your choice of 3.
                </p>
                <p className="mt-4 text-[11.5px] leading-relaxed text-ivory/45">
                  No points, no app, no expiry within the first six months. Just a proper
                  thank you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.index} className="reveal" data-delay={index > 2 ? undefined : index + 1}>
              <div className="flex items-baseline gap-4 border-t border-line pt-5">
                <span className="font-display text-sm italic text-champagne">{step.index}</span>
                <h2 className="font-display text-[1.5rem] leading-tight">{step.title}</h2>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/55">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ReferralExperience />

      <section className="shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">The finer print</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,3.6vw,3.2rem)]">
              Fair,
              <br />
              and simple.
            </h2>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink/50">
              If something is unclear, send a message from the studio page and we will
              answer it before you claim.
            </p>
          </div>
          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group border-b border-line first:border-t">
                <summary className="flex items-start justify-between gap-6 py-5">
                  <span className="flex gap-4 text-[14px] leading-snug">
                    <span className="font-display text-sm italic text-champagne">
                      0{index + 1}
                    </span>
                    {faq.q}
                  </span>
                  <span className="faq-plus mt-0.5 shrink-0 transition-transform duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-6 pl-8 pr-10 text-[12.5px] leading-relaxed text-ink/55">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-lg text-[11.5px] leading-relaxed text-ink/45">
            Referral gifts are booked in {site.city} and are subject to the studio&rsquo;s
            availability. They cannot be exchanged for cash.
          </p>
          <Link href="/book" className="btn btn-ink shrink-0">
            Book your next visit <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
