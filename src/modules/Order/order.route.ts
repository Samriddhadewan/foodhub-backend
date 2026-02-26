import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.customer), OrderController.createOrder);

export const OrderRoutes = router;
