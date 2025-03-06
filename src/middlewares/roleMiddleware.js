/**
 * Middleware para verificar se o usuário tem permissão de administrador.
 */
function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acesso restrito a administradores." });
  }
  next();
}

module.exports = adminMiddleware;
