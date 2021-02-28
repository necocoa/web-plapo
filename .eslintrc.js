module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  env: { es2021: true, jest: true, node: true },
  plugins: ['import', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['.eslintrc.js', 'node_modules/'],
  rules: {
    'no-console': 'off',
    'no-restricted-syntax': ['error', 'TSEnumDeclaration'],
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // インポート関連
    'import/newline-after-import': 'error',
    'import/no-default-export': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
