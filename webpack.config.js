const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:4000',
    'webpack/hot/dev-server',
    './src/index.js'
  , './src/style.css'
    ]

, output: {
    filename: 'index.js'
  , chunkFilename: "[id].js"
  , path: __dirname + '/public/'
  , libraryTarget: 'umd'
  }

, module: {
    // loaders: [
    //   { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    // , { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' }
    // , { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")}
    // ]
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }

, plugins: [
    // new ExtractTextPlugin("style.css", {allChunks: true})
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: "#source-map",
  // devtool: 'eval-source-map',
  historyApiFallback: true
}
