import Link from "next/link";
import { ArrowRight, Sparkle } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[75svh] items-center bg-[#f6f0e6]">
      <div className="shell py-20">
        <p className="label flex items-center gap-3 text-stone">
          <Sparkle className="h-3.5 w-3.5 text-champagne" /> 404
        </p>
        <h1 className="display mt-6 max-w-3xl text-[clamp(2.8rem,7vw,5.6rem)]">
          This page took
          <br />
          a <span className="italic">different appointment.</span>
        </h1>
        <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-ink/55">
          The link may be old or mistyped. The chair is still here — start with the menu or
          go straight to booking.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/book" className="btn btn-ink">
            Book an appointment <ArrowRight />
          </Link>
          <Link href="/services" className="btn btn-outline">
            View the menu
          </Link>
        </div>
      </div>
    </div>
  );
}
