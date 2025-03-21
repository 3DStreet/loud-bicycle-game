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
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    https: true,
    static: path.resolve(__dirname, 'src'),
    open: true,
    hot: true
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.php",
    filename: "index.php",
    inject: 'head',
    scriptLoading: 'blocking'
  })]
});