import express from 'express';

import { protegerRuta } from '../middlewares/authMiddlewares.js';
import { allowUpload } from '../middlewares/uploadMiddleware.js';
import { login, refreshToken, logout } from '../controllers/authController.js';

const router = express.Router()

router.post('/api/login', login)
router.post('/api/refresh', refreshToken)
router.post('/api/logout', logout)


export default router
