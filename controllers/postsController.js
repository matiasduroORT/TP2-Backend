// controllers/postController.js
import Post from '../models/Post.js';
import supabase from '../config/supabase.js';
import Comentario from '../models/Comentario.js';

export const crearPost = async (req, res) => {
    console.log("llego");

    const { titulo, descripcion } = req.body;
    const { usuario } = req;
    const files = req.files;

    const file = req.file; 
    console.log("file?: ", file);
    console.log("files?: ", files);


    if (!titulo || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        


    let imagenesUrls = [];
    if (files && files.length > 0) {

        for (const file of files) {
            const fileName = `${Date.now()}_${file.originalname}`;
            const filePath = `usuarios/${usuario.id}/posts/${fileName}`;

            console.log("fileName: ", fileName);
            console.log("filePath", filePath);
            
            console.log("fileName: ", file.buffer);
            console.log("filePath", file.mimetype);
            console.log("Por subir imagen");
            
            const { data, error } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

                console.log("Termino subir imagen");


            if (error) return res.status(500).json({ error: 'Error al subir imagen', errorMsg: error});

            const { data: PublicDataUrl } =  supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(filePath);

            imagenesUrls.push(PublicDataUrl.publicUrl);
        }

    }

    console.log("imagenes: ", imagenesUrls);
    

    const nuevoPost = await Post.create({
        titulo,
        descripcion,
        imagenes: imagenesUrls,
        userId: usuario.id
    });

    res.status(201).json(nuevoPost);

    } catch (error) {
            res.status(500).json({error: 'Fallo algo', errorMsg: error})
    }

 
};

export const getAllPosts = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
};

export const filtrarPosts = async (req, res) => {

    const { keyword, userId, desde, hasta } = req.query

    const query = {}


    if (desde || hasta) {
        query.createdAt = {}
        if (desde) query.createdAt.$gte = new Date(desde)
        if (hasta) query.createdAt.$lte = new Date(hasta)
    }

    if (userId) {
        query.userId = userId
    }

    if (keyword) {
        query.$or = [
            { titulo: { $regex: keyword, $options: 'i' } },
            { descripcion: { $regex: keyword, $options: 'i' } },
        ]
    }

    try {

        const posts = await Post.find(query)
            .populate("userId", "nombre email")
            .sort({ createdAt: -1 })
            .lean();



        for (let post of posts) {

            const comentarios = await Comentario.find({ post: post._id })
                .populate("userId", 'nombre email')
                .sort({ createdAt: -1 });

            // console.log("comentarios: ", comentarios);


            post.comentarios = comentarios
        }

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            error: 'Error al filtrar los posts',
            errorMsg: error
        })
    }
};
