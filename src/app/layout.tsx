import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileBar } from "@/components/MobileBar";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const url = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${site.name} — Hair, Lashes & Nails in Ermelo`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "hair salon Ermelo",
    "lashes Ermelo",
    "nails Ermelo",
    "beauty bar Mpumalanga",
    "braids Ermelo",
    "silk press Ermelo",
    "lash extensions Ermelo",
    "acrylic nails Ermelo",
    "iPhone Ermelo",
    "sneakers Ermelo",
    "Crankified's Beauty Bar",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url,
    siteName: site.name,
    title: `${site.name} — Hair, Lashes & Nails in Ermelo`,
    description: site.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — hair, lashes and nails in ${site.city}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Hair, Lashes & Nails in Ermelo`,
    description: site.description,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "beauty",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: site.name,
  description: site.description,
  url,
  image: `${url}/opengraph-image.png`,
  priceRange: "R120 – R1 450",
  currenciesAccepted: "ZAR",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.province,
    addressCountry: "ZA",
  },
  areaServed: [
    { "@type": "City", name: "Ermelo" },
    { "@type": "AdministrativeArea", name: "Mpumalanga" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Thursday"],
      opens: "09:00",
      closes: "18:00",
      description: "Walk-ins welcome",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Service menu",
    itemListElement: ["Hair", "Lashes", "Nails"].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${bodoni.variable} ${jost.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js')}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex min-h-full flex-col pb-[50px] sm:pb-0">
        <ScrollProgress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-widest focus:text-ivory"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileBar />
        <div className="grain" aria-hidden="true" />
        <ScrollReveal />
      </body>
    </html>
  );
}
