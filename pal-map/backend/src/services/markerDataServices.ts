import { getDb } from "../db.js";

export interface MarkerProgress {
    id: string;
    markerType: string;
    name: string;
}

export interface MarkerProgressDb {
    id: string;
    markerType: string;
    name: string;
    discovered: number;
}

export async function getMarkerProgressData(): Promise<MarkerProgress[]> {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM progress");
    const rows = stmt.all() as MarkerProgressDb[];

    const markerProgress: MarkerProgress[] = rows.map((obj) => ({
        id: obj.id,
        name: obj.name,
        markerType: obj.markerType,
        discovered: !!obj.discovered,
    }));

    return markerProgress;
}

export async function addMarkerProgressData(markerProgress: MarkerProgress): Promise<void> {
    const db = getDb();
    const { id, markerType, name } = markerProgress;

    db.prepare(
        `
        INSERT INTO progress (id, markerType, name, discovered)
        VALUES (@id, @markerType, @name, 1)
        ON CONFLICT(id) DO UPDATE SET discovered = 1
    `
    ).run({ id, markerType, name });
    return;
}

export async function deleteMarkerProgressData(id: string): Promise<void> {
    const db = getDb();
    db.prepare(`DELETE FROM progress WHERE id = ?`).run(id);
    return;
}
