const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Database = require("../config/db");

const { JWT_SECRET: SECRET_KEY, SALT_ROUNDS } = require("../config/env");

class UserModel {
  constructor() {
    this.db = new Database("usuarios");
  }

  async open() {
    await this.db.open();
  }

  async generateUniqueId() {
    let id;
    let exists = true;

    while (exists) {
      id = Math.floor(1000 + Math.random() * 9000);
      const user = await this.db.get(id.toString());
      if (!user) exists = false;
    }

    return id;
  }

  async register(req, res) {
    try {
      const { email, name, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios" });
      }

      const existingUser = await this.db.get(email);

      if (existingUser) {
        return res.status(409).json({ error: "E-mail já cadastrado" });
      } else {
        console.log("Email não achado");
      }

      const id = await this.generateUniqueId();
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await this.db.put(email, {
        id,
        email,
        name,
        password: hashedPassword,
        role: "user",
      });

      console.log(`Usuário ${email} registrado com sucesso! ID: ${id}`);
      return res.status(201).json({
        message: "Usuário registrado com sucesso",
        user: { id, email, name },
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      return res.status(500).json({ error: `Erro interno no servidor` });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios" });
      }

      const user = await this.db.get(email);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        message: "Login bem-sucedido",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
}

module.exports = UserModel;
