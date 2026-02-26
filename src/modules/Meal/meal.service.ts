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

  const result = await prisma.meal.create({
    data: { ...payload, providerId: userId },
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

export const MealService = {
  createMealIntoDb,
  getAllMeals,
  getMealById
};
