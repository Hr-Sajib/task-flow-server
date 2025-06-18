import { Schema, model } from "mongoose";

export interface IPayment {
  stripeSessionId: string;
  projectId: string;
  amount: number;
  status: string;
  clientId: string;
  createdAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["paid", "pending", "failed"], default: "pending" },
    clientId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);