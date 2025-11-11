import express from "express";
import {
    deleteMarkerProgressData,
    getMarkerProgressData,
    MarkerProgress,
    addMarkerProgressData,
} from "../services/markerDataServices.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/discover", async (_, res) => {
    try {
        const data = await getMarkerProgressData();
        res.json({ code: 200, data });
    } catch (err) {
        logger.error(`[Marker API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to load marker data" });
    }
});

router.post("/discover/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { markerType, name } = req.body;
        await addMarkerProgressData({
            id,
            markerType,
            name,
        } as MarkerProgress);
        res.json({ code: 200 });
    } catch (err) {
        logger.error(`[Marker API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to save marker discovery data" });
    }
});

router.delete("/discover/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await deleteMarkerProgressData(id);
        res.json({ code: 200 });
    } catch (err) {
        logger.error(`[Marker API] ${err}`);
        res.status(500).json({ code: 500, error: "Failed to delete marker discovery data" });
    }
});

export default router;
