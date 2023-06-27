const loadClient = async (window) => {
  if (process?.env?.NODE_ENV === "development") {
    const { runClientServer } = require("../webpack.dev.config");
    await runClientServer();
    window.loadURL("http://localhost:5000");
  } else {
    window.loadFile(path.join(__dirname, "index.html"));
  }
};

module.exports = {
  loadClient,
};
