module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
