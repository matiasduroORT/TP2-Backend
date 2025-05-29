import mongoose from "mongoose";

const comentarioSchema = mongoose.Schema({
    contenido: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumno", required: true },
}, { timestamps: true });

export default mongoose.model("Comentario", comentarioSchema);
