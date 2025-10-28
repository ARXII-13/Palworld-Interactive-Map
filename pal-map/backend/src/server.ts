import path from "path";
import express from "express";
import mapRouter from "./routes/mapData";
import cors from "cors";

const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, "../../frontend/build");

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
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Serving frontend from:", frontendPath);
});
