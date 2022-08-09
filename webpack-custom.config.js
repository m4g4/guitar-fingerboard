module.exports = {
  module : {
    rules: [
        {
          test: /\.mp3$/,
          loader: 'file-loader',
          options: {
          	name: 'static/mp3/[name].[ext]'
          }
        }
    ]
  }
};
