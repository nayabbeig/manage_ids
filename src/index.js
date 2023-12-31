const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { loadClient } = require("./client");
const { loadDb } = require("./databses");
const { setDatabaseEvents } = require("./ipcDatabase");

const express = require("express");
const cors = require("cors");
const backendApp = express();
const port = 1337;

backendApp.use(cors());
backendApp.get("/", (req, res) => {
  res.send("Hello World!");
});

backendApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loadClient(mainWindow);
  loadDb();
  setDatabaseEvents(ipcMain);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
