import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type OrderStatus = "new" | "sourcing" | "ready" | "collected" | "cancelled";

export type BookingRow = {
  reference: string;
  serviceId: string;
  serviceName: string;
  addons: { id: string; name: string; price: number; duration: number }[];
  date: string;
  time: string;
  duration: number;
  price: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  referralCode: string | null;
  status: BookingStatus;
  createdAt: string;
};

export type OrderRow = {
  reference: string;
  productId: string;
  productName: string;
  price: number;
  optionLabel: string | null;
  optionValue: string | null;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: OrderStatus;
  createdAt: string;
};

export type ReferralRow = {
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  referred: { name: string; phone: string }[];
  rewardId: string;
  rewardName: string;
  status: "pending" | "rewarded" | "cancelled";
  createdAt: string;
};

export type InquiryRow = {
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  createdAt: string;
};

export type BookingInput = Omit<BookingRow, "status" | "createdAt">;
export type OrderInput = Omit<OrderRow, "status" | "createdAt">;
export type ReferralInput = Omit<ReferralRow, "status" | "createdAt">;
export type InquiryInput = Omit<InquiryRow, "createdAt">;

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(prefix: "CRK" | "ORD" | "REF" | "MSG") {
  const bytes = randomBytes(6);
  let code = "";
  for (const byte of bytes) code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  return `${prefix}-${code}`;
}

/* ── Local development store ─────────────────────────────────────────────── */

type LocalStore = {
  bookings: BookingRow[];
  orders: OrderRow[];
  referrals: ReferralRow[];
  inquiries: InquiryRow[];
};

const localPath = path.join(process.cwd(), ".data", "store.json");
let localQueue: Promise<unknown> = Promise.resolve();

const emptyStore = (): LocalStore => ({
  bookings: [],
  orders: [],
  referrals: [],
  inquiries: [],
});

async function readLocal(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(localPath, "utf8");
    return { ...emptyStore(), ...(JSON.parse(raw) as LocalStore) };
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: LocalStore) {
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, JSON.stringify(store, null, 2), "utf8");
}

function mutateLocal<T>(fn: (store: LocalStore) => T | Promise<T>): Promise<T> {
  const next = localQueue.then(async () => {
    const store = await readLocal();
    const result = await fn(store);
    await writeLocal(store);
    return result;
  });
  localQueue = next.catch(() => undefined);
  return next;
}

/* ── Postgres ────────────────────────────────────────────────────────────── */

const connectionString = process.env.DATABASE_URL;
const usingPostgres = Boolean(connectionString);

type NeonQuery = (
  text: string,
  params?: unknown[],
) => Promise<Record<string, unknown>[]>;

let sqlPromise: Promise<NeonQuery> | null = null;

async function sql(): Promise<NeonQuery> {
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  if (!sqlPromise) {
    sqlPromise = import("@neondatabase/serverless").then(
      ({ neon }) =>
        neon(connectionString, { fullResults: false }) as unknown as NeonQuery,
    );
  }
  return sqlPromise;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  if (!usingPostgres) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      const query = await sql();
      const statements = [
        `CREATE TABLE IF NOT EXISTS bookings (
          id BIGSERIAL PRIMARY KEY,
          reference TEXT UNIQUE NOT NULL,
          service_id TEXT NOT NULL,
          service_name TEXT NOT NULL,
          addons JSONB NOT NULL DEFAULT '[]'::jsonb,
          date DATE NOT NULL,
          time TEXT NOT NULL,
          duration INTEGER NOT NULL,
          price INTEGER NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          notes TEXT,
          referral_code TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`,
        `CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings (date)`,
        `CREATE TABLE IF NOT EXISTS orders (
          id BIGSERIAL PRIMARY KEY,
          reference TEXT UNIQUE NOT NULL,
          product_id TEXT NOT NULL,
          product_name TEXT NOT NULL,
          price INTEGER NOT NULL,
          option_label TEXT,
          option_value TEXT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          notes TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`,
        `CREATE TABLE IF NOT EXISTS referrals (
          id BIGSERIAL PRIMARY KEY,
          reference TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          referred JSONB NOT NULL DEFAULT '[]'::jsonb,
          reward_id TEXT NOT NULL,
          reward_name TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`,
        `CREATE TABLE IF NOT EXISTS inquiries (
          id BIGSERIAL PRIMARY KEY,
          reference TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`,
      ];
      for (const statement of statements) {
        await query(statement);
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

const iso = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return String(value ?? "");
};

const dateOnly = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
};

