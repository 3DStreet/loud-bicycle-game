const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require("./webpack.common.config");

module.exports = merge(common, {
  resolve: {
    fallback: {
      fs: false
    }
  },
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    https: true,
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: 'head',
    scriptLoading: 'blocking'
  })]
});