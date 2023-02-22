module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-env', {targets: {node: 'current'}}],
  ],
  plugins: [
    'macros',
    ['@babel/plugin-proposal-decorators', {version: 'legacy'}],
    'react-native-reanimated/plugin', // needs to be last
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