const mapBooking = (row: Record<string, unknown>): BookingRow => ({
  reference: String(row.reference),
  serviceId: String(row.service_id),
  serviceName: String(row.service_name),
  addons: (row.addons ?? []) as BookingRow["addons"],
  date: dateOnly(row.date),
  time: String(row.time).slice(0, 5),
  duration: Number(row.duration),
  price: Number(row.price),
  name: String(row.name),
  phone: String(row.phone),
  email: (row.email as string | null) ?? null,
  notes: (row.notes as string | null) ?? null,
  referralCode: (row.referral_code as string | null) ?? null,
  status: String(row.status) as BookingStatus,
  createdAt: iso(row.created_at),
});

const mapOrder = (row: Record<string, unknown>): OrderRow => ({
  reference: String(row.reference),
  productId: String(row.product_id),
  productName: String(row.product_name),
  price: Number(row.price),
  optionLabel: (row.option_label as string | null) ?? null,
  optionValue: (row.option_value as string | null) ?? null,
  name: String(row.name),
  phone: String(row.phone),
  email: (row.email as string | null) ?? null,
  notes: (row.notes as string | null) ?? null,
  status: String(row.status) as OrderStatus,
  createdAt: iso(row.created_at),
});

const mapReferral = (row: Record<string, unknown>): ReferralRow => ({
  reference: String(row.reference),
  name: String(row.name),
  phone: String(row.phone),
  email: (row.email as string | null) ?? null,
  referred: (row.referred ?? []) as ReferralRow["referred"],
  rewardId: String(row.reward_id),
  rewardName: String(row.reward_name),
  status: String(row.status) as ReferralRow["status"],
  createdAt: iso(row.created_at),
});

const mapInquiry = (row: Record<string, unknown>): InquiryRow => ({
  reference: String(row.reference),
  name: String(row.name),
  phone: String(row.phone),
  email: (row.email as string | null) ?? null,
  message: String(row.message),
  createdAt: iso(row.created_at),
});

/* ── Public API ──────────────────────────────────────────────────────────── */

