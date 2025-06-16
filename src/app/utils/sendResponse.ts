import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
  PaymentGatewayPageURL?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>, PaymentGatewayPageURL?: string) => {
  const responsePayload: any = {
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  };

  if (PaymentGatewayPageURL) {
    responsePayload.PaymentGatewayPageURL = PaymentGatewayPageURL;
  }

  res.status(data.statusCode).json(responsePayload);
};

export default sendResponse;
