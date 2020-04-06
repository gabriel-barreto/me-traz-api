module.exports = {
  parser: '@typesscript-eslint/parser',
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/resolver': {
      node: { extensions: ['.js', '.ts', '.tsx'] }
    }
  },
  rules: {
    'no-underscore-dangle': 'off',
    'space-before-function-paren': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', ts: 'never', tsx: 'never' }
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'warn',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/*.stories.js'] }
    ],
    'prettier/prettier': 'error'
  }
}
