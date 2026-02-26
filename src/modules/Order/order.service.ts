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


export const OrderService = {
  createOrder,
};