export const dataStore = {
  usingPostgres,

  async bookingsForDate(date: string): Promise<BookingRow[]> {
    if (!usingPostgres) {
      const store = await readLocal();
      return store.bookings.filter(
        (booking) => booking.date === date && booking.status !== "cancelled",
      );
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      "SELECT * FROM bookings WHERE date = $1 AND status <> 'cancelled' ORDER BY time",
      [date],
    );
    return rows.map(mapBooking);
  },

  async createBooking(input: BookingInput): Promise<BookingRow> {
    const row: BookingRow = {
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    if (!usingPostgres) {
      return mutateLocal((store) => {
        store.bookings.push(row);
        return row;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      `INSERT INTO bookings
        (reference, service_id, service_name, addons, date, time, duration, price, name, phone, email, notes, referral_code, status)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending')
       RETURNING *`,
      [
        row.reference,
        row.serviceId,
        row.serviceName,
        JSON.stringify(row.addons),
        row.date,
        row.time,
        row.duration,
        row.price,
        row.name,
        row.phone,
        row.email,
        row.notes,
        row.referralCode,
      ],
    );
    return mapBooking(rows[0]);
  },

  async listBookings(): Promise<BookingRow[]> {
    if (!usingPostgres) {
      const store = await readLocal();
      return [...store.bookings].sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
      );
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query("SELECT * FROM bookings ORDER BY date DESC, time DESC LIMIT 400");
    return rows.map(mapBooking);
  },

  async getBooking(reference: string): Promise<BookingRow | null> {
    if (!usingPostgres) {
      const store = await readLocal();
      return store.bookings.find((booking) => booking.reference === reference) ?? null;
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query("SELECT * FROM bookings WHERE reference = $1 LIMIT 1", [
      reference,
    ]);
    return rows[0] ? mapBooking(rows[0]) : null;
  },

  async setBookingStatus(reference: string, status: BookingStatus) {
    if (!usingPostgres) {
      return mutateLocal((store) => {
        const booking = store.bookings.find((item) => item.reference === reference);
        if (booking) booking.status = status;
        return booking ?? null;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      "UPDATE bookings SET status = $2 WHERE reference = $1 RETURNING *",
      [reference, status],
    );
    return rows[0] ? mapBooking(rows[0]) : null;
  },

  async createOrder(input: OrderInput): Promise<OrderRow> {
    const row: OrderRow = {
      ...input,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    if (!usingPostgres) {
      return mutateLocal((store) => {
        store.orders.push(row);
        return row;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      `INSERT INTO orders
        (reference, product_id, product_name, price, option_label, option_value, name, phone, email, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'new')
       RETURNING *`,
      [
        row.reference,
        row.productId,
        row.productName,
        row.price,
        row.optionLabel,
        row.optionValue,
        row.name,
        row.phone,
        row.email,
        row.notes,
      ],
    );
    return mapOrder(rows[0]);
  },

  async listOrders(): Promise<OrderRow[]> {
    if (!usingPostgres) {
      const store = await readLocal();
      return [...store.orders].reverse();
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 400");
    return rows.map(mapOrder);
  },

  async setOrderStatus(reference: string, status: OrderStatus) {
    if (!usingPostgres) {
      return mutateLocal((store) => {
        const order = store.orders.find((item) => item.reference === reference);
        if (order) order.status = status;
        return order ?? null;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      "UPDATE orders SET status = $2 WHERE reference = $1 RETURNING *",
      [reference, status],
    );
    return rows[0] ? mapOrder(rows[0]) : null;
  },

  async createReferral(input: ReferralInput): Promise<ReferralRow> {
    const row: ReferralRow = {
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    if (!usingPostgres) {
      return mutateLocal((store) => {
        store.referrals.push(row);
        return row;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      `INSERT INTO referrals
        (reference, name, phone, email, referred, reward_id, reward_name, status)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,'pending')
       RETURNING *`,
      [
        row.reference,
        row.name,
        row.phone,
        row.email,
        JSON.stringify(row.referred),
        row.rewardId,
        row.rewardName,
      ],
    );
    return mapReferral(rows[0]);
  },

  async listReferrals(): Promise<ReferralRow[]> {
    if (!usingPostgres) {
      const store = await readLocal();
      return [...store.referrals].reverse();
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query("SELECT * FROM referrals ORDER BY created_at DESC LIMIT 200");
    return rows.map(mapReferral);
  },

  async setReferralStatus(reference: string, status: ReferralRow["status"]) {
    if (!usingPostgres) {
      return mutateLocal((store) => {
        const referral = store.referrals.find((item) => item.reference === reference);
        if (referral) referral.status = status;
        return referral ?? null;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      "UPDATE referrals SET status = $2 WHERE reference = $1 RETURNING *",
      [reference, status],
    );
    return rows[0] ? mapReferral(rows[0]) : null;
  },

  async createInquiry(input: InquiryInput): Promise<InquiryRow> {
    const row: InquiryRow = { ...input, createdAt: new Date().toISOString() };
    if (!usingPostgres) {
      return mutateLocal((store) => {
        store.inquiries.push(row);
        return row;
      });
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query(
      `INSERT INTO inquiries (reference, name, phone, email, message)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [row.reference, row.name, row.phone, row.email, row.message],
    );
    return mapInquiry(rows[0]);
  },

  async listInquiries(): Promise<InquiryRow[]> {
    if (!usingPostgres) {
      const store = await readLocal();
      return [...store.inquiries].reverse();
    }
    await ensureSchema();
    const query = await sql();
    const rows = await query("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200");
    return rows.map(mapInquiry);
  },
};
