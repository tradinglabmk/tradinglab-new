import type Stripe from "stripe";
import { getDb } from "@/lib/server/mongodb";
import { getStripe } from "@/lib/server/stripe";

let indexesEnsured = false;

async function ensurePaymentIndexes() {
  if (indexesEnsured) return;

  const db = await getDb();
  await db
    .collection("payments")
    .createIndex({ stripeSessionId: 1 }, { unique: true, sparse: true });
  await db.collection("payments").createIndex({ stripeSubscriptionId: 1 });
  indexesEnsured = true;
}

async function fetchInvoiceUrls(
  invoiceId: string | null,
): Promise<{ invoicePdfUrl: string | null; hostedInvoiceUrl: string | null }> {
  if (!invoiceId) return { invoicePdfUrl: null, hostedInvoiceUrl: null };
  try {
    const invoice = await getStripe().invoices.retrieve(invoiceId);
    return {
      invoicePdfUrl: invoice.invoice_pdf ?? null,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    };
  } catch (err) {
    console.error("Failed to retrieve Stripe invoice:", err);
    return { invoicePdfUrl: null, hostedInvoiceUrl: null };
  }
}

// Sequential, human-readable invoice numbers for our own generated PDF (e.g. TL-0001).
async function getNextInvoiceNumber(): Promise<string> {
  const db = await getDb();
  const result = await db
    .collection<{ _id: string; seq: number }>("counters")
    .findOneAndUpdate(
      { _id: "invoiceNumber" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" },
    );
  const seq = result?.seq ?? 1;
  return `TL-${String(seq).padStart(4, "0")}`;
}

export async function saveCheckoutSession(session: Stripe.Checkout.Session) {
  await ensurePaymentIndexes();

  const db = await getDb();
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const application = email
    ? await db
        .collection("applications")
        .findOne(
          { email: email.toLowerCase().trim() },
          { projection: { _id: 1 } },
        )
    : null;

  const invoiceId =
    typeof session.invoice === "string"
      ? session.invoice
      : (session.invoice?.id ?? null);
  const { invoicePdfUrl, hostedInvoiceUrl } = await fetchInvoiceUrls(invoiceId);

  // Reuse the invoice number if this session was already saved (webhook + success-page race).
  const existing = await db
    .collection("payments")
    .findOne(
      { stripeSessionId: session.id },
      { projection: { invoiceNumber: 1 } },
    );
  const invoiceNumber =
    existing?.["invoiceNumber"] ?? (await getNextInvoiceNumber());

  const payment = {
    stripeSessionId: session.id,
    stripeCustomerId:
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null),
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
    stripeSubscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : (session.subscription?.id ?? null),
    planId: session.metadata?.["planId"] ?? null,
    planTitle: session.metadata?.["planTitle"] ?? null,
    amount: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toUpperCase(),
    mode: session.mode,
    status: "paid" as const,
    customerName: session.customer_details?.name ?? "",
    customerEmail: email.toLowerCase(),
    linkedApplicationId: application ? String(application._id) : null,
    invoicePdfUrl,
    hostedInvoiceUrl,
    invoiceNumber,
    createdAt: new Date(session.created * 1000).toISOString(),
  };

  await db
    .collection("payments")
    .updateOne(
      { stripeSessionId: session.id },
      { $set: payment },
      { upsert: true },
    );

  return payment;
}

export async function saveRenewalInvoice(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof (invoice as unknown as { subscription?: string | Stripe.Subscription })
      .subscription === "string"
      ? (invoice as unknown as { subscription: string }).subscription
      : ((invoice as unknown as { subscription?: Stripe.Subscription })
          .subscription?.id ?? null);
  if (!subscriptionId) return;

  const db = await getDb();
  await db.collection("payments").updateOne(
    { stripeSubscriptionId: subscriptionId },
    {
      $set: {
        status: "paid",
        lastRenewedAt: new Date().toISOString(),
        invoicePdfUrl: invoice.invoice_pdf ?? null,
        hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      },
    },
  );
}
