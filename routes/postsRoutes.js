// routes/postRoutes.js
import express from 'express';
import {
    crearPost,
    getAllPosts,
} from '../controllers/postsController.js';
import { protegerRuta } from '../middlewares/authMiddlewares.js';
import { allowUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/api/posts', protegerRuta, allowUpload.single('imagen'), crearPost);
router.get('/api/posts', getAllPosts);


export default router;
