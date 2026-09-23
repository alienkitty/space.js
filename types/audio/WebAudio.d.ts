import { WebAudioParam } from './WebAudioParam.js';
import { Sound } from './Sound.js';

import type { Asset } from '../loaders/AssetLoader.js';
import type { Sound3D } from '../three/audio/Sound3D.js';

/**
 * Web Audio engine with stream support.
 *
 * @example
 * const loader = new BufferLoader();
 * await loader.loadAllAsync(['assets/sounds/gong.mp3']);
 * WebAudio.init({ sampleRate: 48000 });
 * WebAudio.load(loader.files);
 *
 * const gong = WebAudio.get('gong');
 * gong.gain.set(0.5);
 *
 * document.addEventListener('pointerdown', () => {
 *     gong.play();
 * });
 *
 * @example
 * WebAudio.init({ sampleRate: 48000 });
 * WebAudio.load({ cyberspace: 'https://icecast.cyberspace.app/dive.ogg' });
 *
 * const cyberspace = WebAudio.get('cyberspace');
 * cyberspace.gain.set(1);
 *
 * document.addEventListener('pointerdown', () => {
 *     cyberspace.play();
 * });
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/audio/WebAudio.js | Source}
 */
export class WebAudio {
    static path: string;
    static crossOrigin: string;

    static context: AudioContext;
    static map: Map<string, Sound>;

    static output: GainNode;

    static gain: WebAudioParam;

    static input: GainNode;

    static init(options?: AudioContextOptions): void;

    static get enabled(): boolean;

    static load(files: Map<string, Asset> | object): void;

    static add(parent: WebAudio | Sound3D, id: string, buffer: ArrayBuffer | string, bypass: boolean): Sound;
    static add(id: string, buffer: ArrayBuffer | string, bypass: boolean): Sound;

    static get(id: string): Sound;

    static remove(id: string): void;

    static clone(parent: WebAudio | Sound3D, from: string, to: string, bypass: boolean): Sound;
    static clone(from: string, to: string, bypass: boolean): Sound;

    static trigger(id: string): Sound;

    static play(id: string, volume?: number, loop?: boolean): Sound;
    static play(id: string, loop?: boolean): Sound;

    static fadeInAndPlay(id: string, volume: number, loop: boolean, duration: number, ease: string, delay?: number, complete?: () => void, update?: () => void): Sound;
    static fadeInAndPlay(id: string, volume: number, loop: boolean, duration: number, ease: string, complete?: () => void, update?: () => void): Sound;

    static fadeOutAndStop(id: string, duration: number, ease: string, delay?: number, complete?: () => void, update?: () => void): Sound;
    static fadeOutAndStop(id: string, duration: number, ease: string, complete?: () => void, update?: () => void): Sound;

    static mute(instant: boolean): void;

    static unmute(instant: boolean): void;

    static resume(): void;

    static getPath(path: string): string

    static setPath(path: string): void;

    static setCrossOrigin(crossOrigin: string): void;

    static destroy(): null;
}
