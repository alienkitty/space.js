import { Group, Quaternion, Vector3 } from 'three';

import type { PerspectiveCamera } from 'three';

import { WebAudioParam } from '../../audio/WebAudioParam.js';

import type { Sound } from '../../audio/Sound.js';

/**
 * A fast 3D audio object based on camera position.
 *
 * @example
 * const loader = new BufferLoader();
 * await loader.loadAllAsync(['assets/sounds/metal_monk_loop.mp3']);
 * WebAudio.init({ sampleRate: 48000 });
 * WebAudio.load(loader.files);
 *
 * // ...
 * const ambient = new Sound3D(camera, 'metal_monk_loop');
 * group.add(ambient);
 *
 * ambient.sound.gain.set(0.5);
 * ambient.sound.loop = true;
 * ambient.sound.play();
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/audio/Sound3D.js | Source}
 */
export class Sound3D extends Group {
    context: AudioContext;

    camera: PerspectiveCamera;
    cameraWorldPosition: Vector3;

    worldPosition: Vector3;
    worldQuaternion: Quaternion;
    worldScale: Vector3;
    worldOrientation: Vector3;

    audioDistance: number;
    audioNearDistance: number;
    audioFarDistance: number;

    output: GainNode | PannerNode;

    gain: WebAudioParam;
    screenSpacePosition: Vector3;
    stereo: StereoPannerNode;
    stereoPan: WebAudioParam;

    panner: PannerNode;

    input: StereoPannerNode | PannerNode;

    audioPositionX: WebAudioParam;
    audioPositionY: WebAudioParam;
    audioPositionZ: WebAudioParam;
    audioOrientationX: WebAudioParam;
    audioOrientationY: WebAudioParam;
    audioOrientationZ: WebAudioParam;

    sound: Sound;

    constructor(camera: PerspectiveCamera, id: string, buffer?: ArrayBuffer | null);
    constructor(id: string, buffer?: ArrayBuffer | null);

    override updateMatrixWorld(force?: boolean): void;

    destroy(): null;
}
