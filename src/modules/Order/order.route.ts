import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.customer), OrderController.createOrder);
router.get("/", auth(UserRole.customer), OrderController.getMyOrders);
router.patch("/status/:id", auth(UserRole.provider), OrderController.updateOrderStatus);

export const OrderRoutes = router;
