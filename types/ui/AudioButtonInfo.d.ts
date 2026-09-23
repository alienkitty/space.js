import { Interface } from '../utils/Interface.js';

import type { AudioButtonData } from './AudioButton.js';

/**
 * Audio toggle button info.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/AudioButtonInfo.js | Source}
 */
export class AudioButtonInfo extends Interface {
    private wrapper?: Interface;

    constructor();

    private init(): void;

    private onClick: () => void;

    setData(data: AudioButtonData): void;
}
