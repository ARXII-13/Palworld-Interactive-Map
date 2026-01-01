import type { GenernicApiResponse } from "@/services/api";
import api from "@/services/api";
import type { MarkerProgress } from "@/types/map";

export async function getMarkerDiscoveryData(): Promise<MarkerProgress[]> {
    const res = await api.get<GenernicApiResponse<MarkerProgress[]>>("/marker/discover");
    return res.data.data;
}

export async function addMarkerDiscoveryStatus(marker: MarkerProgress): Promise<void> {
    await api.post<GenernicApiResponse<void>>(`/marker/discover/${marker.id}`, marker);
    return;
}

export async function deleteMarkerDiscoveryStatus(markerId: string): Promise<void> {
    await api.delete<GenernicApiResponse<void>>(`/marker/discover/${markerId}`);
    return;
}
