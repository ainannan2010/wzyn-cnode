const path = require('path');
module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    app: path.join(__dirname, '../src/server-entry.js')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        enforce: 'pre',
        test: /\.(jsx|js)$/,
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ],
        loader: 'eslint-loader'
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
  ]
};