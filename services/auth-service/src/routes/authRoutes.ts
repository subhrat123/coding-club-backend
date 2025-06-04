// src/routes/authRoutes.ts
import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfileById,
  updateProfileById,
} from '../controllers/authController';

import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile/:id', getProfileById);

router.put('/profile/:id', updateProfileById);

export default router;
