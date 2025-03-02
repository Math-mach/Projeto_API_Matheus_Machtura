const { DBSTORAGE } = require("./env");
const rocksdb = require("rocksdb");

class Database {
  constructor(dbName) {
    this.db = rocksdb(`${DBSTORAGE}/${dbName}`);
  }

  // Abre o banco de dados
  open() {
    return new Promise((resolve, reject) => {
      this.db.open((err) =>
        err ? reject(err) : resolve("Banco de dados aberto!")
      );
    });
  }

  // Exemplo de função para pegar todos os itens (caso queira listar tudo)
  getAll() {
    return new Promise((resolve, reject) => {
      const allItems = [];
      this.db.iterator({ gte: "", lte: "" }).each(
        (err, key, value) => {
          if (err) reject(err);
          allItems.push({ key, value: JSON.parse(value) });
        },
        () => resolve(allItems)
      );
    });
  }
}

module.exports = Database;
