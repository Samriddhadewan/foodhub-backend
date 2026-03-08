import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const updateUserStatus = async (userId : string, newStatus : UserStatus) => {
  const result = await prisma.user.update({
    where : {id : userId},
    data : {status : newStatus}
    
  })
  return result;
}

export const UserService = {
  getAllUsers,
  updateUserStatus
};
