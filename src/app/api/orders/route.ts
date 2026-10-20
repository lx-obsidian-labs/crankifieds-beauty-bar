import { NextResponse } from "next/server";
import { dataStore, makeReference } from "@/lib/db";
import { getProduct } from "@/lib/products";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail, isPhone } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Body = {
  productId?: string;
  optionValue?: string;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "order"));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const product = getProduct(clean(body.productId, 60));
  if (!product) {
    return NextResponse.json({ error: "That item is no longer listed." }, { status: 404 });
  }

  const optionValue = clean(body.optionValue, 40);
  if (product.option) {
    const match = product.option.values.find((value) => value.label === optionValue);
    if (!match) {
      return NextResponse.json(
        { error: `Please choose a ${product.option.label.toLowerCase()}.` },
        { status: 400 },
      );
    }
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 24);
  const email = clean(body.email, 120).toLowerCase();
  const notes = clean(body.notes, 600);

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Please tell us your name.";
  if (!isPhone(phone)) fields.phone = "Enter a phone number we can reach you on.";
  if (!isEmail(email)) fields.email = "That email address does not look right.";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 400 },
    );
  }

  const optionDelta = product.option
    ? product.option.values.find((value) => value.label === optionValue)?.priceDelta ?? 0
    : 0;
  const price = product.price + optionDelta;

  try {
    const order = await dataStore.createOrder({
      reference: makeReference("ORD"),
      productId: product.id,
      productName: product.name,
      price,
      optionLabel: product.option?.label ?? null,
      optionValue: optionValue || null,
      name,
      phone,
      email: email || null,
      notes: notes || null,
    });

    console.info(`[order] ${order.reference} ${product.name} ${optionValue}`);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("order failed", error);
    return NextResponse.json(
      { error: "We could not log that order. Please try again in a moment." },
      { status: 503 },
    );
  }
}
