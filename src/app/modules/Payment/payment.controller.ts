import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import config from "../../../config";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {

    const origin: string =
      "http://localhost:3000";

    const result = await paymentService.createCheckoutSession(req.body, origin);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Stripe checkout session created successfully",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req?.query?.sessionId as string;

  if (!sessionId) throw new Error("Session ID is required");

  const result = await paymentService.confirmPaymentAndSave(sessionId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment confirmed and saved successfully",
    data: result,
  });
});

// // Get payment data of a user
// const getPaymentsByUserId = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.params.userId;

//   if (!userId) {
//     throw new Error("User ID is required");
//   }

//   const payments = await paymentService.getPaymentsByUserId();

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Payments fetched successfully",
//     data: payments,
//   });
// });

export const paymentController = {
  createCheckoutSession,
  confirmPayment,
  // getPaymentsByUserId,
};