import { createFileRoute } from "@tanstack/react-router";
import { getStripe } from "@/lib/server/stripe";
import { resolveStripePriceId } from "@/lib/server/stripePrices";
import { getPlanById } from "@/lib/data/plans";

export const Route = createFileRoute("/api/payments/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { planId } = await request.json();

          const plan = getPlanById(planId);
          if (!plan) {
            return Response.json({ error: "Unknown plan" }, { status: 400 });
          }

          const priceId = resolveStripePriceId(plan.id);
          const siteUrl =
            process.env["VITE_SITE_URL"]?.replace(/\/+$/, "") ??
            "http://localhost:5173";

          const stripe = getStripe();
          const session = await stripe.checkout.sessions.create({
            mode: plan.mode,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${siteUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/#pricing`,
            billing_address_collection: "auto",
            allow_promotion_codes: true,
            metadata: {
              planId: plan.id,
              planTitle: plan.title,
            },
            ...(plan.mode === "payment"
              ? {
                  invoice_creation: {
                    enabled: true,
                    invoice_data: {
                      description: plan.title,
                      footer: "Thank you for choosing TradingLab.mk!",
                    },
                  },
                  payment_intent_data: {
                    metadata: {
                      planId: plan.id,
                      planTitle: plan.title,
                    },
                  },
                }
              : {
                  subscription_data: {
                    metadata: {
                      planId: plan.id,
                      planTitle: plan.title,
                    },
                  },
                }),
          });

          if (!session.url) {
            return Response.json(
              { error: "Failed to create Stripe Checkout session" },
              { status: 500 },
            );
          }

          return Response.json({ url: session.url }, { status: 200 });
        } catch (error) {
          console.error("Error creating Stripe checkout session:", error);
          const message =
            error instanceof Error ? error.message : "Failed to create session";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
