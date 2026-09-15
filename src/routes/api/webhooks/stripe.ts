import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { getStripe } from "@/lib/server/stripe";
import { getDb } from "@/lib/server/mongodb";
import {
  saveCheckoutSession,
  saveRenewalInvoice,
} from "@/lib/server/payments";

/**
 * payments collection shape:
 * {
 *   _id, stripeSessionId (unique), stripeCustomerId?,
 *   stripePaymentIntentId?, stripeSubscriptionId?,
 *   planId, planTitle, amount (in cents), currency,
 *   mode: "subscription" | "payment",
 *   status: "paid" | "canceled" | "failed",
 *   customerName, customerEmail,
 *   invoicePdfUrl?, hostedInvoiceUrl?,
 *   linkedApplicationId?,
 *   createdAt, lastRenewedAt?
 * }
 */

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await getDb();
  await db
    .collection("payments")
    .updateOne(
      { stripeSubscriptionId: subscription.id },
      { $set: { status: "canceled" } },
    );
}

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!webhookSecret) {
          return Response.json(
            { error: "Missing STRIPE_WEBHOOK_SECRET" },
            { status: 500 },
          );
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return Response.json(
            { error: "Missing signature" },
            { status: 400 },
          );
        }

        // Raw body is required for Stripe's HMAC signature verification.
        const rawBody = await request.text();

        let event: Stripe.Event;
        try {
          event = getStripe().webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret,
          );
        } catch (err) {
          console.error("Stripe webhook signature verification failed:", err);
          return Response.json(
            { error: "Invalid signature" },
            { status: 400 },
          );
        }

        try {
          switch (event.type) {
            case "checkout.session.completed":
              await saveCheckoutSession(
                event.data.object as Stripe.Checkout.Session,
              );
              break;
            case "invoice.payment_succeeded":
              await saveRenewalInvoice(event.data.object as Stripe.Invoice);
              break;
            case "customer.subscription.deleted":
              await handleSubscriptionDeleted(
                event.data.object as Stripe.Subscription,
              );
              break;
            default:
              break;
          }

          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error(`Error handling ${event.type}:`, err);
          return Response.json({ error: "Handler error" }, { status: 500 });
        }
      },
    },
  },
});
