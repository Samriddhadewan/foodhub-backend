import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { MealController } from "./meal.controller";

const router = express.Router();

router.post("/", auth(UserRole.provider), MealController.createMealIntoDb);
router.get("/",  MealController.getAllMeals);
router.get("/:mealId",  MealController.getMealById);
router.get("/provider/meals",auth(UserRole.provider) ,MealController.getProviderMeals)
router.put("/:id", auth(UserRole.provider), MealController.updateMeals)
router.delete("/:id", auth(UserRole.provider), MealController.deleteMeal)

export const MealRoutes = router;
