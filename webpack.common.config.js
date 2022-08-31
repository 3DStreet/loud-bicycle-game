module.exports = {
  devtool: "none",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      }
    ]
  }
}