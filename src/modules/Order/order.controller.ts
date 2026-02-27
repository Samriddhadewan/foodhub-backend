import { Request, Response } from "express";
import { OrderService } from "./order.service";
import sendResponse from "../../utils/sendResponse";

const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = req?.user?.id as string;
    const orderData = req.body;
    const result = await OrderService.createOrder(orderData, customerId);

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

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req?.user?.id as string;
    const result = await OrderService.getMyOrders(customerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order data retrieve successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Order data retrieve failed",
      statusCode: 400,
      data: error,
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    const status = req.body.status as string;
    const userId = req.user?.id as string;
    const result = await OrderService.updateOrderStatus(
      orderId,
      status,
      userId,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Order status update failed",
      statusCode: 400,
      data: error,
    });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};
