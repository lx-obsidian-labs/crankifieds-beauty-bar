import Link from "next/link";
import type { Metadata } from "next";
import { images } from "@/lib/images";
import { categories, rewards } from "@/lib/services";
import { products } from "@/lib/products";
import { site, whatsappHref } from "@/lib/site";
import { formatDuration, formatZAR } from "@/lib/format";
import { Ambient } from "@/components/Ambient";
import { Gallery, galleryItems } from "@/components/Gallery";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Pin,
  Sparkle,
  WhatsApp,
} from "@/components/icons";

export const metadata: Metadata = {
  description: site.description,
};

const marquee = [
  "Hair",
  "Lashes",
  "Nails",
  "Appointments",
  "The Vault",
  "iPhones",
  "Sneakers",
  "Referrals",
];

const standard = [
  {
    index: "i",
    title: "One chair, one client",
    body: "Your appointment is not shared with a full floor of walk-ins. The studio belongs to you for the duration — the lighting, the music and the pace.",
  },
  {
    index: "ii",
    title: "The finish is the brief",
    body: "We build for week three, not the photo on day one. Prep, structure and aftercare are part of the service, never an upsell.",
  },
  {
    index: "iii",
    title: "The vault, vetted",
    body: "Phones and sneakers are sourced and checked by hand. Battery-tested, authenticity-checked, honestly graded — or not sold.",
  },
];

const faqs = [
  {
    q: "Do you take walk-ins?",
    a: "Only on Thursdays. Every other day runs on appointments so each client gets the chair without a queue. Thursday walk-ins are still subject to availability — booking ahead is always the safer option.",
  },
  {
    q: "How do I book?",
    a: "Use the online booking flow. Choose your service, date and time, and you will receive an appointment reference immediately. Nothing is charged online. We confirm every booking personally.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Send us your reference at least 24 hours before your slot. We will move you to the next available time so the chair can be offered to someone else.",
  },
  {
    q: "How quickly do orders arrive?",
    a: "Orders typically take 1 to 3 days. Collection is in Ermelo, or we can courier nationwide. We confirm stock and delivery with you before anything is paid.",
  },
  {
    q: "How does the referral gift work?",
    a: "Send three clients our way and tell us their names when you claim. Once all three have been seen, choose one of three signature services on us — a silk press, a volume lash set or a full acrylic set with art.",
  },
];

