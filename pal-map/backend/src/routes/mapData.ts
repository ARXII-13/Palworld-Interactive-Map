import express from "express";
import { getMapData } from "../services/mapDataServices.js";
import { getMapRealtimeData } from "../services/mapRealtimeDataServices.js";
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

router.get("/realtime", async (req, res) => {
    try {
        const ue4ssFolder = req.query.ue4ssFolder as string;
        const data = await getMapRealtimeData(ue4ssFolder);
        res.json({ code: 200, data });
    } catch (err) {
        logger.error(`[Map Realtime API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to load map realtime data" });
    }
});

export default router;
