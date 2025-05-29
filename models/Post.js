import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagenes: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumno", required: true },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
