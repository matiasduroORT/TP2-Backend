// controllers/postController.js
import Post from '../models/Post.js';
import supabase from '../config/supabase.js';

export const crearPost = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const { usuario } = req;
    const file = req.file;

    if (!titulo || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    let imagenUrl = '';
    if (file) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `usuarios/${usuario.id}/posts/${fileName}`;

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) return res.status(500).json({ error: 'Error al subir imagen' });

        const { data:PublicDataUrl } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(filePath);

        imagenUrl = PublicDataUrl.publicUrl;
        
    }

    const nuevoPost = await Post.create({
        titulo,
        descripcion,
        imagen: imagenUrl,
        userId: usuario.id
    });

    res.status(201).json(nuevoPost);
};

export const getAllPosts = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
};

