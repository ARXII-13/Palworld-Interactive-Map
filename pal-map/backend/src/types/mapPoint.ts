export interface MapPoint {
    id: string;
    name: string;
    type: string;
    position: MapObjectLocation;
    discovered?: boolean;
    canBeDiscovered?: boolean;
    metadata?: Record<string, any>;
}

export interface MapObjectLocation {
    x: number;
    y: number;
    z: number;
}
