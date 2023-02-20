// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     '@babel/plugin-proposal-decorators',
//     {version: '2023-01', decoratorsBeforeExport: true},
//   ],
//   env: {
//     production: {
//       plugins: ['react-native-paper/babel'],
//     },
//   },
// };

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-env', {targets: {node: 'current'}}],
  ],
  plugins: [['@babel/plugin-proposal-decorators', {version: 'legacy'}]],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
