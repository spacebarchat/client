const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const appDirectory = path.resolve(__dirname);

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(js|ts)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
    path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
    path.resolve(appDirectory, 'node_modules/react-native-webview'),
    path.resolve(appDirectory, 'node_modules/react-native-animatable'),
    path.resolve(
      appDirectory,
      'node_modules/@qeepsake/react-navigation-overlay',
    ),
    path.resolve(appDirectory, 'node_modules/react-native-dropdown-picker'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      // cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: [
        'module:metro-react-native-babel-preset',
        ['@babel/preset-env', {targets: {node: 'current'}}],
      ],
      // Re-write paths to import only the modules needed by the app
      plugins: [
        'macros',
        ['@babel/plugin-proposal-decorators', {version: 'legacy'}],
        'react-native-web',
      ],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

const tsLoaderConfiguration = {
  test: /\.(tsx|ts|jsx|js|mjs)$/,
  // exclude: /node_modules/,
  include: [
    path.resolve(appDirectory, 'node_modules', 'react-native-error-boundary'),
    path.resolve(appDirectory, 'node_modules', 'react-native-vector-icons'),
    path.resolve(
      appDirectory,
      'node_modules',
      '@spacebarchat',
      'spacebar-api-types',
    ),
    path.resolve(appDirectory, 'src'),
  ],
  loader: 'ts-loader',
};

const ttfLoaderConfiguration = {
  test: /\.ttf$/,
  loader: 'url-loader', // or directly file-loader
  include: path.resolve(__dirname, './node_modules/react-native-vector-icons'),
};

const RNWWFileLoaderConfiguration = {
  test: /postMock.html$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

const fontLoaderConfiguration = {
  test: /\.(woff|woff2|eot|otf)$/i,
  type: 'asset/resource',
};

module.exports = {
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: '[chunkhash].js',
    path: path.resolve(appDirectory, 'web-build'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      babelLoaderConfiguration,
      tsLoaderConfiguration,
      imageLoaderConfiguration,
      ttfLoaderConfiguration,
      fontLoaderConfiguration,
      RNWWFileLoaderConfiguration,
    ],
  },

  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './web/index.html'),
      favicon: path.join(__dirname, './assets/images/favicon.png'),
      publicPath: '/',
    }),
    // `process.env.NODE_ENV === 'production'` must be `true` for production
    // builds to eliminate development checks and reduce build size. You may
    // wish to include additional optimizations.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      __DEV__: process.env.NODE_ENV !== 'production' || true,
    }),
    new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}),
    new webpack.DefinePlugin({process: {env: {}}}),
  ],

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': 'react-native-web',
      'react-native-webview': 'react-native-web-webview',
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
    ],
    fallback: {
      fs: false,
      module: false,
    },
  },
  devServer: {
    // static: path.join(__dirname, 'dist'),
    static: path.resolve(appDirectory, 'web', 'public'),
    compress: true,
    port: 4000,
    historyApiFallback: true,
  },
};
