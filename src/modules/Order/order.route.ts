import express from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(UserRole.customer), OrderController.createOrder);
router.get("/", auth(UserRole.customer), OrderController.getMyOrders);
router.patch("/status/:id", auth(UserRole.provider), OrderController.updateOrderStatus);
router.get("/all/orders", auth(UserRole.admin), OrderController.getAllOrders);
router.get("/provider/orders", auth(UserRole.provider), OrderController.getProviderOrders);



export const OrderRoutes = router;
