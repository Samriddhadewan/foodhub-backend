import express from 'express';
import { CategoryController } from './category.controller';
import { auth, UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/",auth(UserRole.admin), CategoryController.addCategoryToDb)

export const CategoryRoutes = router;
