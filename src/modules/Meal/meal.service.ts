import { prisma } from "../../lib/prisma";

const createMealIntoDb = async (payload: any, userId: string) => {
  console.log(payload)
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

  console.log(result);

  return result;
};

export const MealService = {
  createMealIntoDb,
};
