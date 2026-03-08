import express from 'express';
import { auth, UserRole } from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get("/", auth(UserRole.admin), UserController.getAllUsers)
router.patch("/:id", auth(UserRole.admin), UserController.updateUserStatus)

export const UserRoutes = router;
