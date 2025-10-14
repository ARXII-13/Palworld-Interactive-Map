import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export function loadJsonFiles(directory, language) {
    logger.info(`Loading JSON files from ${directory} for language ${language}...`);
    const filesToLoad = {};

    filesToLoad["MainWorld"] = {
        file: "PL_MainWorld5.json",
        type: "map",
        path: path.join(directory, "Content", "Pal", "Maps", "MainWorld_5", "PL_MainWorld5.json"),
    };
    filesToLoad["MapRespawnPointInfoText"] = {
        file: "DT_MapRespawnPointInfoText.json",
        type: "language",
        path: path.join(
            directory,
            "Content",
            "L10N",
            language,
            "Pal",
            "DataTable",
            "Text",
            "DT_MapRespawnPointInfoText.json"
        ),
    };

    const filesObject = {};
    Object.entries(filesToLoad).forEach(([key, { file, type, path }]) => {
        try {
            logger.info(`Loading ${file} JSON files from ${path}`);
            const content = fs.readFileSync(path, "utf-8");
            const json = JSON.parse(content);
            filesObject[key] = { file, type, data: json };
        } catch (err) {
            logger.error(`Error reading ${file}: ${err.message}`);
            logger.error(err);
        }
    });

    logger.info(`Loaded ${Object.keys(filesObject).length} JSON files from ${directory}`);
    return filesObject;
}
