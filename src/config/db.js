const { DBSTORAGE } = require("./env");
const rocksdb = require("rocksdb");

class Database {
  constructor(dbName) {
    this.db = rocksdb(`${DBSTORAGE}/${dbName}`);
  }

  open() {
    return new Promise((resolve, reject) => {
      this.db.open((err) =>
        err ? reject(err) : resolve(`Banco de dados aberto!`)
      );
    });
  }

  put(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, JSON.stringify(value), (err) =>
        err ? reject(err) : resolve(`Salvo com sucesso: ${key}`)
      );
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (err, value) => {
        if (err) {
          resolve(null);
        } else {
          resolve(JSON.parse(value));
        }
      });
    });
  }
}

module.exports = Database;
