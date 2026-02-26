import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ProviderService } from "./provider.service";

const createProvider = async (req: Request, res: Response) => {

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
  const result = await ProviderService.createProvider(
    req.body,
    user?.id as string,
  );
  try {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Provider profile created!",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      message: "Provider Profile create failed",
      statusCode: 400,
      data: error,
    });
  }
};
const getProviderById = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  try {
    const result = await ProviderService.getProviderById(providerId as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Provider data found!",
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
const getAllProviders = async (req: Request, res: Response) => {
  try {
    const result = await ProviderService.getAllProviders();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Provider data found!",
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



export const ProviderController = {
  createProvider,
  getProviderById,
  getAllProviders
};
