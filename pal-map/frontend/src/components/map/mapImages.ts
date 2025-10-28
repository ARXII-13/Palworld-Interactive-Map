import { assetLoader } from "@/utils/assetLoader";
import { icon } from "leaflet";

const MAP_ASSET_PATH = "../assets/map";

export const mapImages = {
    fastTravelIcon: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_icon_compass_FTtower.webp`, "webp"),
    worldMap: assetLoader.loadImage(`${MAP_ASSET_PATH}/T_WorldMap_85.webp`, "webp"),
};

export const mapIcons = {
    fastTravel: icon({
        iconUrl: mapImages.fastTravelIcon,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -16],
    }),
};
