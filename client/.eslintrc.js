module.exports = {
  parserOptions: { ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  env: { browser: true },
  plugins: ['react-hooks'],
  extends: ['plugin:react/recommended', 'plugin:jsx-a11y/recommended'],
  rules: {
    'func-style': ['error', 'expression'],

    // React 関係
    'no-restricted-imports': ['error', { paths: [{ name: 'react', importNames: ['default'] }] }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'error',
    'react/destructuring-assignment': ['error', 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Import 関係
    'import/no-default-export': 'error',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

    // Linkコンポーネントとa11yの干渉回避
    'jsx-a11y/anchor-is-valid': [
      'error',
      { components: ['Link'], specialLink: ['hrefLeft', 'hrefRight'], aspects: ['invalidHref', 'preferButton'] },
    ],
  },
  overrides: [{ files: ['src/pages/**/*.tsx'], rules: { 'import/no-default-export': 'off' } }],
}
