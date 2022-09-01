const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require("./webpack.common.config");

module.exports = merge(common, {
  resolve: {
    fallback: {
      fs: false
    }
  },
  mode: "production",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    filename: "[hash].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: 'head',
    scriptLoading: 'blocking'
  }), new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "src/assets"),
        to: path.resolve(__dirname, "dist/assets"),
      },
      {
        from: path.resolve(__dirname, "src/levels"),
        to: path.resolve(__dirname, "dist/levels"),
      },
      {
        from: path.resolve(__dirname, "src/3dstreet-assets"),
        to: path.resolve(__dirname, "dist/3dstreet-assets"),
      }
    ]}
  )]
});