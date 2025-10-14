// backend/build.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const root = path.resolve("../");
const buildDir = path.join(root, "build");

// 1. Build frontend
console.log("🚧 Building frontend...");
execSync("npm run build --prefix ../frontend", { stdio: "inherit" });

// 2. Build backend (TypeScript -> JS)
console.log("🔧 Compiling backend...");
execSync("npx tsc", { stdio: "inherit" });

// 3. Copy package.json into build folder
console.log("📦 Copying backend package.json...");
fs.copyFileSync("./package.json", path.join(buildDir, "backend", "package.json"));

console.log("✅ Build complete! Ready for packaging.");
