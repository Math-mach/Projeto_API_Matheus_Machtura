const jwt = require("jsonwebtoken");
const { JWT_SECRET: SECRET_KEY } = require("../config/env");

/**
 * Middleware para verificar se o usuário está autenticado com um token JWT válido.
 */
function jtwMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Faça login." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
