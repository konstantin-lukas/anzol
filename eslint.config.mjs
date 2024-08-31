import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticJs from '@stylistic/eslint-plugin-js'

export default tseslint.config({
    files: ["src/**/*.ts", "tests/**/*.{ts,tsx}"],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strict,
        ...tseslint.configs.stylistic,
    ],
    plugins: {
        '@stylistic/js': stylisticJs
    },
    rules: {
        "@stylistic/js/comma-dangle": ["error", "always-multiline"],
        "@stylistic/js/indent": ["error", 4],
        "@stylistic/js/brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "@stylistic/js/semi": ["error", "always"],
        "@stylistic/js/quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
        "@stylistic/js/object-curly-spacing": ["error", "always", {
            "arraysInObjects": false,
            "objectsInObjects": false,
        }],
        "@stylistic/js/array-bracket-spacing": ["error", "never"],
        "@stylistic/js/comma-spacing": ["error", {
            "before": false,
            "after": true,
        }],
        "@typescript-eslint/consistent-type-imports": "error",
    }
});
