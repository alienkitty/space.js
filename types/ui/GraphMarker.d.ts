import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import type { Graph } from './Graph.js';
import type { GraphSegments } from './GraphSegments.js';
import type { RadialGraph } from './RadialGraph.js';
import type { RadialGraphCanvas } from './RadialGraphCanvas.js';
import type { RadialGraphSegments } from './RadialGraphSegments.js';
import type { RadialGraphSegmentsCanvas } from './RadialGraphSegmentsCanvas.js';

export type GraphInstance =
    | Graph
    | GraphSegments
    | RadialGraph
    | RadialGraphCanvas
    | RadialGraphSegments
    | RadialGraphSegmentsCanvas;

export interface GraphMarkerEvent {
    type: 'add' | 'remove';
    item: GraphMarker;
    target: GraphInstance;
}

export interface GraphMarkerUpdateEvent {
    dragging: boolean;
    target: GraphMarker;
}

export interface GraphMarkerClickEvent {
    target: GraphMarker;
}

export interface GraphMarkerOptions {
    name: string;
    noDrag: boolean;
}

/**
 * Graph marker.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/GraphMarker.js | Source}
 */
export class GraphMarker extends Interface {
    name: string;
    noDrag: boolean;

    width: number;

    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    isDragging: boolean;

    constructor(options: Partial<GraphMarkerOptions>);

    init(): Promise<void>;

    addListeners(): void;

    removeListeners(): void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: () => void;

    onKeyUp: (e: KeyboardEvent) => void;

    override destroy(): null;
}
