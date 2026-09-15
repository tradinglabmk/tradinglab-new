import Stripe from "stripe";

const globalForStripe = global as unknown as { _stripeClient?: Stripe };

export function getStripe(): Stripe {
  if (globalForStripe._stripeClient) return globalForStripe._stripeClient;

  const secretKey = process.env["STRIPE_SECRET_KEY"];
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  const client = new Stripe(secretKey, {
    apiVersion: "2026-08-26.dahlia",
    typescript: true,
  });

  if (process.env["NODE_ENV"] !== "production") {
    globalForStripe._stripeClient = client;
  }
  return client;
}
