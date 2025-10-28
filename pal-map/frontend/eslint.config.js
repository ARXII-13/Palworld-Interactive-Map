import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
    {
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.app.json"],
                tsconfigRootDir: __dirname,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.app.json",
                },
                alias: {
                    map: {
                        "@": path.resolve(__dirname, "./src"),
                    },
                    extensions: [".ts", ".js", ".vue"],
                },
            },
        },
    },
];
