import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All Users Retrieve Successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "All Users Retrieve failed",
      statusCode: 400,
      data: error,
    });
  }
};
const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const newStatus = req.body.status;
    const result = await UserService.updateUserStatus(userId, newStatus);
     sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User status changed Successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "User status update failed",
      statusCode: 400,
      data: error,
    });
  }
};

export const UserController = {
  getAllUsers,
  updateUserStatus,
};
