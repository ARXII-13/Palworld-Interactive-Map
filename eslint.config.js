import { defineConfig } from "eslint-define-config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import vuePlugin from "eslint-plugin-vue";

export default [
    // Base config for all files
    defineConfig({
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
            },
            globals: {
                console: "readonly",
                process: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    }),

    // TS/JS files
    defineConfig({
        files: ["*.ts", "*.js"],
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        },
    }),

    // Vue files
    defineConfig({
        files: ["*.vue"],
        plugins: {
            vue: vuePlugin,
        },
        rules: {
            "vue/html-self-closing": ["error", { html: { void: "never" } }],
        },
    }),
];
