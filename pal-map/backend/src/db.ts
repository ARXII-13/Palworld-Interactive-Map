import Database from "better-sqlite3";
import logger from "./utils/logger.js";
import fs from "fs";
import { dbDataPath } from "./path.js";
import { join } from "path";

let db: Database.Database | null = null;
export function getDb(): Database.Database {
    if (db) return db;

    try {
        const dataDir = process.env.ELECTRON_APP_DATA || dbDataPath;
        logger.info(
            `🔍 [DB INIT] process.env.ELECTRON_APP_DATA = ${process.env.ELECTRON_APP_DATA}`
        );
        logger.info(`🔍 [DB INIT] Using dataDir = ${dataDir}`);
        fs.mkdirSync(dataDir, { recursive: true });

        logger.info(`🗄️  Initializing SQLite at: ${dataDir}`);

        const dbPath = join(dataDir, "progress.sqlite");
        db = new Database(dbPath, { verbose: logger.info });
        db.exec(`
      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY,
        markerType TEXT NOT NULL,
        name TEXT,
        discovered INTEGER DEFAULT 0
      )
    `);

        logger.info("✅ SQLite initialized successfully");
    } catch (err) {
        logger.error(`❌ SQLite init failed: ${err}`);
        throw err;
    }

    return db;
}
