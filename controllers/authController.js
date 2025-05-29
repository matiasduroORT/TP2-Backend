import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import Alumno from "../models/Alumno.js";


const generarAccessToken = (alumno) => {
    
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

        return token
}

const generarRefreshToken = (alumno) => {
    const datosEncriptados = { id: alumno._id, email: alumno.email, rol: 'admin'}
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
    const refreshToken = jwt.sign(
        datosEncriptados,
        JWT_REFRESH_SECRET,
        { expiresIn: '7d'}
    )
    return refreshToken
}


export const login = async (req, res) =>{
    console.log("nuevo login");
    
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Faltan credenciales'})
    }

    try {
        console.log("nuevo login 2");

        const alumno = await Alumno.findOne({email});

        if(!alumno){
            return res.status(404).json({ error: 'Alumno no encontrado'})
        }

        const match = await bcrypt.compare(password, alumno.password)

        if(!match){
            return res.status(401).json({ error: 'Password incorrecta'})
        }

        const accessToken = generarAccessToken(alumno)
        const refreshToken = generarRefreshToken(alumno)


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        })
        

        res.json({ accessToken: accessToken})
        
    } catch (error) {
        res.status(500).json({error: 'Error al hacer login', errorMsg: error})
    }
}

export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    console.log("token: ", token);
    

    if(!token) return res.status(401).json({ error: 'No hay refresh token'})

    try {

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const nuevoAccessToken = jwt.sign(
            { id: decoded._id, email: decoded.email, rol: 'admin'},
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        );

        res.json({ accessToken: nuevoAccessToken})

        
    } catch (error) {
        return res.status(403).json({error: 'Refresh token invalido'})
    }
}


export const logout = (req, res) => {

}