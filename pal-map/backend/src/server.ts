import path from "path";
import express from "express";
import openApp from "open";

const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, "../../frontend/build");

// Serve static files
app.use(express.static(frontendPath));

// Catch-all route
app.get("*", (_req: any, res: any) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Serving frontend from:", frontendPath);
});
