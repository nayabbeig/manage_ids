const { webpack } = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const baseConfig = require("./webpack.config");
// import baseConfig from "./webpack.config.js";

baseConfig.mode = "development";
baseConfig.devServer = {
  static: "./build",
  port: 5000,
  historyApiFallback: true,
};

const compiler = webpack(baseConfig);
const server = new WebpackDevServer(compiler, {
  port: 5000,
  historyApiFallback: true,
  // contentBase: "/public/",
  // publicPath: "/",
  // stats: { colors: true },
});

if (process?.env?.NODE_ENV === "development") {
  baseConfig.runClientServer = async () => {
    console.log("Starting server...");
    await server.start();
  };
}

module.exports = baseConfig;
