import express, { Application, Request, Response } from "express";
import cors from "cors";
import { MealRoutes } from "./modules/Meal/meal.route";
import { CategoryRoutes } from "./modules/Category/category.route";
import { AuthRoutes } from "./modules/Auth/auth.route";
import { ProviderRoutes } from "./modules/Provider/provider.route";
import { OrderRoutes } from "./modules/Order/order.route";
import { UserRoutes } from "./modules/User/user.route";
import { ReviewRoutes } from "./modules/Review/review.route";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/auth", AuthRoutes);
app.use("/api/meals", MealRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/provider", ProviderRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/review", ReviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});

export default app;
