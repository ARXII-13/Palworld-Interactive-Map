import axios, { HttpStatusCode, type AxiosInstance } from "axios";
import type { MapMarker } from "@/types/map";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
});

interface MapResponse {
    success: boolean;
    data: MapMarker[];
}

export async function getMapData(): Promise<MapMarker[]> {
    const res = await api.get<MapResponse>("/map-data");
    if (res.status !== HttpStatusCode.Ok) throw new Error("Failed to load map data");
    return res.data.data;
}
