try {
  var path = require('path');
  var os = require('os');
  var cordovaNodeModules = path.join(os.homedir(), '.cordova', 'node_modules');

  var webpack = require(path.join(cordovaNodeModules, 'webpack'));
  var HtmlWebpackPlugin = require(path.join(cordovaNodeModules, 'html-webpack-plugin'));
  var ExtractTextPlugin = require(path.join(cordovaNodeModules, 'extract-text-webpack-plugin'));
  var ProgressBarPlugin = require(path.join(cordovaNodeModules, 'progress-bar-webpack-plugin'));

  var cssnext = require(path.join(cordovaNodeModules, 'postcss-cssnext'));
  var postcssImport = require(path.join(cordovaNodeModules, 'postcss-import'));

} catch (e) {
  throw new Error('Missing Webpack Build Dependencies.');
}

module.exports = {
  devtool: 'eval-source-map',
  context: __dirname,
  debug: true,
  cache: true,

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000/',
    'webpack/hot/only-dev-server',
    './src/main'
  ],

  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath:'/'
  },

  resolve: {
    root: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules')
    ],

    extensions: ['', '.js', '.vue', '.json', '.css', '.html', '.styl'],

    unsafeCache: true,

    alias: {
      webpack: path.join(cordovaNodeModules, 'webpack'),
      'vue-loader/node_modules/vue-hot-reload-api': path.join(cordovaNodeModules, 'vue-loader', 'node_modules', 'vue-hot-reload-api'),
      'webpack-dev-server/client': path.join(cordovaNodeModules, 'webpack-dev-server', 'client'),
      vue:'vue/dist/vue.js'
    }
  },

  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'file?name=assets/[name].[hash].[ext]'
    }, {
      test: /\.css$/,
      include: [/\/onsen-css-components.css$/, path.join(__dirname, 'src')],
      loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1&-raw!postcss')
    }, {
      test: /\.css$/,
      exclude: [/\/onsen-css-components.css$/, path.join(__dirname, 'src')],
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },

  vue: {
    loaders: {
      js: 'babel'
    }
  },

  babel: {
    presets: [
      path.join(cordovaNodeModules, 'babel-preset-es2015')
    ],
  },

  postcss: function() {
    return [
      postcssImport,
      cssnext({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      })
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'dependency'
    }),
    new ProgressBarPlugin()
  ],

  resolveLoader: {
    root: cordovaNodeModules
  },

  devServer: {
    contentBase: './src/public',
    colors: true,
    inline: false,
    historyApiFallback: true,
    host: '0.0.0.0',
    stats: 'minimal',
    hot: true
  }
};
