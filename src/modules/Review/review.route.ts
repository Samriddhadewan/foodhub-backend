import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.customer), ReviewController.createReview);
router.get("/meal/:mealId", ReviewController.getMealReviews);

// get provider's review for their meals
router.get("/provider", auth(UserRole.provider), ReviewController.getProviderReviews)

export const ReviewRoutes = router;
