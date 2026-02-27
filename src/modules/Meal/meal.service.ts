import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";

const createMealIntoDb = async (payload: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.role !== "PROVIDER") {
    throw new Error("Only providers can create meals");
  }

  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: userId },
  });

  if (!providerProfile) {
    throw new Error("provider profile not found!");
  }

  const result = await prisma.meal.create({
    data: { ...payload, providerId: providerProfile.id },
  });

  return result;
};
const getAllMeals = async () => {
  const result = await prisma.meal.findMany();
  return result;
};
const getMealById = async (mealId: string) => {
  const result = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
  });
  return result;
};
const getProviderMeals = async (userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found!");
  }

  const meals = await prisma.meal.findMany({
    where: {
      providerId: providerProfile.id,
    },
    include: {
      category: true,
      provider: true,
    },
  });

  return {
    data: meals,
  };
};
const updateMeal = async (
  mealId: string,
  userId: string,
  updatePayload: any,
) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId: providerProfile.id,
    },
  });

  if (!existingMeal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }

  const updateMeal = await prisma.meal.update({
    where: {
      id: mealId,
    },
    data: {
      ...updatePayload,
    },
  });

  return updateMeal;
};

const deleteMeal = async (mealId: string, userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });
  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId: providerProfile.id,
    },
  });

  if (!existingMeal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }
  // if has running orders, cannot delete
  const runningOrders = await prisma.order.findFirst({
    where: {
      status: {
        in: ["PENDING", "CONFIRMED", "COOKING", "OUT_FOR_DELIVERY"],
      },
      items: {
        some: {
          mealId,
        },
      },
    },
  });

  if (runningOrders) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot delete meal with running orders",
    );
  }
  const deletedMeal = await prisma.meal.delete({
    where: { id: mealId },
  });

  return deletedMeal;
};

export const MealService = {
  createMealIntoDb,
  getAllMeals,
  getMealById,
  getProviderMeals,
  updateMeal,
  deleteMeal,
};
