import { Request, response, Response } from "express";
import { MealService } from "./meal.service";
import sendResponse from "../../utils/sendResponse";

const createMealIntoDb = async (req: Request, res: Response) => {
  try {
    // if user is not found 
    const user =  req.user;
    if (!user) {
      sendResponse(res, {
        success: false,
        message: "User not authenticated",
        statusCode: 401,
        data: null,
      });
      return;
    }
    const result = await MealService.createMealIntoDb(req.body, user?.id as string)
    
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Meal Created Successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Something went wrong",
      statusCode: 400,
      data: error,
    });
  }
};
const getAllMeals = async (req: Request, res: Response) => {
  try {
    const result = await MealService.getAllMeals()
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Meal Retrived Successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Something went wrong",
      statusCode: 400,
      data: error,
    });
  }
};
const getMealById = async(req: Request, res: Response)=> {
try {
      const { mealId } = req.params;
    const result = await MealService.getMealById(mealId as string)
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Meal Retrived Successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Something went wrong",
      statusCode: 400,
      data: error,
    });
  }
}


export const MealController = {
  createMealIntoDb,
  getAllMeals,
  getMealById
};
