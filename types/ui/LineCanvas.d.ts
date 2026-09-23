import { Vector2 } from '../math/Vector2.js';
import { Component } from '../utils/Component.js';

export interface LineCanvasOptions {
    context: CanvasRenderingContext2D;
}

/**
 * Canvas 2D line with context passed in.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/LineCanvas.js | Source}
 */
export class LineCanvas extends Component {
    private context: CanvasRenderingContext2D;

    private start: Vector2;
    private end: Vector2;

    private props: {
        alpha: number;
        start: number;
        progress: number;
    };

    constructor(options?: Partial<LineCanvasOptions>);

    setContext(context: CanvasRenderingContext2D): void;

    setStartPoint(position: Vector2): void;

    setEndPoint(position: Vector2): void;

    theme(): void;

    update(): void;

    animateIn(reverse?: boolean): void;

    animateOut(fast?: boolean, callback?: () => void): void;

    deactivate(): void;

    override destroy(): null;
}
