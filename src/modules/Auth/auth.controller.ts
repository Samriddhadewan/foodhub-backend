import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDb(req.body);
    res.status(201).json({
        success: true,
        message : "User created",
        data: result
    })
  } catch (error) {
     res.status(400).json({
      error: "User Create failed",
      details: error,
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(201).json({
        success: true,
        message : "User created",
        data: result
    })
  } catch (error) {
     res.status(400).json({
      error: "User login failed",
      details: error,
    });
  }
};
export const AuthController = {
  createUser,
  loginUser
};
