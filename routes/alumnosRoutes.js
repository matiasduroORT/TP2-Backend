import express from 'express';
import {
    home,
    getAlumnos,
    getAlumnosById,
    getAlumnosSearch,
    CrearAlumno,
    actualizarProfilePic,
} from '../controllers/alumnosController.js'
import { protegerRuta } from '../middlewares/authMiddlewares.js';
import { allowUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router()


router.get('/', home)
router.get('/api/alumnos', getAlumnos)
router.get('/api/alumnos/:id', getAlumnosById)
router.get('/api/search/alumnos', getAlumnosSearch)


router.post('/api/alumnos', protegerRuta , CrearAlumno)
router.put('/api/alumnos/', protegerRuta, allowUpload, actualizarProfilePic)


export default router