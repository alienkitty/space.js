import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

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
    private name: string;
    private noDrag: boolean;

    private width: number;

    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private isDragging: boolean;

    constructor(options: Partial<GraphMarkerOptions>);

    private init(): Promise<void>;

    private addListeners(): void;

    private removeListeners(): void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: () => void;

    private onKeyUp: (e: KeyboardEvent) => void;

    override destroy(): null;
}
