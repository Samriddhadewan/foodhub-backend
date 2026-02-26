import express from 'express';
import { auth, UserRole } from '../../middlewares/auth';
import { ProviderController } from './provider.controller';

const router = express.Router();

router.post("/", auth(UserRole.provider), ProviderController.createProvider)
router.get("/:providerId", ProviderController.getProviderById)
router.get("/", ProviderController.getAllProviders)

export const ProviderRoutes = router;
 