// const express = require('express')
import express from 'express';
import dotenv from 'dotenv'
// const alumnosRouter = require('./routes/alumnosRoutes')
import alumnosRouter from './routes/alumnosRoutes.js'
import postsRouter from './routes/postsRoutes.js'
import comentariosRouter from './routes/comentariosRoutes.js'
import authRouter from './routes/authRoutes.js'
import conectarDB from './config/db.js';
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 4000;

conectarDB()

console.log("EL PUERTO ES: ", PORT);


app.use(express.json()) // Para que pueda leer JSON
app.use(cookieParser()) // Necesario para leer cookies

app.use("/", authRouter) 

app.use("/", alumnosRouter) // Manejar middlewares, nos permite conectar nuestro server

app.use("/", postsRouter) // Manejar middlewares, nos permite conectar nuestro server

app.use("/", comentariosRouter)



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})