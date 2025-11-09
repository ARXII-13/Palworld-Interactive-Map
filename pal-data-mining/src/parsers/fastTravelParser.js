import logger from "../utils/logger.js";

const BOSS_DISTANCE_THRESHOLD = 1000;

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
    const bossTowerMap = new Map();

    // Loop through all map objects
    for (const obj of mapData) {
        // Fast travel points
        if (obj.Type === "BP_LevelObject_TowerFastTravelPoint_C") {
            worldMapObjectMap.set(obj.Name, obj);
        }

        if (obj.Type === "SceneComponent" && obj.Name === "Root") {
            worldMapLocationMap.set(obj.Outer, obj);
        }

        // The fast travel towers mix in a few boss towers, we need to distinguish them
        if (obj.Type === "BP_PalBossTower_C") {
            const bossType = obj.Properties?.BossType?.replace("EPalBossType::", "") ?? null;
            const root = mapData.find(
                (x) =>
                    x.Outer === obj.Name &&
                    x.Type === "SceneComponent" &&
                    x.Name === "DefaultSceneRoot"
            );

            if (root?.Properties?.RelativeLocation) {
                bossTowerMap.set(obj.Name, {
                    bossType,
                    location: root.Properties.RelativeLocation,
                });
            }
        }
    }

    for (const [_, obj] of worldMapObjectMap.entries()) {
        const locationObj = worldMapLocationMap.get(obj.Name);
        if (!locationObj?.Properties?.RelativeLocation) continue;

        const loc = locationObj.Properties.RelativeLocation;

        // Find nearest boss tower (if any)
        let nearestBoss = null;
        let minDist = Infinity;
        for (const boss of bossTowerMap.values()) {
            const d = distance(loc, boss.location);
            if (d < minDist) {
                minDist = d;
                nearestBoss = boss;
            }
        }

        const isFastTravel = minDist > BOSS_DISTANCE_THRESHOLD;
        const id = isFastTravel ? obj.Properties.FastTravelPointID : nearestBoss.bossType;

        const label = isFastTravel
            ? languagefileMaps["MapRespawnPointInfoText"]?.get(id)?.TextData.LocalizedString
            : languagefileMaps["UICommonTextCommon"]?.get(`BOSS_BATTLE_NAME_${id}`)?.TextData
                  .LocalizedString;

        results.push({
            id,
            label,
            type: isFastTravel ? "fastTravelPoint" : "towerTravelPoint",
            location: loc,
        });
    }

    return results;
}

function distance(a, b) {
    const dx = a.X - b.X;
    const dy = a.Y - b.Y;
    return Math.sqrt(dx * dx + dy * dy);
}
