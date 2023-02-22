module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
