import type Database from "better-sqlite3";

declare global {
    namespace Express {
        export interface Request {
            db: Database.Database;
        }
    }
}
