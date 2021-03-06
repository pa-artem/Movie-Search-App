module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/require-default-props': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'off',
    'no-continue': 'off',
    'operator-linebreak': 'off',
    'no-await-in-loop': 'off',
    'react/prop-types': 'off',
    eqeqeq: 'off',

    // these conflict with prettier formatting
    'no-confusing-arrow': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'object-curly-newline': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-wrap-multilines': 'off',

    // use @typescript-eslint/no-shadow instead
    'no-shadow': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      typescript: {
        alwaysTryTypes: true,
        '@app': './src',
        '@components': './src/components',
        '@ts': './src/ts',
        '@hooks': './src/hooks',
      },
    },
  },
  ignorePatterns: ['webpack.config.js', 'postcss.config.js', 'babel.config.js'],
};
