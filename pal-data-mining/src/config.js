import dotenv from "dotenv";
import path from "path";

dotenv.config();

export function loadConfig() {
    const DATA_DIR = process.env.DATA_DIR;
    const OUTPUT_DIR = process.env.OUTPUT_DIR;
    const LANGUAGE = process.env.LANGUAGE;
    return {
        DATA_DIR: path.resolve(DATA_DIR),
        OUTPUT_DIR: path.resolve(OUTPUT_DIR),
        LANGUAGE,
    };
}
