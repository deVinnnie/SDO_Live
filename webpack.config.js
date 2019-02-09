const webpack = require('webpack');

module.exports = {  
  entry: [
    './dist/static/js/index.js'
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'build.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      "React": "react"
    })
    //new webpack.HotModuleReplacementPlugin()
  ],
  
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
