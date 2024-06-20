import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        plugins: {
            '@stylistic/js': stylisticJs
        },
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.node,
            }
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            semi: ['error', 'never'],
            indent: ['error', 4],
            'quotes': ['error', 'single'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'eol-last': 'error',
            '@stylistic/js/no-trailing-spaces': 'error'
        },
    },
]
