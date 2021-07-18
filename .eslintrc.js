module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelCase': 'off',
  },
  parserOptions: {
    project: __dirname + '/tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
