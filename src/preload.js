// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createDb: async (name) => {
    return await ipcRenderer.invoke("create-db", name);
  },
  getDb: async (name) => {
    return await ipcRenderer.invoke("get-db", name);
  },
  insertIntoDb: async (name, data) => {
    return await ipcRenderer.invoke("insert-into-db", { name, data });
  },
  findInDb: async (name, filter, data) => {
    return await ipcRenderer.invoke("update-in-db", { name, filter, data });
  },
  removeInDb: async (name, filter, data) => {
    return await ipcRenderer.invoke("remove-in-db", { name, filter, data });
  },
});
