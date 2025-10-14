import logger from "../utils/logger.js";

export function parseFastTravelData(files) {
    const results = [];

    const mapData = files["MainWorld"]?.data || [];

    const languagefileMaps = {};
    Object.entries(files)
        .filter(([_, file]) => file.type === "language")
        .forEach(([fileName, { data }]) => {
            const languageEntries = data[0].Rows || [];
            languagefileMaps[fileName] = new Map(Object.entries(languageEntries));
        });

    // Build a map by object.Name for quick lookup
    const worldMapLocationMap = new Map();
    const worldMapObjectMap = new Map();

    // Loop through all map objects
    for (const obj of mapData) {
        // Fast travel points
        if (obj.Type === "BP_LevelObject_TowerFastTravelPoint_C") {
            worldMapObjectMap.set(obj.Name, obj);
        }

        if (obj.Type === "SceneComponent" && obj.Name === "Root") {
            worldMapLocationMap.set(obj.Outer, obj);
        }
    }

    for (const [_, obj] of worldMapObjectMap.entries()) {
        const locationObj = worldMapLocationMap.get(obj.Name);
        if (locationObj && locationObj.Properties?.RelativeLocation) {
            const id = obj.Properties.FastTravelPointID;
            results.push({
                id: id,
                label: languagefileMaps["MapRespawnPointInfoText"].get(id)?.TextData.LocalizedString || "",
                type: "fastTravelPoint",
                location: locationObj.Properties.RelativeLocation,
            });
        }
    }

    return results;
}
