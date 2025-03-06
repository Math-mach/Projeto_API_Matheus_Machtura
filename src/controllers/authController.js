const UserModel = require("../models/userModel");

const userModel = new UserModel();

userModel
  .open()
  .then(() => {
    console.log("Banco de dados de Usuarios aberto!");
  })
  .catch((err) => {
    console.error("Erro ao abrir banco de dados:", err);
  });

const register = async (req, res) => {
  try {
    await userModel.register(req, res);
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const login = async (req, res) => {
  try {
    await userModel.login(req, res);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

module.exports = { register, login };
