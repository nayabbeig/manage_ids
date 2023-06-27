const Datastore = require("nedb");
const AppConfig = require("./app.config");

let mainDB = null;

const loadDb = () => {
  mainDB = new Datastore(AppConfig.mainDbPath);
  mainDB.loadDatabase();
};

const getDbPath = (name) =>
  AppConfig.dbDirectory + name + AppConfig.dbExtension;

const createDb = (name) =>
  new Promise((resolve, reject) => {
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
      }
    });
  });

const getDb = async (name) => {
  console.log("insdie getDb", name);
  return new Promise((resolve, reject) => {
    mainDB.find({ name }, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const doc = docs?.find((doc) => doc?.name === name);
      if (doc?.path) {
        db = new Datastore(doc.path);
        db.loadDatabase();
        console.log("finding....");
        db.find({}, (err, data) => {
          console.log("data", data);
          return err ? reject(err) : resolve(data);
        });
      }
    });
  });
};

const insertIntoDb = ({ name, data }) =>
  new Promise((resolve, reject) => {
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
      }
    });
  });

const findInDb = ({ name, filter }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return new Error("Invalid name or filter");
    }

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
        }
      }
    });
  });

const updateInDb = ({ name, filter, data }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return new Error("Invalid name or filter");
    }

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
          db.update(
            filter,
            { $set: data },
            { returnUpdatedDocs: true },
            function (err, numAffected, affectedDocuments) {
              if (err) {
                reject(err);
                return;
              }
              resolve(affectedDocuments);
            }
          );
        }
      }
    });
  });

const removeInDb = ({ name, filter }) =>
  new Promise((resolve, reject) => {
    if (!name || !filter || typeof filter !== "object") {
      return new Error("Invalid name or filter");
    }

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
