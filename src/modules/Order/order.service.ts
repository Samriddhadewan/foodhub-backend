import { StatusCodes } from "http-status-codes";
import { OrderStatus } from "../../../generated/prisma/enums";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "./order.interface";

const createOrder = async (payload: CreateOrderPayload, customerId: string) => {
  // Check if provider is active
  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: payload.providerId,
    },
    include: {
      user: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!provider) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Provider not found or inactive");
  }

  if (provider.user.status === "SUSPENDED") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "This provider is currently inactive. Orders cannot be placed.",
    );
  }

  const mealsId = payload.items.map((item) => item.mealId);

  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealsId },
    },
  });
  if (meals.length !== payload.items.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid meal detected");
  }

  let totalPrice = 0;
  const orderItems = payload.items.map((item) => {
    const meal = meals.find((m) => m.id === item.mealId)!;
    totalPrice += meal.price * item.quantity;

    return {
      mealId: meal.id,
      quantity: item.quantity,
      price: meal.price,
    };
  });
  const orderNumber = `ORD-${Date.now()}`;
  const order = await prisma.order.create({
    data: {
      orderNumber: orderNumber,
      userId: customerId,
      providerId: payload.providerId,
      address: payload.address,
      totalAmount: totalPrice,
      status: OrderStatus.PENDING,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: { meal: true },
      },
    },
  });

  return order;
};

const getMyOrders = async (customerId: string) => {
  const result = await prisma.order.findMany({
    where: {
      userId: customerId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateOrderStatus = async (
  orderId: string,
  status: string,
  userId: string,
) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: userId },
  });

  console.log(providerProfile?.id);
  if (!providerProfile) {
    throw new Error("Provider profile not found");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerId: providerProfile.id,
    },
  });

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, "order not found");
  }

  const updateOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status as OrderStatus,
    },
    include: {
      items: {
        include: {
          meal: {
            select: { id: true, name: true, price: true },
          },
        },
      },
    },
  });
  return updateOrder;
};

const getAllOrders = async () => {
  console.log("route hit");
  const result = await prisma.order.findMany({
    include: {
      items: {
        include: {
          meal: {
            select: { id: true, name: true, price: true },
          },
        },
      },
      provider: {
        select: {
          id: true,
          restaurantName: true,
          address: true,
        },
      },
    },
  });

  return result;
};

const getProviderOrders = async (userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });
  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const orders = await prisma.order.findMany({
    where: {
      providerId: providerProfile.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

export const OrderService = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  getProviderOrders,
};
