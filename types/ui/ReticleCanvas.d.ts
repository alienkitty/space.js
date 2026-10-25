import { Vector2 } from '../math/Vector2.js';
import { Component } from '../utils/Component.js';

export interface ReticleCanvasOptions {
    context: CanvasRenderingContext2D;
}

/**
 * Canvas reticle with context passed in.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/ReticleCanvas.js | Source}
 */
export class ReticleCanvas extends Component {
    context: CanvasRenderingContext2D;

    radius: number;
    position: Vector2;
    animatedIn: boolean;

    props: {
        scale: number;
        alpha: number;
    };

    constructor(options?: Partial<ReticleCanvasOptions>);

    setContext(context: CanvasRenderingContext2D): void;

    theme(): void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    override destroy(): null;
}
