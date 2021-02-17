module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: [
      'error',
      'single',
    ],
    'global-require': 'off',
    'no-console': 'off',
    'import/no-dynamic-require': 'off',
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    radix: 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
  },
};
