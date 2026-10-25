import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { ReticleInfo } from './ReticleInfo.js';

export interface ReticleData {
    primary: string;
    secondary: string;
}

/**
 * Reticle.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Reticle.js | Source}
 */
export class Reticle extends Interface {
    width: number;
    height: number;
    position: Vector2;
    animatedIn: boolean;

    center?: Interface;
    info?: ReticleInfo;

    constructor();

    init(): void;

    setData(data: Partial<ReticleData>): void;

    update(): void;

    animateIn(): void;

    animateOut(callback?: () => void): void;

    activate(): void;

    deactivate(): void;
}
