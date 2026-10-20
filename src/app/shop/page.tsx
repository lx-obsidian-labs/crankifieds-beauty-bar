import Link from "next/link";
import type { Metadata } from "next";
import { ShopClient } from "./ShopClient";
import { products, productCategories, type ProductCategory } from "@/lib/products";
import { site } from "@/lib/site";
import { images } from "@/lib/images";
import { ArrowRight, Check, Clock, Pin, Sparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "The Vault — iPhones, sneakers & accessories",
  description:
    "Brand-new and pre-owned iPhones, branded sneakers and accessories from Crankified's Beauty Bar in Ermelo. Every item checked by hand. Orders typically take 1–3 days, collection or courier nationwide.",
  alternates: { canonical: "/shop" },
};

type Props = { searchParams: Promise<{ category?: string; product?: string }> };

const allowed = productCategories.map((item) => item.id);

export default async function ShopPage({ searchParams }: Props) {
  const { category, product } = await searchParams;
  const initialCategory: ProductCategory | "all" =
    category && allowed.includes(category as ProductCategory)
      ? (category as ProductCategory)
      : "all";
  const initialProduct = products.some((item) => item.id === product) ? product : undefined;

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <img
          src={images.sneakerStudio}
          alt="Sneakers photographed in the studio"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-45"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(11,10,9,0.95)_0%,rgba(11,10,9,0.72)_55%,rgba(11,10,9,0.45)_100%)]"
          aria-hidden="true"
        />
        <div className="shell py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="label flex items-center gap-3 text-ivory/55">
                <Sparkle className="h-3.5 w-3.5 text-champagne" />
                Beyond the chair
              </p>
              <h1 className="display mt-5 text-[clamp(3.2rem,8vw,6.4rem)]">
                The <span className="italic text-champagne-light">vault.</span>
              </h1>
              <p className="lede mt-6 max-w-xl text-ivory/65">
                Brand-new and pre-owned iPhones, branded sneakers and a small edit of
                accessories. Sourced and checked by hand by the same person who does your
                nails — so the standard does not slip at the door.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.18em] text-ivory/50">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-champagne" /> Authenticity checked
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-champagne" /> {site.deliveryNote}
                </span>
                <span className="flex items-center gap-2">
                  <Pin className="h-3.5 w-3.5 text-champagne" /> {site.city} collection
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-ivory/20 p-6">
                <p className="label text-champagne">How it works</p>
                <ol className="mt-4 space-y-3 text-[12px] leading-relaxed text-ivory/60">
                  <li className="flex gap-3">
                    <span className="text-champagne">01</span> Request the piece you want —
                    size, storage, colour.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-champagne">02</span> We confirm stock, total and
                    delivery on your number.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-champagne">03</span> Pay on confirmation, then
                    collect or receive your courier.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShopClient
        products={products}
        initialCategory={initialCategory}
        initialProduct={initialProduct ?? undefined}
      />

      <section className="border-t border-line bg-[#f6f0e6]">
        <div className="shell grid gap-10 py-16 md:grid-cols-3 md:py-20">
          {[
            {
              index: "01",
              title: "Checked, not guessed",
              body: "Pre-owned iPhones are iCloud-free, activation-lock clear, battery-tested and graded honestly. Sneakers are authenticity-checked before they are listed.",
            },
            {
              index: "02",
              title: "1–3 days, not weeks",
              body: "Orders typically take one to three days. Collection in Ermelo, or courier nationwide at cost. We confirm both before you pay.",
            },
            {
              index: "03",
              title: "One honest price",
              body: "No hidden add-ons, no surprise fees. If a device or pair is not as described, we sort it out. That is the whole policy.",
            },
          ].map((item) => (
            <div key={item.title} className="reveal">
              <p className="font-display text-sm italic text-champagne">{item.index}</p>
              <h2 className="mt-3 font-display text-[1.5rem] leading-tight">{item.title}</h2>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="label text-stone">Looking for something specific?</p>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-ink/55">
              Not everything makes it onto the page. Tell us the model, size or colour you
              are after and we will source it.
            </p>
          </div>
          <Link href="/about#contact" className="btn btn-ink shrink-0">
            Send a request <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
