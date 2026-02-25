import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";

const addCategoryToDb = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      sendResponse(res, {
        success: false,
        message: "User not authenticated",
        statusCode: 401,
        data: null,
      });
      return;
    }
    const result = await CategoryService.addCategoryToDb(req.body);
    sendResponse(res, {
      message: "Category created successfull",
      success: true,
      statusCode: 200,
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      message: "Failed to create Category",
      success: false,
      statusCode: 400,
      data: error,
    });
  }
};

export const CategoryController = {
  addCategoryToDb,
};
