// backend/src/server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve the frontend build
const isPkg = typeof (process as any).pkg !== "undefined";
const frontendPath = isPkg
    ? path.join(path.dirname(process.execPath), "frontend") // for pkg, copy build folder next to exe
    : path.join(__dirname, "../../build/frontend");

console.log(`Serving frontend files from: ${frontendPath}`);
app.use(express.static(frontendPath));

app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`✅ Palworld Map running at http://localhost:${PORT}`);
});
