"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ArrowUpRight } from "./icons";

export function MobileBar() {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith("/book") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/appointment");

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 backdrop-blur-md sm:hidden">
      <div className="flex items-stretch pb-[env(safe-area-inset-bottom)]">
        <Link
          href="/book"
          className="flex min-h-[3.25rem] flex-1 items-center justify-center gap-2.5 bg-ink px-2 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-ivory active:bg-ink-3"
        >
          <Calendar className="h-4 w-4 shrink-0" /> Book appointment
        </Link>
        <Link
          href="/shop"
          className="flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 px-2 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-ink active:bg-ink/5"
        >
          The Vault <ArrowUpRight className="h-3 w-3 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
