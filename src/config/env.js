require("dotenv").config();

PORT = process.env.PORT || 3000;
JWT_SECRET = process.env.JWT_SECRET || "supersecreto";
SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
DBSTORAGE = process.env.DBSTORAGE || "./database";

module.exports = {
  PORT,
  JWT_SECRET,
  SALT_ROUNDS,
  DBSTORAGE,
};
