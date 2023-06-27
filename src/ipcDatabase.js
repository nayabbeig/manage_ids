const {
  createDb,
  getDb,
  insertIntoDb,
  findInDb,
  updateInDb,
  removeInDb,
} = require("./databses");

module.exports = {
  setDatabaseEvents: (ipcMain) => {
    ipcMain.handle("create-db", async (event, name) => {
      return await createDb(name);
    });

    ipcMain.handle("get-db", async (event, name) => {
      console.log("calling get db", name);
      return await getDb(name);
    });

    ipcMain.handle("insert-into-db", async (event, { name, data }) => {
      console.log("name", name, "data", data);
      return await insertIntoDb({ name, data });
    });

    ipcMain.handle("find-in-db", async (event, { name, filter }) => {
      console.log("inside ipcDB", "name", name, "filter", filter);
      return await findInDb({ name, filter });
    });

    ipcMain.handle("update-in-db", async (event, { name, filter, data }) => {
      console.log("inside ipcDB", "name", name, "filter", filter, data);
      return await updateInDb({ name, filter, data });
    });

    ipcMain.handle("remove-in-db", async (event, { name, filter }) => {
      console.log("inside ipcDB", "name", name, "filter", filter);
      return await removeInDb({ name, filter });
    });
  },
};
