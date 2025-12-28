import express from "express";
import cors from "cors";
import mapRouter from "./routes/mapData.js";
import markerRouter from "./routes/markerData.js";
import logger from "./utils/logger.js";
import { frontendPath, indexHtmlPath } from "./path.js";

const app = express();
const PORT = 8013;

app.use(express.static(frontendPath));
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // optional, if you use cookies/auth
    })
);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    // Log request details
    logger.info(`➡️  [${req.method}] ${req.originalUrl}`);

    // Capture response finish event
    res.on("finish", () => {
        const duration = Date.now() - start;
        const statusColor =
            res.statusCode >= 500
                ? "\x1b[31m" // red
                : res.statusCode >= 400
                  ? "\x1b[33m" // yellow
                  : "\x1b[32m"; // green

        logger.info(
            `⬅️  [${req.method}] ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`
        );
    });

    next();
});

app.use("/api/map", mapRouter);
app.use("/api/marker", markerRouter);

// Catch-all route
app.get("*", (_req: any, res: any) => {
    res.sendFile(indexHtmlPath);
});

// Start server
app.listen(PORT, async () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`Serving frontend from: ${frontendPath}`);
});
