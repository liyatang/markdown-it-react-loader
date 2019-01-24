const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './docs/index.js',
  output: {
    path: path.join(__dirname, 'docs/build'),
    filename: '[name].bundle.js',
    publicPath: '/markdown-it-react-loader/docs/build/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.md$/,
      loader: 'babel-loader!./index.js'
    }]
  }
}
