module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint'
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
      { js: 'never', ts: 'never' }
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'warn',
      { devDependencies: ['**/*.spec.ts', 'gulpfile.js'] }
    ],
    'prettier/prettier': 'error'
  }
}
