import { Interface } from '../utils/Interface.js';

import type { ReticleData } from './Reticle.js';

/**
 * Reticle info.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/ReticleInfo.js | Source}
 */
export class ReticleInfo extends Interface {
    primary?: Interface;
    secondary?: Interface;

    constructor();

    init(): void;

    setData(data: ReticleData): void;

    animateIn(): void;

    animateOut(): void;
}
