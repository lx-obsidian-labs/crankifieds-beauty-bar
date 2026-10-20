"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { ArrowUpRight, Close, Menu } from "./icons";

const nav = [
  { href: "/services", label: "Services", index: "01" },
  { href: "/shop", label: "The Vault", index: "02" },
  { href: "/referrals", label: "Referrals", index: "03" },
  { href: "/about", label: "The Studio", index: "04" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="bg-ink text-ivory/65">
        <div className="shell flex h-9 items-center justify-center gap-4 text-center text-[9.5px] uppercase tracking-[0.22em] sm:justify-between sm:text-left">
          <span className="hidden sm:block">
            {site.city} &middot; {site.province}
          </span>
          <span className="truncate">
            By appointment <span className="text-champagne">&middot;</span> Walk-ins
            Thursdays only
          </span>
          <Link
            href="/book"
            className="hidden shrink-0 items-center gap-1.5 transition-colors hover:text-champagne sm:inline-flex"
          >
            Book online <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b bg-cream/92 backdrop-blur-md transition-all duration-500 ${
          scrolled
            ? "border-line shadow-[0_18px_40px_-32px_rgba(11,10,9,0.55)]"
            : "border-transparent"
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-4 transition-all duration-500 sm:gap-6 ${
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[74px]"
          }`}
        >
          <Wordmark compact className="sm:[&>*:first-child]:text-[27px]" />

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex xl:gap-10">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-6 text-[10.5px] font-medium uppercase tracking-[0.22em] text-ink/75 transition-colors hover:text-ink"
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 bottom-[18px] h-px origin-left bg-champagne transition-transform duration-500 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="btn btn-lux shine hidden !px-6 !py-3.5 sm:inline-flex"
            >
              Book now
              <ArrowUpRight />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center border border-line transition-colors hover:border-ink hover:bg-ink hover:text-ivory lg:hidden"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-ink text-ivory animate-backdrop"
        >
          <div className="shell flex h-[74px] shrink-0 items-center justify-between border-b border-ivory/10">
            <Wordmark light compact />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center border border-ivory/20 transition-colors hover:border-champagne"
            >
              <Close />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex min-h-[3.5rem] items-center gap-4 border-b border-ivory/10 py-4"
              >
                <span className="text-[9px] tracking-[0.2em] text-champagne">
                  {item.index}
                </span>
                <span className="display flex-1 text-[clamp(1.9rem,8.5vw,2.4rem)] text-ivory transition-colors group-hover:text-champagne">
                  {item.label}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ivory/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne" />
              </Link>
            ))}
          </nav>

          <div className="shell shrink-0 border-t border-ivory/10 py-6">
            <Link
              href="/book"
              className="btn btn-lux shine w-full"
              onClick={() => setOpen(false)}
            >
              Book an appointment <ArrowUpRight />
            </Link>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-ivory/45">
              {site.city}, {site.province} &middot; Walk-ins Thursdays
            </p>
          </div>
        </div>
      )}
    </>
  );
}
