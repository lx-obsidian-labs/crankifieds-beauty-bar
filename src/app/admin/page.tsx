import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";
import { isAdmin } from "@/lib/admin";
import { dataStore } from "@/lib/db";
import type {
  BookingRow,
  InquiryRow,
  OrderRow,
  ReferralRow,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  let data: {
    bookings: BookingRow[];
    orders: OrderRow[];
    referrals: ReferralRow[];
    inquiries: InquiryRow[];
  };

  try {
    const [bookings, orders, referrals, inquiries] = await Promise.all([
      dataStore.listBookings(),
      dataStore.listOrders(),
      dataStore.listReferrals(),
      dataStore.listInquiries(),
    ]);
    data = { bookings, orders, referrals, inquiries };
  } catch (error) {
    console.error("admin dashboard failed", error);
    return <DeskOffline />;
  }

  return (
    <AdminDashboard
      bookings={data.bookings}
      orders={data.orders}
      referrals={data.referrals}
      inquiries={data.inquiries}
      usingPostgres={dataStore.usingPostgres}
    />
  );
}

function DeskOffline() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-[#f6f0e6] px-4">
      <div className="max-w-md border border-line bg-cream p-8 text-center">
        <p className="label text-champagne">Studio desk</p>
        <h1 className="display mt-3 text-3xl">The desk is offline.</h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/55">
          The database could not be reached. Check the <code>DATABASE_URL</code> environment
          variable and try again.
        </p>
      </div>
    </div>
  );
}
