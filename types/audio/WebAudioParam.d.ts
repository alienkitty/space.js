import type { WebAudio } from './WebAudio.js';
import type { Sound } from './Sound.js';
import type { WebAudio3D } from '../three/audio/WebAudio3D.js';
import type { Sound3D } from '../three/audio/Sound3D.js';

/**
 * Web Audio engine node parameter.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/audio/WebAudioParam.js | Source}
 */
export class WebAudioParam {
    private parent: WebAudio | Sound | WebAudio3D | Sound3D;
    private node: string;
    private param: string;
    private alpha: number;

    constructor(parent: WebAudio | Sound | WebAudio3D | Sound3D, node: string, param: string, alpha: number);

    get value(): number;

    set value(value: number);

    set(value: number): void;

    fade(value: void, duration: void, delay?: number): void;
}
