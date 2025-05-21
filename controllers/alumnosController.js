import Alumno from "../models/Alumno.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import supabase from "../config/supabase.js";


export const home = (req, res) => {
    res.send(`<h1>Home de la API</h1>`)
}

export const getAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find()
        res.json(alumnos)
    } catch (error) {
        res.status(500).json({error: "Error al obtener alumnos"})
    }
}

export const getAlumnosSearch = async (req, res) => {

    const {nombre} = req.query;

    try {

        const alumnos = await Alumno.find({
            nombre: { $regex: `^${nombre}`, $options: 'i'}
        })
        res.json(alumnos)
    } catch (error) {
        res.status(500).json({error: "Error al obtener alumnos"})
    }
}

export const getAlumnosById = async (req, res) => {

    try {
        const alumno = await Alumno.findById(req.params.id)
        if(alumno){
            res.json(alumno)
        }else{
            res.status(404).json({ error: 'Alumno no encontrado'})
        }
    } catch (error) {
        res.status(500).json({ error: "ID Invalido"})
    }

}

export const CrearAlumno = async (req, res) => {  

    console.log("Req crear Alumno: ", 
        { reqUsuario: req.usuario,
          reqBody: req.body
        });
    


    const { nombre, edad, email, password } = req.body;
    if(!nombre || !edad || !email || !password){
        return res.status(400).json({error: "Faltan datos"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const alumno = {
        nombre,
        edad,
        email,
        password: hashedPassword
    }

    try {
        const nuevoAlumno = await Alumno.create(alumno)
        res.status(201).json(nuevoAlumno)
    } catch (error) {
        res.status(500).json({error: "Error al crear Alumno"})
    }
    
}


export const login = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Faltan credenciales'})
    }

    try {

        const alumno = await Alumno.findOne({email});

        if(!alumno){
            return res.status(404).json({ error: 'Alumno no encontrado'})
        }

        const match = await bcrypt.compare(password, alumno.password)

        if(!match){
            return res.status(401).json({ error: 'Password incorrecta'})
        }


        // JWT.SIGN
        // Primer argumento, lo que vas a encriptar
        // Segundo argumento, la llave para encriptar / desencriptar
        // Tercer argumento, el tiempo que va a durar ese token
        const datosEncriptados = { id: alumno._id, email: alumno.email, rol: 'admin'}
        const JWT_KEY = process.env.JWT_SECRET
        const token = jwt.sign(
            datosEncriptados,
            JWT_KEY,
            { expiresIn: '1h'}
        )

        res.json({ accessToken: token})
        
    } catch (error) {
        res.status(500).json({error: 'Error al hacer login'})
    }
}

export const actualizarProfilePic = async (req, res) => {
    const { usuario } = req;
    const file = req.file;
    
    if(!file){
        return res.status(400).json({ error: 'No se proporciono ninguna imagen'})
    }

    // console.log("File: ", file);
    

    const fileName = `${Date.now()}_${file.originalname}`
    const filePath = `usuarios/${usuario.id}/profilePic/${fileName}`

    try {
        const { data, error } = await supabase.storage
                                .from(process.env.SUPABASE_BUCKET)
                                .upload(filePath, file.buffer, {
                                    contentType: file.mimetype,
                                    upsert: true
                                })

        if(error){
            return res.status(500).json({
                error: 'Error al subir la imagen a Supabase',
                errorMensaje: error
            })
        }

        const {data: publicUrlData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(filePath) 
        
        const profilePicUrl = publicUrlData.publicUrl;

        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            usuario.id,
            {profile_pic: profilePicUrl},
            {new: true}
        );

        res.json({
            msg: 'Imagen actualizada correctamente',
            alumno: alumnoActualizado
        })
        

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al actualizar la imagen'})
    }
}