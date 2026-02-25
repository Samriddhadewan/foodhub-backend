import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/Auth/auth.service";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export enum UserRole {
  admin = "ADMIN",
  customer = "CUSTOMER",
  provider = "PROVIDER",
}

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("Token not found");
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
      if (!userData) {
        throw new Error("Unauthorized!");
      }
      if (userData.status !== "ACTIVE") {
        throw new Error("Unauthorized!");
      }
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Unauthorized!");
      }

      req.user = decoded;

      next();
    } catch (error: any) {
      throw new Error(error);
    }
  };
};
