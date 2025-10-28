import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import mapRouter from "./routes/mapData.js";
import cors from "cors";
import logger from "./utils/logger.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendPath = join(__dirname, "../../frontend/build");

// Serve static files
app.use(express.static(frontendPath));
app.use(
    cors({
        origin: "http://localhost:5173", // allow your frontend dev server
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // optional, if you use cookies/auth
    })
);

app.use(cors());
app.use(express.json());
app.use("/api/map-data", mapRouter);

// Catch-all route
app.get("*", (_req: any, res: any) => {
    res.sendFile(join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, async () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info("Serving frontend from:", frontendPath);
});
