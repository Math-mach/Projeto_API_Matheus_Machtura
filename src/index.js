const { PORT } = require("./config/env");

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const activityRoutes = require("./routes/activityRoutes");
app.use("/activities", activityRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
