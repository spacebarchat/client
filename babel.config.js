module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      ["@babel/plugin-proposal-decorators", { version: "legacy" }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      "macros",
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
