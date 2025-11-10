export type MapMarkerType = "fastTravelPoint" | "towerTravelPoint";

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
    visible: true;
    totalCount: number;
    discoveredCount: number;
}

export interface MapObjectLocation {
    x: number;
    y: number;
    z: number;
}
