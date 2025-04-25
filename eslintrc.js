module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'airbnb-typescript/base',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    overrides: [
        {
            files: ['*.js', '*.cjs'],
            env: {
                node: true,
            },
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    rules: {

        'import/extensions': 'off',
        'import/prefer-default-export': 'off',


        'no-console': 'off',


        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',

        'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
};
