import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDb(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User created!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "User created failed",
      statusCode: 400,
      data: error,
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Logged in!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "User Logged in failed",
      statusCode: 400,
      data: error,
    });
  }
};



export const AuthController = {
  createUser,
  loginUser,
};