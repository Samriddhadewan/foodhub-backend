import { prisma } from "../../lib/prisma";

const createProvider = async (payload: any, userId: string) => {
  console.log(payload);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.role !== "PROVIDER") {
    throw new Error("Only providers can create meals");
  }
  return await prisma.providerProfile.create({
    data: { ...payload, userId },
  });
};

const getProviderById = async (providerId: string) => {
  const result = await prisma.providerProfile.findUnique({
    where: {
      id: providerId,
    },
    include: {
      user: {
        include: {
          meals: true,
        },
      },
    },
  });

  return result;
};
const getAllProviders = async () => {
  const result = await prisma.providerProfile.findMany({
    include : {
      user : true 
    }
  });

  return result;
};

export const ProviderService = {
  createProvider,
  getProviderById,
  getAllProviders
};
