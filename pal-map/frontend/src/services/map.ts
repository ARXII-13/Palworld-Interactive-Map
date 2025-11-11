import type { MapMarker } from "@/types/map";
import type { GenernicApiResponse } from "@/services/api";
import api from "@/services/api";

export async function getMapData(): Promise<MapMarker[]> {
    const res = await api.get<GenernicApiResponse<MapMarker[]>>("/map");
    return res.data.data;
}
