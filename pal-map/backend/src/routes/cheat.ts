import express from "express";
import { teleportToLocation } from "../services/commandServices.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/teleport", async (req, res) => {
    try {
        const { ue4ssFolder, x, y, z } = req.body;
        await teleportToLocation(ue4ssFolder, x, y, z);
        res.json({ code: 200 });
    } catch (err) {
        logger.error(`[Cheat API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to post cheat teleport API" });
    }
});

export default router;
