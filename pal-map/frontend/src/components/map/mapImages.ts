import { assetLoader } from "@/utils/assetLoader";
import { divIcon } from "leaflet";

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
    fastTravel: divIcon({
        html: `
      <div class="marker-wrapper">
        <img src="${mapImages.fastTravelPointIcon}" class="marker-base" />
      </div>
    `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16 * 1.25, 16 * 1.25],
        popupAnchor: [-4, -12],
    }),
    fastTravelChecked: divIcon({
        html: `
      <div class="marker-wrapper">
        <img src="${mapImages.fastTravelPointIcon}" class="marker-base" />
        <div class="marker-checkbox"></div>
      </div>
    `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16 * 1.25, 16 * 1.25],
        popupAnchor: [-4, -12],
    }),
    towerTravel: divIcon({
        html: `
      <div class="marker-wrapper">
        <img src="${mapImages.towerTravelPointIcon}" class="marker-base" />
      </div>
    `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16 * 1.25, 16 * 1.25],
        popupAnchor: [-4, -16],
    }),
    towerTravelChecked: divIcon({
        html: `
      <div class="marker-wrapper">  
        <img src="${mapImages.towerTravelPointIcon}" class="marker-base" />
        <div class="marker-checkbox"></div>
      </div>
    `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16 * 1.25, 16 * 1.25],
        popupAnchor: [-4, -16],
    }),
};
