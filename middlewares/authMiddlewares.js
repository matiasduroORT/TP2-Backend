import jwt from 'jsonwebtoken'

export const protegerRuta = (req, res, next) => {

    

    const authHeader = req.headers.authorization

    console.log("AuthHeader: ", authHeader);
    

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({error: "Token no proporcionado"})
    }

    // let tokenImaginario = 'Bearer d238as78e7s7s'

    const token = authHeader.split(" ")[1]

    console.log("token: ", token);


    // 
    try {
        
        const decodificado = jwt.verify(token, process.env.JWT_SECRET)

        console.log("decodificado: ", decodificado);


        req.usuario = decodificado;
       
        next()

    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado'})
    }






}

export const protegerRutaAdmin = (req, res, next) => {

    

    const authHeader = req.headers.authorization

    console.log("AuthHeader: ", authHeader);
    

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({error: "Token no proporcionado"})
    }

    // let tokenImaginario = 'Bearer d238as78e7s7s'

    const token = authHeader.split(" ")[1]

    console.log("token: ", token);


    // 
    try {
        
        const decodificado = jwt.verify(token, process.env.JWT_SECRET)

        console.log("decodificado: ", decodificado);


        req.usuario = decodificado;

        if(req.usuario.rol !== 'admin'){
            return res.status(401).json({ error: 'No eres admin'})

        }
       
        next()

    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado'})
    }






}