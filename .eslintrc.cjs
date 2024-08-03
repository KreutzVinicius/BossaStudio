module.exports = {
  extends: [`plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: `latest`,
    sourceType: `module`,
  },
  plugins: [`@typescript-eslint`, `prettier`, `import`],
  ignorePatterns: [`**/node_modules/**`, `**/build/**`, `**/*.d.ts`],
  rules: {
    'import/no-unresolved': [
      `error`,
      {
        ignore: [`^firebase/.+`],
      },
    ],
    indent: [2, 2, { SwitchCase: 1 }],
    'linebreak-style': [`error`, `unix`],
    quotes: [`error`, `backtick`],
    '@typescript-eslint/interface-name-prefix': `off`,
    '@typescript-eslint/explicit-function-return-type': `off`,
    '@typescript-eslint/explicit-module-boundary-types': `off`,
    '@typescript-eslint/no-explicit-any': `off`,
    '@typescript-eslint/no-var-requires': `off`,
    'no-useless-escape': `off`,
    '@typescript-eslint/no-empty-function': `off`,
    '@typescript-eslint/no-non-null-asserted-optional-chain': `off`,
    '@typescript-eslint/no-non-null-assertion': `off`,
    '@typescript-eslint/no-unused-vars': [`warn`, { argsIgnorePattern: `^_` }],
    'no-const-assign': `error`,
    'no-console': [`warn`, { allow: [`warn`, `error`] }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: [`.ts`, `.tsx`, `.native.js`],
      },
    },
  },
};
