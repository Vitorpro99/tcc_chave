// Ficheiro: middleware/authJwt.js

const jwt = require("jsonwebtoken");
const secretKey = "chavesegredodetoken"; 

verifyToken = (req, res, next) => {
    
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            message: "Nenhum token foi fornecido!"
        });
    }

    
    if (token.startsWith('Bearer ')) {
    
        token = token.slice(7, token.length);
    } else {
        return res.status(401).send({
            message: "Formato de token inválido. Esperado 'Bearer [token]'."
        });
    }

    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Não autorizado! O token é inválido ou expirou."
            });
        }
        
        
        req.userId = decoded.id;
        
        
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken

};

module.exports = authJwt;