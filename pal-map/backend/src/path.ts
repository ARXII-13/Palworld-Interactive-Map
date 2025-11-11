import { fileURLToPath } from "url";

import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
export const appDirname = dirname(__filename);

export const frontendPath = join(appDirname, "../../frontend/build");
export const indexHtmlPath = join(frontendPath, "index.html");
export const dbDataPath = join(appDirname, "../../data");