const featuredProducts = ["iphone-16-pro", "jordan-1-mid", "airpods-pro"]
  .map((id) => products.find((product) => product.id === id))
  .filter(Boolean);

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3 text-stone">
      <span className="text-champagne">{index}</span>
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function HomePage() {
  const whatsapp = whatsappHref();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <img
          src={images.hero}
          alt="Warm light inside a private beauty studio"
          className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover object-center"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,10,9,0.88)_0%,rgba(11,10,9,0.44)_36%,rgba(11,10,9,0.74)_70%,rgba(11,10,9,0.98)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_75%_at_78%_18%,rgba(194,160,106,0.20)_0%,rgba(194,160,106,0)_58%)]"
          aria-hidden="true"
        />

        <div className="shell flex min-h-[94svh] flex-col justify-between pb-8 pt-12 sm:pb-9 sm:pt-16 md:min-h-[92svh] md:pb-12 md:pt-24">
          <div className="animate-fade-up">
            <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-ivory/60">
              <Sparkle className="h-3.5 w-3.5 text-champagne" />
              <span>
                {site.city}, {site.province}
              </span>
              <span className="h-px w-8 bg-ivory/25" aria-hidden="true" />
              <span>By appointment</span>
            </p>

            <h1 className="display mt-6 text-[clamp(2.9rem,14vw,8.6rem)] text-ivory sm:mt-7 md:text-[clamp(3.3rem,9.6vw,8.6rem)]">
              The luxury
              <br />
              of being
              <br />
              <span className="text-gold italic">properly kept.</span>
            </h1>

            <div className="mt-7 flex items-center gap-4 sm:mt-8">
              <span className="gold-rule w-24" aria-hidden="true" />
              <span className="text-[9.5px] uppercase tracking-[0.3em] text-ivory/45">
                Est. {site.established} &middot; Ermelo
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-12 md:items-end">
            <div className="animate-fade-up md:col-span-7 lg:col-span-6">
              <p className="lede max-w-lg text-ivory/70">
                Hair, lashes and nails in Ermelo — done one client at a time, with the
                patience and precision the word &ldquo;beauty&rdquo; deserves. And a
                small, vetted vault of phones and sneakers when you want something
                else to leave with.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href="/book" className="btn btn-lux shine">
                  Book an appointment <ArrowRight />
                </Link>
                <Link href="/services" className="btn btn-ghost-light">
                  View the menu
                </Link>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ivory/15 pt-6">
                {[
                  { term: "One client", detail: "per appointment" },
                  { term: "60+", detail: "styles on the menu" },
                  { term: "1–3 days", detail: "vault delivery" },
                ].map((stat) => (
                  <div key={stat.term}>
                    <dt className="font-display text-[1.35rem] leading-tight text-champagne-light sm:text-2xl">
                      {stat.term}
                    </dt>
                    <dd className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory/40">
                      {stat.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-fade-up md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
              <div className="glass-dark p-6">
                <p className="label text-champagne">Walk-ins</p>
                <p className="display mt-3 text-[1.65rem] text-ivory sm:text-3xl">
                  Thursdays only
                </p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ivory/50">
                  Every other day is by appointment, so the chair is yours alone.
                  Thursday walk-ins are welcome while the chair is free.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6 border-t border-ivory/15 pt-5 text-[9px] uppercase tracking-[0.26em] text-ivory/40">
            <span>Hair &middot; Lashes &middot; Nails</span>
            <span className="hidden sm:inline">Est. {site.established}</span>
            <span className="flex items-center gap-2">
              Scroll
              <span aria-hidden="true" className="block h-6 w-px bg-ivory/25" />
            </span>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <div className="marquee overflow-hidden border-b border-line bg-cream py-4">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marquee.map((item) => (
                <span
                  key={item}
                  className="flex items-center whitespace-nowrap px-7 text-[10px] font-medium uppercase tracking-[0.3em] text-ink/65 sm:px-10"
                >
                  {item}
                  <span className="ml-7 text-[8px] text-champagne sm:ml-10" aria-hidden="true">
                    &#10022;
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── The Standard ─────────────────────────────────────────────────── */}
      <section className="shell py-20 md:py-28 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="reveal">
              <SectionLabel index="01">The standard</SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.6rem,4.6vw,4.2rem)] text-balance">
                A quieter kind
                <br />
                of <span className="italic">luxury.</span>
              </h2>
            </div>

            <div className="reveal relative mt-10 aspect-[4/5] overflow-hidden bg-ink/10" data-delay="1">
              <img
                src={images.studio}
                alt="The studio set up for a private appointment"
                loading="lazy"
                className="img-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 pt-16">
                <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/60">
                  The studio &middot; {site.city}
                </p>
                <p className="mt-2 font-display text-xl text-ivory">
                  One appointment at a time.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <p className="reveal lede max-w-xl text-ink/70">
              Crankified&rsquo;s is a one-on-one studio. That means no crowded floor, no
              double-booked chairs and no assembly line. Every appointment is yours: the
              lighting, the pace, the finish. We build hair, lashes and nails that suit
              the life you actually live — and we keep them that way.
            </p>

            <div className="mt-10 border-t border-line">
              {standard.map((item, index) => (
                <div
                  key={item.title}
                  className="reveal grid gap-4 border-b border-line py-7 sm:grid-cols-[3rem_1fr]"
                  data-delay={index > 2 ? undefined : index + 1}
                >
                  <span className="font-display text-lg italic text-champagne">
                    {item.index}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-medium uppercase tracking-[0.14em]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-[13.5px] leading-relaxed text-ink/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="arrow-link">
                Inside the studio <ArrowUpRight />
              </Link>
              <a href={whatsapp ?? "/book"} className="arrow-link">
                {whatsapp ? "Ask a question" : "Book a consultation"} <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-cream">
        <div className="shell py-20 md:py-28">
          <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="02">The work</SectionLabel>
              <h2 className="display mt-6 max-w-2xl text-[clamp(2.6rem,5vw,4.6rem)]">
                Seen from
                <br />
                <span className="italic text-gold">the chair.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[13.5px] leading-relaxed text-ink/60">
              Every set is finished, photographed and checked before you leave. This is
              the standard you should expect — not the exception.
            </p>
          </div>

          <div className="mt-12">
            <Gallery items={galleryItems} />
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-[#f6f0e6]">
        <div className="shell py-20 md:py-28">
          <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="03">The menu</SectionLabel>
              <h2 className="display mt-6 max-w-2xl text-[clamp(2.6rem,5vw,4.6rem)]">
                Three disciplines.
                <br />
                <span className="italic">One standard.</span>
              </h2>
            </div>
            <Link href="/services" className="arrow-link shrink-0">
              Full menu &amp; prices <ArrowUpRight />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
            {categories.map((category, index) => {
              const from = Math.min(...category.services.map((service) => service.price));
              const durations = category.services.map((service) => service.duration);
              return (
                <Link
                  key={category.id}
                  href={`/services#${category.id}`}
                  className="reveal group relative isolate flex flex-col justify-end overflow-hidden bg-ink text-ivory shadow-[0_30px_60px_-40px_rgba(11,10,9,0.75)] transition-shadow duration-700 hover:shadow-[0_50px_90px_-46px_rgba(11,10,9,0.85)]"
                  data-delay={index > 2 ? undefined : index + 1}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.name} at Crankified's`}
                      loading="lazy"
                      className="img-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                    />
                    <div
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0.28)_0%,rgba(11,10,9,0.12)_35%,rgba(11,10,9,0.9)_100%)]"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      aria-hidden="true"
                      style={{
                        background:
                          "radial-gradient(90% 60% at 50% 0%, rgba(194,160,106,0.26) 0%, rgba(194,160,106,0) 70%)",
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-ivory/60">
                        {category.index}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                      <h3 className="display text-4xl md:text-[2.6rem]">{category.name}</h3>
                      <p className="mt-2 max-w-[16rem] text-[12.5px] leading-relaxed text-ivory/60">
                        {category.blurb}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-ivory/20 pt-4 text-[10px] uppercase tracking-[0.18em]">
                        <span className="text-ivory/55">
                          {formatDuration(Math.min(...durations))} &ndash;{" "}
                          {formatDuration(Math.max(...durations))}
                        </span>
                        <span className="text-champagne-light">from {formatZAR(from)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="reveal mt-6 text-center text-[11.5px] text-ink/45">
            Prices are a guide and may vary with length, density and art. Your total is
            shown before you confirm a booking.
          </p>
        </div>
      </section>

      {/* ── Statement ────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <Ambient />
        <div className="shell relative py-20 md:py-28">
          <div className="reveal mx-auto max-w-4xl text-center">
            <p className="label text-champagne">The standard</p>
            <blockquote className="display mt-7 text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] text-balance">
              &ldquo;You should leave the chair feeling like the most{" "}
              <span className="italic text-gold">expensive</span> thing in the
              room.&rdquo;
            </blockquote>
            <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
              <span className="gold-rule flex-1" aria-hidden="true" />
              <span className="text-[9.5px] uppercase tracking-[0.3em] text-ivory/40">
                Crankified&rsquo;s
              </span>
              <span className="gold-rule flex-1" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "I have never had a silk press hold in this weather. Three weeks later it still looked deliberate.",
                name: "Nokuthula M.",
                service: "Silk Press & Finish",
              },
              {
                quote:
                  "The lash mapping is the difference. I look awake, not done — and they last.",
                name: "Lerato S.",
                service: "Volume Set",
              },
              {
                quote:
                  "Clean studio, honest pricing, and my set still looked new at week three.",
                name: "Zinhle K.",
                service: "Structured Gel French",
              },
            ].map((testimonial, index) => (
              <figure
                key={testimonial.name}
                className="reveal group relative border border-ivory/12 bg-ivory/[0.045] p-7 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:border-champagne/40 hover:bg-ivory/[0.075]"
                data-delay={index > 2 ? undefined : index + 1}
              >
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-4 font-display text-[3.5rem] leading-none text-champagne/25 transition-colors duration-700 group-hover:text-champagne/55"
                >
                  &rdquo;
                </span>
                <p className="relative font-display text-xl leading-relaxed text-ivory/85">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <figcaption className="relative mt-6 flex items-center gap-3 border-t border-ivory/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-ivory/40">
                  <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
                  {testimonial.name} <span className="text-champagne">/</span>{" "}
                  {testimonial.service}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-center text-[10px] text-ivory/25">
            Words from the chair. Testimonials will be replaced with verified client
            reviews.
          </p>
        </div>
      </section>

      {/* ── The Vault ────────────────────────────────────────────────────── */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="reveal relative order-2 lg:order-1 lg:col-span-6">
            <div className="aspect-[5/4] overflow-hidden bg-ink/10 shadow-[0_40px_80px_-50px_rgba(11,10,9,0.8)]">
              <img
                src={images.sneakers}
                alt="Branded sneakers from the Crankified's vault"
                loading="lazy"
                className="img-cover"
              />
            </div>
            <div className="glass absolute -bottom-6 -right-2 hidden w-44 p-5 shadow-[0_30px_60px_-34px_rgba(11,10,9,0.6)] sm:block md:-right-6 md:w-52 md:p-6">
              <p className="label text-champagne">Delivery</p>
              <p className="display mt-2 text-3xl">1&ndash;3 days</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">
                Collection in Ermelo or courier nationwide.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <div className="reveal">
              <SectionLabel index="04">The vault</SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.6rem,4.8vw,4.4rem)]">
                Beyond
                <br />
                the <span className="italic text-gold">chair.</span>
              </h2>
              <p className="lede mt-6 max-w-md text-ink/65">
                Brand-new and pre-owned iPhones, branded sneakers and a few quiet flexes.
                Sourced, tested and priced honestly — the same standard as everything
                else in the studio.
              </p>
            </div>

            <ul className="reveal mt-8 border-t border-line" data-delay="1">
              {featuredProducts.map((product) => (
                <li key={product!.id}>
                  <Link
                    href={`/shop?product=${product!.id}`}
                    className="group flex items-center gap-4 border-b border-line py-4 transition-colors hover:bg-ink/[0.03]"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden bg-ink/5">
                      <img
                        src={product!.image}
                        alt={product!.name}
                        loading="lazy"
                        className="img-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-normal">{product!.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink/45">
                        {product!.condition}
                        {product!.grade ? ` · ${product!.grade}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-lg">
                      {formatZAR(product!.price)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="reveal mt-8 flex flex-wrap items-center gap-5" data-delay="2">
              <Link href="/shop" className="btn btn-ink shine">
                Enter the vault <ArrowRight />
              </Link>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                {site.deliveryNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Referrals ────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-[#f1e8db]">
        <div className="shell py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <div className="reveal">
                <SectionLabel index="05">The referral programme</SectionLabel>
                <h2 className="display mt-6 text-[clamp(2.6rem,4.8vw,4.4rem)]">
                  Refer three.
                  <br />
                  Choose one of <span className="italic">three.</span>
                </h2>
                <p className="lede mt-6 max-w-md text-ink/65">
                  Send three clients our way. When all three have been seen, the chair is
                  on us — choose the service you actually want, book it Monday to
                  Thursday, and let us take care of the rest.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/referrals" className="btn btn-ink shine">
                    How it works <ArrowRight />
                  </Link>
                  <Link href="/referrals#claim" className="btn btn-ghost">
                    Claim a gift
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="reveal lux-card p-7 md:p-8" data-delay="1">
                <p className="label text-champagne">Choose your gift</p>
                <div className="mt-4">
                  {rewards.map((reward, index) => (
                    <div
                      key={reward.id}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-ink/12 py-5 transition-colors last:border-b-0 hover:bg-ink/[0.02]"
                    >
                      <span className="font-display text-sm italic text-champagne">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="font-display text-[1.35rem] leading-tight">
                          {reward.name}
                        </p>
                        <p className="mt-1 text-[11.5px] text-ink/50">{reward.description}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-ink/40">
                        {formatZAR(reward.value)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-ink/12 pt-4 text-[11px] leading-relaxed text-ink/45">
                  One gift per client, after three completed referrals. Value shown is
                  the menu price of the complimentary service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Book / hours ─────────────────────────────────────────────────── */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="reveal lg:col-span-7">
            <SectionLabel index="06">Appointments</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.8rem,5.6vw,5.2rem)] text-balance">
              Your chair is
              <br />
              <span className="italic">waiting.</span>
            </h2>
            <p className="lede mt-6 max-w-lg text-ink/65">
              Pick your service, choose a time and leave your details. You will get a
              reference on the spot — no account, no online payment. We confirm every
              appointment personally.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/book" className="btn btn-ink shine">
                Book an appointment <ArrowRight />
              </Link>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                <Clock className="h-3.5 w-3.5 text-champagne" />
                Usually confirmed the same day
              </span>
            </div>
          </div>

          <div className="reveal lg:col-span-4 lg:col-start-9" data-delay="1">
            <div className="lux-card p-7 md:p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="label text-ink">Studio hours</h3>
                <span className="text-[9px] uppercase tracking-[0.18em] text-champagne">
                  SAST
                </span>
              </div>
              <ul className="mt-5">
                {site.hours.map((day) => (
                  <li
                    key={day.day}
                    className={`flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-[12.5px] ${
                      day.day === "thursday" ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {day.label}
                      {day.note === "Walk-ins welcome" && (
                        <span className="bg-champagne/25 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-ink/70">
                          Walk-ins
                        </span>
                      )}
                    </span>
                    <span>
                      {day.open === null
                        ? "Closed"
                        : `${String(Math.floor(day.open / 60)).padStart(2, "0")}:00 – ${String(
                            Math.floor((day.close ?? 0) / 60),
                          ).padStart(2, "0")}:00`}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  site.mapsQuery,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-start gap-3 text-[12.5px] leading-relaxed text-ink/60 transition-colors hover:text-ink"
              >
                <Pin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                <span>
                  {site.addressLine}
                  <br />
                  {site.city}, {site.province}
                </span>
              </a>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink/50 hover:text-ink"
                >
                  <WhatsApp className="h-3.5 w-3.5" /> Message the studio
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-[#f6f0e6]">
        <div className="shell grid gap-10 py-20 md:py-24 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <SectionLabel index="07">Good to know</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.3rem,3.6vw,3.4rem)]">
              Questions,
              <br />
              answered.
            </h2>
            <Link href="/about#policies" className="arrow-link mt-8">
              All policies <ArrowUpRight />
            </Link>
          </div>

          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            <div className="lux-card px-6 md:px-9">
              {faqs.map((faq, index) => (
                <details key={faq.q} className="group border-b border-ink/12 last:border-b-0">
                  <summary className="flex items-start justify-between gap-6 py-5 transition-colors hover:text-champagne-deep">
                    <span className="flex gap-4 text-[14.5px] leading-snug">
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
                  <p className="pb-6 pl-8 pr-10 text-[13px] leading-relaxed text-ink/60">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
