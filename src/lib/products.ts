import { images } from "./images";

export type ProductCategory = "iphones" | "sneakers" | "accessories";
export type Condition = "Brand new" | "Pre-owned";

export type ProductOption = {
  label: string;
  values: { label: string; priceDelta?: number }[];
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  condition: Condition;
  grade?: string;
  price: number;
  image: string;
  blurb: string;
  specs: string[];
  option?: ProductOption;
  badge?: string;
};

export const productCategories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "iphones", label: "iPhones" },
  { id: "sneakers", label: "Sneakers" },
  { id: "accessories", label: "Accessories" },
];

const phoneSpecs = (storage: string, battery?: string): string[] => [
  `Storage: ${storage}`,
  "iCloud removed · activation lock clear",
  ...(battery ? [`Battery health: ${battery}`] : ["Sealed, never activated"]),
  "30-point check · original parts only",
];

export const products: Product[] = [
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iphones",
    condition: "Brand new",
    price: 21999,
    image: images.iphone,
    blurb: "Sealed, unactivated and ready for a new iCloud. Titanium finish.",
    specs: phoneSpecs("128GB"),
    option: {
      label: "Storage",
      values: [
        { label: "128GB" },
        { label: "256GB", priceDelta: 1800 },
        { label: "512GB", priceDelta: 4200 },
      ],
    },
    badge: "New arrival",
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iphones",
    condition: "Pre-owned",
    grade: "Grade A",
    price: 15999,
    image: images.iphoneDetail,
    blurb: "The big-screen Pro. Light marks at most, battery healthy and screen flawless.",
    specs: [...phoneSpecs("256GB", "92%"), "Grade A: near-flawless body"],
    option: {
      label: "Storage",
      values: [{ label: "256GB" }, { label: "512GB", priceDelta: 1500 }],
    },
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "iphones",
    condition: "Brand new",
    price: 16999,
    image: images.iphoneAlt,
    blurb: "Sealed 15 with USB-C and the 48MP main camera. The sensible upgrade.",
    specs: phoneSpecs("128GB"),
    option: {
      label: "Colour",
      values: [
        { label: "Black" },
        { label: "Blue" },
        { label: "Pink" },
        { label: "Green" },
      ],
    },
  },
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    category: "iphones",
    condition: "Pre-owned",
    grade: "Grade A",
    price: 12499,
    image: images.iphoneDetail,
    blurb: "ProMotion, Dynamic Island and a camera that still leads most of the room.",
    specs: phoneSpecs("128GB", "89%"),
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    category: "iphones",
    condition: "Pre-owned",
    grade: "Grade A",
    price: 8999,
    image: images.iphoneAlt,
    blurb: "The value pick. Clean body, strong battery, all-day dependable.",
    specs: phoneSpecs("128GB", "88%"),
  },
  {
    id: "iphone-12",
    name: "iPhone 12",
    category: "iphones",
    condition: "Pre-owned",
    grade: "Grade B",
    price: 5999,
    image: images.iphone,
    blurb: "Honest Grade B: visible wear on the frame, everything else healthy.",
    specs: [...phoneSpecs("64GB", "85%"), "Grade B: light cosmetic wear"],
  },
  {
    id: "iphone-se",
    name: "iPhone SE (3rd gen)",
    category: "iphones",
    condition: "Brand new",
    price: 10499,
    image: images.iphone,
    blurb: "Small, quick and familiar. Sealed with a home button and Touch ID.",
    specs: phoneSpecs("64GB"),
  },
  {
    id: "air-force-1",
    name: "Nike Air Force 1 '07",
    category: "sneakers",
    condition: "Brand new",
    price: 2299,
    image: images.sneakers,
    blurb: "The white-on-white standard. Leather upper, Air sole, clean lines.",
    specs: ["Brand new · original box", "UK sizes 3 – 11", "Authenticity checked"],
    option: {
      label: "Size (UK)",
      values: [
        { label: "4" },
        { label: "5" },
        { label: "6" },
        { label: "7" },
        { label: "8" },
        { label: "9" },
        { label: "10" },
        { label: "11" },
      ],
    },
  },
  {
    id: "dunk-low",
    name: "Nike Dunk Low Retro",
    category: "sneakers",
    condition: "Brand new",
    price: 2799,
    image: images.sneakerStudio,
    blurb: "Low-profile, two-tone and endlessly wearable. Original box included.",
    specs: ["Brand new · original box", "UK sizes 4 – 10", "Authenticity checked"],
    option: {
      label: "Size (UK)",
      values: [{ label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "10" }],
    },
  },
  {
    id: "jordan-1-mid",
    name: "Air Jordan 1 Mid",
    category: "sneakers",
    condition: "Brand new",
    price: 3499,
    image: images.sneakerRed,
    blurb: "The silhouette that started the obsession. Leather build, classic colourway.",
    specs: ["Brand new · original box", "UK sizes 5 – 11", "Authenticity checked"],
    option: {
      label: "Size (UK)",
      values: [{ label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "10" }, { label: "11" }],
    },
    badge: "Most wanted",
  },
  {
    id: "new-balance-530",
    name: "New Balance 530",
    category: "sneakers",
    condition: "Brand new",
    price: 2199,
    image: images.sneakerStreet,
    blurb: "Retro runner lines, everyday comfort. The quiet flex of the season.",
    specs: ["Brand new · original box", "UK sizes 4 – 9", "Authenticity checked"],
    option: {
      label: "Size (UK)",
      values: [{ label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }],
    },
  },
  {
    id: "adidas-samba",
    name: "Adidas Samba OG",
    category: "sneakers",
    condition: "Brand new",
    price: 2599,
    image: images.sneakerRed,
    blurb: "The terrace classic that refuses to leave the rotation.",
    specs: ["Brand new · original box", "UK sizes 3 – 9", "Authenticity checked"],
    option: {
      label: "Size (UK)",
      values: [{ label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }],
    },
  },
  {
    id: "on-cloud-5",
    name: "On Cloud 5",
    category: "sneakers",
    condition: "Pre-owned",
    grade: "Excellent",
    price: 1899,
    image: images.sneakers,
    blurb: "Lightly worn, cleaned and checked. Swiss cushioning for long days.",
    specs: ["Pre-owned · excellent condition", "UK sizes 6 – 9", "Cleaned inside and out"],
    option: {
      label: "Size (UK)",
      values: [{ label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }],
    },
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro (2nd gen)",
    category: "accessories",
    condition: "Brand new",
    price: 3499,
    image: images.audio,
    blurb: "USB-C, adaptive audio and sealed. The upgrade your commute deserves.",
    specs: ["Brand new · sealed", "USB-C charging case", "Apple warranty"],
  },
  {
    id: "watch-s9",
    name: "Apple Watch Series 9 · 41mm",
    category: "accessories",
    condition: "Pre-owned",
    grade: "Grade A",
    price: 6499,
    image: images.watch,
    blurb: "Aluminium case, healthy battery and a fresh band. Unpaired and reset.",
    specs: ["Pre-owned · Grade A", "Aluminium case · 41mm", "GPS · battery 91%"],
  },
  {
    id: "magsafe-battery",
    name: "Apple MagSafe Battery Pack",
    category: "accessories",
    condition: "Brand new",
    price: 1199,
    image: images.iphoneAlt,
    blurb: "Sealed, official Apple accessory. Snap-on power without the cable.",
    specs: ["Brand new · sealed", "Official Apple accessory", "USB-C"],
  },
  {
    id: "g-shock",
    name: "Casio G-Shock GA-2100",
    category: "accessories",
    condition: "Brand new",
    price: 1899,
    image: images.watch,
    blurb: "Slim carbon core, impossible to kill. The everyday beater with manners.",
    specs: ["Brand new · boxed", "Carbon core guard", "200m water resistance"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
