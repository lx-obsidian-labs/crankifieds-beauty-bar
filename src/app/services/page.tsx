import Link from "next/link";
import type { Metadata } from "next";
import { addOns, categories, rewards } from "@/lib/services";
import { formatDuration, formatZAR } from "@/lib/format";
import { site } from "@/lib/site";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Sparkle,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Services & prices",
  description:
    "The full Crankified's Beauty Bar menu: silk presses, knotless braids, frontal installs, lash sets from classic to mega volume, gel and acrylic nails. Prices and durations listed in South African rand.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div>
      <section className="border-b border-line bg-[#f6f0e6]">
        <div className="shell py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="label flex items-center gap-3 text-stone">
                <span className="text-champagne">The menu</span>
                <span className="h-px w-8 bg-line" aria-hidden="true" />
                Hair &middot; Lashes &middot; Nails
              </p>
              <h1 className="display mt-6 text-[clamp(3rem,7.4vw,6rem)]">
                The full
                <br />
                <span className="italic">menu.</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="lede max-w-md text-ink/65">
                Every price below is a guide, shown in South African rand. Length, density,
                art and hair health can move the final figure — your total is always
                confirmed before the appointment is locked in.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/book" className="btn btn-ink">
                  Book an appointment <ArrowRight />
                </Link>
                <Link href="/referrals" className="btn btn-outline">
                  Referral gifts
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="chip hover:bg-ink hover:text-ivory"
              >
                {category.index} &nbsp; {category.name}
              </a>
            ))}
            <a href="#extras" className="chip hover:bg-ink hover:text-ivory">
              Extras
            </a>
          </div>
        </div>
      </section>

      {categories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`scroll-mt-24 border-b border-line ${
            categoryIndex % 2 === 1 ? "bg-[#f6f0e6]" : ""
          }`}
        >
          <div className="shell py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <div className="reveal">
                    <p className="label text-champagne">{category.index}</p>
                    <h2 className="display mt-3 text-[clamp(2.6rem,4.4vw,3.8rem)]">
                      {category.name}
                    </h2>
                    <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink/60">
                      {category.description}
                    </p>
                  </div>
                  <div className="reveal relative mt-8 aspect-[4/5] overflow-hidden bg-ink/10">
                    <img
                      src={category.image}
                      alt={`${category.name} work at Crankified's Beauty Bar`}
                      loading="lazy"
                      className="img-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                    <p className="absolute bottom-5 left-5 right-5 text-[10px] uppercase tracking-[0.2em] text-ivory/75">
                      {category.blurb}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="reveal border-t border-line">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      className="group grid gap-3 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:gap-8"
                    >
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-display text-[1.45rem] leading-tight">
                            {service.name}
                          </h3>
                          {service.signature && (
                            <span className="inline-flex items-center gap-1 bg-champagne/20 px-2 py-0.5 text-[8px] uppercase tracking-[0.16em] text-ink/60">
                              <Sparkle className="h-2.5 w-2.5" /> Signature
                            </span>
                          )}
                        </div>
                        <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-ink/55">
                          {service.description}
                        </p>
                        <p className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/40">
                          <Clock className="h-3 w-3" /> {formatDuration(service.duration)}
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-5 sm:flex-col sm:items-end">
                        <p className="font-display text-xl whitespace-nowrap">
                          {service.from && (
                            <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">
                              from{" "}
                            </span>
                          )}
                          {formatZAR(service.price)}
                        </p>
                        <Link
                          href={`/book?service=${service.id}`}
                          className="inline-flex items-center gap-1.5 border-b border-ink/20 pb-0.5 text-[9.5px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
                        >
                          Book <ArrowUpRight className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="extras" className="scroll-mt-24 bg-ink text-ivory">
        <div className="shell py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="reveal lg:col-span-4">
              <p className="label text-champagne">Extras</p>
              <h2 className="display mt-3 text-[clamp(2.4rem,4vw,3.4rem)]">
                Add it to
                <br />
                the appointment.
              </h2>
              <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ivory/55">
                Extras can be selected while booking. Each one adds time to your
                appointment, and the total updates before you confirm.
              </p>
            </div>
            <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
              <div className="grid gap-x-10 sm:grid-cols-2">
                {addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className="flex items-baseline justify-between gap-4 border-b border-ivory/10 py-4"
                  >
                    <div>
                      <p className="text-[13.5px] text-ivory/85">{addOn.name}</p>
                      <p className="mt-1 text-[9.5px] uppercase tracking-[0.16em] text-ivory/35">
                        {addOn.categories.join(" · ")} &nbsp;/&nbsp;{" "}
                        {formatDuration(addOn.duration)}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-lg text-champagne-light">
                      {formatZAR(addOn.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="reveal lg:col-span-6">
            <p className="label text-stone">On us</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.6vw,4rem)]">
              Three referrals.
              <br />
              <span className="italic">One gift.</span>
            </h2>
            <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-ink/60">
              Refer three clients, then choose one of these signature services — on the
              house. It is our way of thanking you for trusting us with the people you
              love.
            </p>
            <Link href="/referrals" className="btn btn-ink mt-7">
              How the programme works <ArrowRight />
            </Link>
          </div>
          <div className="reveal lg:col-span-5 lg:col-start-8" data-delay="1">
            {rewards.map((reward, index) => (
              <div
                key={reward.id}
                className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-line py-4 first:border-t"
              >
                <span className="font-display text-sm italic text-champagne">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-display text-[1.3rem] leading-tight">{reward.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink/50">{reward.description}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">
                  {formatZAR(reward.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[11.5px] leading-relaxed text-ink/45">
            Prices are valid from {new Date().getFullYear()} and are reviewed periodically.
            A deposit may be requested for longer services such as braids, colour and
            installs. The studio is in {site.city}, {site.province}, by appointment.
          </p>
          <Link href="/book" className="btn btn-ink shrink-0">
            Find your time <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
