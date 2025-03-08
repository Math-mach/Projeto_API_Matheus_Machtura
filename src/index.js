const { PORT } = require("./config/env");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://127.0.0.1:5500",
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const activityRoutes = require("./routes/activityRoutes");
app.use("/activities", activityRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
