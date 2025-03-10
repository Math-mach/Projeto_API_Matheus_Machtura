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
    await this.ensureAdminExists();
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

  async ensureAdminExists() {
    try {
      const adminEmail = "admin";
      const adminPassword = "admin123";

      // Verifica se o admin já existe no banco
      const existingAdmin = await this.db.get(adminEmail);
      if (existingAdmin) return;

      // Se não existir, cria um admin
      const id = await this.generateUniqueId();
      const hashedPassword = await bcrypt.hash(
        adminPassword,
        parseInt(SALT_ROUNDS)
      );

      await this.db.put(adminEmail, {
        id,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Administrador criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
    }
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      const role = "user";

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "O e-mail fornecido é inválido" });
      }

      const passwordMinLength = 8;
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

      if (password.length < passwordMinLength) {
        return res.status(400).json({
          error: `A senha deve ter no mínimo ${passwordMinLength} caracteres.`,
        });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "A senha deve conter pelo menos uma letra, um número e um caractere especial.",
        });
      }

      const existingUser = await this.db.get(email);

      if (existingUser) {
        return res.status(409).json({ error: "E-mail já cadastrado" });
      }

      const id = await this.generateUniqueId();
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await this.db.put(email, {
        id,
        email,
        password: hashedPassword,
        role,
      });

      const token = jwt.sign({ id: id, email: email, role: role }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
      });

      return res.status(201).json({
        message: "Usuário registrado com sucesso",
        userId: id,
        userRole: role,
      });
    } catch (error) {
      console.error("Erro no registro de usuarios:", error);
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

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
      });
      res.status(200).json({
        message: "Login bem-sucedido",
        userId: user.id,
        userRole: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
}

function addCookie(userId, userEmail, userRole = "user") {}

module.exports = UserModel;
