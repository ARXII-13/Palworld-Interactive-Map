import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Determine log directory (works in Electron packaged builds)
const LOG_DIR = path.join((process as any).resourcesPath || process.cwd(), "logs");

// Ensure directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Define log file paths
const logFile = path.join(LOG_DIR, "app.log");
const errorFile = path.join(LOG_DIR, "error.log");

// Custom log output format
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

// Create the logger instance
const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        // Write logs to file
        new transports.File({ filename: errorFile, level: "error" }),
        new transports.File({ filename: logFile }),

        // Print to console (colorized)
        new transports.Console({
            format: combine(colorize(), logFormat),
        }),
    ],
});

// Graceful helper wrappers
export const log = {
    info: (msg: string) => logger.info(msg),
    warn: (msg: string) => logger.warn(msg),
    error: (msg: string, err?: unknown) => {
        if (err instanceof Error) {
            logger.error(`${msg}: ${err.message}\n${err.stack}`);
        } else if (typeof err === "string") {
            logger.error(`${msg}: ${err}`);
        } else {
            logger.error(msg);
        }
    },
    debug: (msg: string) => logger.debug(msg),
    stream: logger.stream,
};

export default logger;
