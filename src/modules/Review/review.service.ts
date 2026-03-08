import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../lib/prisma";
import { AsyncLocalStorage } from "node:async_hooks";

interface reviewData {
  userId: string;
  mealId: string;
  rating: number;
  comment: string;
}

const createReview = async (data: reviewData) => {
  // Validate rating
  const { rating, userId, comment, mealId } = data;
  if (rating < 1 || rating > 5) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  // Check if meal exists
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      mealId,
    },
  });

  if (existingReview) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You have already reviewed this meal",
    );
  }
  // Check if user has ordered this meal and it's delivered
  const hasOrdered = await prisma.order.findFirst({
    where: {
      userId,
      status: "DELIVERED",
      items: {
        some: {
          mealId,
        },
      },
    },
  });

  if (!hasOrdered) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You can only review meals you have ordered and received",
    );
  }

  const review = await prisma.review.create({
    data: {
      userId,
      mealId,
      rating,
      comment: comment || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

const getMealReviews = async (mealId: string) => {
  const reviews = await prisma.review.findMany({
    where: { mealId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const averageRatings =
    reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        reviews.length
      : 0;

  return {
    reviews,
    averageRatings,
    totalReviews: reviews.length,
  };
};

const getProviderReviews = async (providerId: string) => {
  const providerMeals = await prisma.meal.findMany({
    where: { providerId },
    select: { id: true },
  });

  const mealIds = providerMeals.map((meal) => meal.id);

  // get all reviews of the meal
  const reviews = await prisma.review.findMany({
    where: {
      mealId: {
        in: mealIds,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // calculate overall statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        totalReviews
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    reviews,
    totalReviews,
    averageRating,
    ratingDistribution,
  };
};

export const ReviewService = {
  createReview,
  getMealReviews,
  getProviderReviews
};
