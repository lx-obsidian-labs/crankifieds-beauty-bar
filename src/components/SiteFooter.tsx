import Link from "next/link";
import { site, siteUrl, telHref, whatsappHref } from "@/lib/site";
import { Ambient } from "./Ambient";
import { Wordmark } from "./Wordmark";
import { ArrowUpRight, Instagram, Phone, Pin, TikTok, WhatsApp } from "./icons";

const columns = [
  {
    title: "The Menu",
    links: [
      { href: "/services#hair", label: "Hair" },
      { href: "/services#lashes", label: "Lashes" },
      { href: "/services#nails", label: "Nails" },
      { href: "/services", label: "Full price list" },
    ],
  },
  {
    title: "The Vault",
    links: [
      { href: "/shop?category=iphones", label: "iPhones" },
      { href: "/shop?category=sneakers", label: "Sneakers" },
      { href: "/shop?category=accessories", label: "Accessories" },
      { href: "/shop", label: "How ordering works" },
    ],
  },
  {
    title: "The Studio",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/referrals", label: "Referral programme" },
      { href: "/about#etiquette", label: "Studio etiquette" },
      { href: "/about#policies", label: "Policies & FAQ" },
    ],
  },
];

export function SiteFooter() {
  const phone = telHref();
  const whatsapp = whatsappHref();
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-ivory">
      <Ambient />
      <div className="shell relative pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Wordmark light />
            <p className="mt-7 max-w-sm text-[13.5px] leading-relaxed text-ivory/55">
              A private beauty bar for hair, lashes and nails — and a small, carefully
              vetted vault of phones and sneakers. One client at a time, by appointment.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-lux shine">
                Book an appointment <ArrowUpRight />
              </Link>
              {(phone || whatsapp) && (
                <a
                  href={(whatsapp ?? phone)!}
                  target={whatsapp ? "_blank" : undefined}
                  rel={whatsapp ? "noopener noreferrer" : undefined}
                  className="btn btn-ghost-light"
                >
                  {whatsapp ? <WhatsApp /> : <Phone />}
                  {whatsapp ? "WhatsApp" : "Call"}
                </a>
              )}
            </div>

            <div className="mt-8 flex items-center gap-3">
              {site.instagram && (
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-champagne hover:text-champagne"
                >
                  <Instagram />
                </a>
              )}
              {site.tiktok && (
                <a
                  href={site.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-champagne hover:text-champagne"
                >
                  <TikTok />
                </a>
              )}
              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="ml-1 text-[10px] uppercase tracking-[0.2em] text-ivory/50 underline-offset-4 hover:text-ivory hover:underline"
                >
                  {site.email}
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="label text-champagne">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ivory/60 transition-colors hover:text-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-ivory/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="label text-champagne">Visit</h3>
            <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ivory/60">
              <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" />
              <span>
                {site.addressLine}
                <br />
                {site.city}, {site.province}
                <br />
                {site.country}
              </span>
            </p>
          </div>
          <div>
            <h3 className="label text-champagne">Hours</h3>
            <ul className="mt-4 space-y-1.5 text-[13px] text-ivory/60">
              <li className="flex justify-between gap-4">
                <span>Mon – Fri</span>
                <span>09:00 – 18:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Saturday</span>
                <span>09:00 – 15:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span>
                <span className="text-ivory/35">Closed</span>
              </li>
              <li className="pt-1 text-[11px] uppercase tracking-[0.16em] text-champagne/80">
                Walk-ins Thursdays
              </li>
            </ul>
          </div>
          <div>
            <h3 className="label text-champagne">Orders</h3>
            <p className="mt-4 text-[13px] leading-relaxed text-ivory/60">
              {site.deliveryNote} Collection in {site.city} or courier nationwide.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-ivory/50 hover:text-champagne"
            >
              Browse the vault <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div>
            <h3 className="label text-champagne">By appointment</h3>
            <p className="mt-4 text-[13px] leading-relaxed text-ivory/60">
              The chair is one at a time. Book online and you will receive a reference
              for your appointment.
            </p>
            <Link
              href="/referrals"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-ivory/50 hover:text-champagne"
            >
              Refer three, choose a gift <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="select-none overflow-hidden">
        <p className="wordmark shell whitespace-nowrap pb-2 text-[15vw] leading-[0.78] text-transparent md:text-[13.5vw] [-webkit-text-stroke:1px_rgba(194,160,106,0.22)]">
          Crankified&rsquo;s
        </p>
      </div>

      <div aria-hidden="true" className="shell">
        <div className="gold-rule opacity-40" />
      </div>

      <div className="border-t border-ivory/10">
        <div className="shell flex flex-col gap-3 py-5 text-[9.5px] uppercase tracking-[0.18em] text-ivory/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/about#policies" className="hover:text-ivory/70">
              Policies
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/referrals" className="hover:text-ivory/70">
              Referrals
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/book" className="hover:text-ivory/70">
              Book
            </Link>
            <span aria-hidden="true" className="hidden sm:inline">
              &middot;
            </span>
            <span className="hidden normal-case tracking-normal text-ivory/25 sm:inline">
              {siteUrl().replace("https://", "")}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
