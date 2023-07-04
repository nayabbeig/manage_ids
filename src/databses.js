const Datastore = require("nedb");
const AppConfig = require("./app.config");

const loadDb = () => {
  const mainDB = new Datastore(AppConfig.mainDbPath);
  mainDB.loadDatabase();
  return mainDB;
};

const getDbPath = (name) =>
  AppConfig.dbDirectory + name + AppConfig.dbExtension;

const createDb = (name) =>
  new Promise((resolve, reject) => {
    if (!name) return reject(new Error("Invalid name"));
    const mainDB = loadDb();
    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (!docs.length) {
        const path = getDbPath(name);
        const db = new Datastore(path);
        db.loadDatabase();
        mainDB?.insert({ name, path }, function (err, data) {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }

          resolve({ result: "success" });
        });
      } else {
        reject(new Error("Db with same name already exists"));
      }
    });
  });

const getDb = async (name) => {
  return new Promise((resolve, reject) => {
    if (!name) return reject(new Error("Invalid name"));
    const mainDB = loadDb();
    console.log("mainDB", mainDB);
    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const doc = docs?.find((doc) => doc?.name === name);

      if (doc?.path) {
        console.log("inside doc if");
        db = new Datastore(doc.path);
        db.loadDatabase();
        console.log("finding....");
        db.find({}, (err, data) => {
          console.log("data", data);
          return err ? reject(err) : resolve(data);
        });
      } else {
        reject(new Error("Db not found"));
      }
    });
  });
};

const insertIntoDb = ({ name, data }) =>
  new Promise((resolve, reject) => {
    if (!name || !data) return reject(new Error("Invalid name and/or data"));
    const mainDB = loadDb();
    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (docs?.length) {
        const doc = docs.find((doc) => doc?.name === name);
        if (doc?.path) {
          db = new Datastore(doc.path);
          db.loadDatabase();
          db.insert(data, function (err, data) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            console.log("data", data);
            resolve(data);
          });
        }
      } else {
        reject(new Error("Record not found"));
      }
    });
  });

const findInDb = ({ name, filter }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return reject(new Error("Invalid name or filter"));
    }

    const mainDB = loadDb();

    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (docs?.length) {
        const doc = docs.find((doc) => doc?.name === name);
        if (doc?.path) {
          db = new Datastore(doc.path);
          db.loadDatabase();
          db.find(filter, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        } else {
          reject(new Error("Record not found"));
        }
      } else {
        reject(new Error("Db not found"));
      }
    });
  });

const updateInDb = ({ name, filter, data }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return reject(new Error("Invalid name or filter"));
    }

    const mainDB = loadDb();

    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (docs?.length) {
        const doc = docs.find((doc) => doc?.name === name);
        console.log("doc", doc);
        if (doc?.path) {
          db = new Datastore(doc.path);
          db.loadDatabase();
          db.update(
            filter,
            { $set: data || {} },
            { returnUpdatedDocs: true },
            function (err, numAffected, affectedDocuments) {
              if (err) {
                reject(err);
                return;
              }
              resolve(
                affectedDocuments?.length
                  ? affectedDocuments
                  : "No records were updated"
              );
            }
          );
        } else {
          reject(new Error("Record not found"));
        }
      }
    });
  });

const removeInDb = ({ name, filter }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return reject(new Error("Invalid name or filter"));
    }

    const mainDB = loadDb();

    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (docs?.length) {
        const doc = docs.find((doc) => doc?.name === name);
        if (doc?.path) {
          db = new Datastore(doc.path);
          db.loadDatabase();
          db.remove(filter, {}, function (err, numAffected) {
            if (err) {
              reject(err);
              return;
            }
            resolve(numAffected);
          });
        }
      } else {
        reject(new Error("Record not found"));
      }
    });
  });

module.exports = {
  loadDb,
  createDb,
  getDb,
  getDbPath,
  insertIntoDb,
  findInDb,
  updateInDb,
  removeInDb,
};
