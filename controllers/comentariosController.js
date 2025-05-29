import Comentario from "../models/Comentario.js";
import Post from "../models/Post.js";

export const crearComentario = async (req, res) => {

    console.log("Iniciando");
    const { contenido } = req.body;
    const { id: PostId } = req.params
    const { usuario } = req;

    

    if (!contenido) return res.status(400).json({ error: 'Falta contenido' })

    try {

        const post = await Post.findById(PostId);

        if (!post) return res.status(404).json({ error: "Post no encontrado" })

        const comentario = await Comentario.create({
            contenido,
            post: PostId,
            userId: usuario.id
        })

        res.status(201).json(comentario)

    } catch (error) {
        res.status(500).json({ error: "No se pudo crear el post", errorMsg: error })
    }

}

export const listarComentarios = async (req, res) => {

    const { id: postId} = req.params

    const comentarios = await Comentario.find({ post: postId})
        .populate('userId', 'nombre email')
        .sort({ createdAt: -1})


    res.json(comentarios)
}