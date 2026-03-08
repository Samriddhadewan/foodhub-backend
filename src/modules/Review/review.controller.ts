import { Response, Request } from "express";

import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";

const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { mealId, rating, comment } = req.body;

    if (!userId) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }
    const result = await ReviewService.createReview({
      userId,
      mealId,
      rating,
      comment,
    });
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Review created successfully",
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

const getMealReviews = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const result = await ReviewService.getMealReviews(mealId as string);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Review retrieved successfully",
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

const getProviderReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    if (!userId) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    // get provider profile

    const provider = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      return sendResponse(res, {
        statusCode: StatusCodes.FORBIDDEN,
        success: false,
        message: "Provider profile not found",
        data: null,
      });
    }

    const result = await ReviewService.getProviderReviews(provider.id);
    sendResponse(res, {
      success: true,
      message: "Provider Reviews found",
      statusCode: 200,
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

export const ReviewController = {
  createReview,
  getMealReviews,
  getProviderReviews,
};
