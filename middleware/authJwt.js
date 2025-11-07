// Ficheiro: middleware/authJwt.js

const jwt = require("jsonwebtoken");
// Certifique-se de que a sua secretKey é a mesma do controller
const secretKey = "chavesegredodetoken"; 

verifyToken = (req, res, next) => {
    // 1. Lê o token do cabeçalho de autorização
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            message: "Nenhum token foi fornecido!"
        });
    }

    // 2. Verifica se o token está no formato "Bearer [token]"
    if (token.startsWith('Bearer ')) {
        // Remove o "Bearer " para ficar só com o token
        token = token.slice(7, token.length);
    } else {
        return res.status(401).send({
            message: "Formato de token inválido. Esperado 'Bearer [token]'."
        });
    }

    // 3. Usa o jwt.verify() para validar o token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Não autorizado! O token é inválido ou expirou."
            });
        }
        
        // 4. Se tudo estiver OK, guarda o ID do usuário no 'req'
        // para que o controller possa usá-lo se precisar
        req.userId = decoded.id;
        
        // 5. Chama 'next()' para permitir que o pedido continue
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
    // (Aqui poderíamos adicionar 'isAdmin', 'isGestor', etc. no futuro)
};

module.exports = authJwt;