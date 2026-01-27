import type { GenernicApiResponse } from "@/services/api";
import api from "@/services/api";

export async function teleportToMarker(
    ue4ssFolder: string,
    x: number,
    y: number,
    z: number
): Promise<void> {
    await api.post<GenernicApiResponse<void>>("/cheat/teleport", { ue4ssFolder, x, y, z });
    return;
}
