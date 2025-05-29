// routes/postRoutes.js
import express from 'express';
import {
    crearPost,
    getAllPosts,
    filtrarPosts
} from '../controllers/postsController.js';
import { protegerRuta } from '../middlewares/authMiddlewares.js';
import { allowUpload, allowMultipleUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/api/posts', protegerRuta, allowMultipleUpload, crearPost);
router.get('/api/posts', getAllPosts);
router.get('/api/posts/search', filtrarPosts);


export default router;
