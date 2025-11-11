import express from "express";
import { getMapData } from "../services/mapDataServices.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await getMapData();
        res.json({ code: 200, data });
    } catch (err) {
        logger.error(`[Map API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to load map data" });
    }
});

export default router;
