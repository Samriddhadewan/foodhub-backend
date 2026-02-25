import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const secret = "iufyhfshfihsfihs";

const createUserIntoDb = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashPassword },
  });
  const { password, ...newResult } = result;
  return newResult;
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new Error("User not found!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials!");
  }

  const userData = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const token = jwt.sign(userData, secret, { expiresIn: "1d" });

  return {
    token,
    user,
  };
};

export const AuthService = {
  createUserIntoDb,
  loginUser,
};
