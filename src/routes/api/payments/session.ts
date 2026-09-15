import { createFileRoute } from "@tanstack/react-router";
import { getStripe } from "@/lib/server/stripe";
import { getDb } from "@/lib/server/mongodb";
import { saveCheckoutSession } from "@/lib/server/payments";

export const Route = createFileRoute("/api/payments/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const sessionId = new URL(request.url).searchParams.get(
            "session_id",
          );
          if (!sessionId) {
            return Response.json(
              { error: "Missing session_id" },
              { status: 400 },
            );
          }

          const db = await getDb();
          const local = (await db
            .collection("payments")
            .findOne({ stripeSessionId: sessionId })) as Record<string, any> | null;

          if (local) {
            return Response.json(
              {
                planTitle: local["planTitle"],
                amount: local["amount"],
                currency: local["currency"],
                email: local["customerEmail"],
                name: local["customerName"],
                status: local["status"],
                mode: local["mode"],
                invoicePdfUrl: local["invoicePdfUrl"] ?? null,
                hostedInvoiceUrl: local["hostedInvoiceUrl"] ?? null,
              },
              { status: 200 },
            );
          }

          // Fallback: webhook may not have fired yet — read from Stripe directly.
          const stripe = getStripe();
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          let saved = null;
          if (session.payment_status === "paid") {
            saved = await saveCheckoutSession(session);
          }
          return Response.json(
            {
              planTitle: session.metadata?.["planTitle"] ?? null,
              amount: session.amount_total ?? 0,
              currency: (session.currency ?? "eur").toUpperCase(),
              email:
                session.customer_details?.email ?? session.customer_email ?? "",
              name: session.customer_details?.name ?? "",
              status: session.payment_status === "paid" ? "paid" : "pending",
              mode: session.mode,
              invoicePdfUrl: saved?.invoicePdfUrl ?? null,
              hostedInvoiceUrl: saved?.hostedInvoiceUrl ?? null,
            },
            { status: 200 },
          );
        } catch (error) {
          console.error("Error fetching session:", error);
          return Response.json(
            { error: "Failed to fetch session" },
            { status: 500 },
          );
        }
      },
    },
  },
});
