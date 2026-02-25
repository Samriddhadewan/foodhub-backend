import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { MealController } from "./meal.controller";

const router = express.Router();

router.post("/", auth(UserRole.provider), MealController.createMealIntoDb);
router.get("/",  MealController.getAllMeals);
router.get("/:mealId",  MealController.getMealById);

export const MealRoutes = router;
