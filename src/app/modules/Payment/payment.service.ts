import Stripe from "stripe";
import config from "../../../config";
import { Payment } from "./payment.model";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

interface IPaymentPayload {
  projectId: string;
  amount: number;
  clientId: string;
}

const createCheckoutSession = async (
  payload: IPaymentPayload,
  origin: string
) => {
  const { projectId, amount, clientId } = payload;
  if (!projectId || !amount || !clientId) {
    throw new Error("projectId, amount, and clientId are required");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    metadata: { clientId, projectId, amount: amount.toString() },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: projectId },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return { url: session.url };
};

const confirmPaymentAndSave = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not successful");
  }

  const { clientId, projectId, amount } = session.metadata || {};
  if (!clientId || !projectId || !amount) {
    throw new Error("Missing metadata");
  }

  const saved = await Payment.create({
    stripeSessionId: sessionId,
    projectId,
    amount: Number(amount),
    status: "paid",
    clientId,
  });

  return saved;
};

// Get user payment data
const getPaymentsByclientId = async (clientId: string) => {
  const payments = await Payment.find({
    clientId,
  }).sort({ createdAt: -1 });

  return payments;
};

export const paymentService = {
  createCheckoutSession,
  confirmPaymentAndSave,
  getPaymentsByclientId,
};