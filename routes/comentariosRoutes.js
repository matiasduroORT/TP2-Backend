// routes/postRoutes.js
import express from 'express';

import { protegerRuta } from '../middlewares/authMiddlewares.js';
import { allowUpload } from '../middlewares/uploadMiddleware.js';
import { crearComentario, listarComentarios } from '../controllers/comentariosController.js';

const router = express.Router();

// Crear comentario
router.post('/api/post/:id/comentarios', protegerRuta, crearComentario)

// Obtener comentarios
router.get('/api/post/:id/comentarios', listarComentarios)

export default router;
