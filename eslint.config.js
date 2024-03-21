// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-case-declarations': "off",
      'no-fallthrough': 'off',
      '@typescript-eslint/no-unused-vars': "off",
    }
  }
);
