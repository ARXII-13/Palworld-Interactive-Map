export type MarkerSourceMode = "game" | "memory";

export type MapMarkerType = "fastTravelPoint" | "towerTravelPoint" | "treasure" | "egg";

export interface MapMarker {
    id: string;
    name: string;
    type: MapMarkerType;
    position: MapObjectLocation;
    discovered: boolean;
    metadata?: Record<string, any>;
}

export interface MapMarkerTypeFilter {
    icon: string;
    label: string;
    visible: boolean;
    totalCount: number;
    discoveredCount: number;
}

export interface MapObjectLocation {
    x: number;
    y: number;
    z: number;
}

export interface MarkerProgress {
    id: string;
    markerType: string;
    name: string;
}
