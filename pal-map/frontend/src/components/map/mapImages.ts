import { assetLoader } from "@/utils/assetLoader";
import { icon } from "leaflet";

const MAP_ASSET_PATH = "../assets/map";

export const mapImages = {
    fastTravelPointIcon: assetLoader.loadImage(
        `${MAP_ASSET_PATH}/T_icon_compass_FTtower.webp`,
        "webp"
    ),
    towerTravelPointIcon: assetLoader.loadImage(
        `${MAP_ASSET_PATH}/T_icon_compass_tower.webp`,
        "webp"
    ),
    bountyIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_Bounty.webp`, "webp"),
    baseIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_camp.webp`, "webp"),
    dungeonIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_dungeon.webp`, "webp"),
    enemyCampIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_EnemyCamp.webp`, "webp"),
    oilrigIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_Oilrig.webp`, "webp"),
    strongEnemyIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_enemy_strong.webp`, "webp"),
    worldMap: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_WorldMap_85.webp`, "webp"),
};

export const mapIcons = {
    fastTravel: icon({
        iconUrl: mapImages.fastTravelPointIcon,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -16],
    }),
    towerTravel: icon({
        iconUrl: mapImages.towerTravelPointIcon,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -16],
    }),
};
