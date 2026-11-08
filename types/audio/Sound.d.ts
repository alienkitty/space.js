import { WebAudioParam } from './WebAudioParam.js';

import type { WebAudio } from './WebAudio.js';
import type { Sound3D } from '../three/audio/Sound3D.js';

/**
 * Web Audio engine sound.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/audio/Sound.js | Source}
 */
export class Sound {
    parent: WebAudio | Sound3D;
    context: AudioContext;
    id: string;
    buffer: ArrayBuffer | null;

    loop: boolean;
    isPlaying: boolean;
    isStopping: boolean;

    output: GainNode;
    stereo: StereoPannerNode;

    gain: WebAudioParam;
    stereoPan: WebAudioParam;
    playbackRate: WebAudioParam;

    input: StereoPannerNode | GainNode;

    constructor(parent: WebAudio | Sound3D, id: string, buffer: ArrayBuffer | null, bypass?: boolean);

    load(): void;

    play(startTime?: number): void;

    stop(): void;

    destroy(): null;
}
