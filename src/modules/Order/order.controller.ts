import { Request, Response } from "express";
import { OrderService } from "./order.service";
import sendResponse from "../../utils/sendResponse";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id as string;
  const orderData = req.body;
  const result = await OrderService.createOrder(orderData, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order created successfully",
    data: result,
  });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Order create failed",
      statusCode: 400,
      data: error,
    });
  }


};

export const OrderController = {
  createOrder,
};
