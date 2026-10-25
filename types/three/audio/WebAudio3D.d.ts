import { Group, Quaternion, Vector3 } from 'three';

import { WebAudioParam } from '../../audio/WebAudioParam.js';

/**
 * A 3D audio listener based on the three.js `AudioListener` class.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/audio/AudioListener.js | three.js `AudioListener` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/audio/WebAudio3D.js | Source}
 */
export class WebAudio3D extends Group {
    context: AudioContext;

    worldPosition: Vector3;
    worldQuaternion: Quaternion;
    worldScale: Vector3;
    worldOrientation: Vector3;

    listener: AudioListener;

    audioPositionX: WebAudioParam;
    audioPositionY: WebAudioParam;
    audioPositionZ: WebAudioParam;
    audioForwardX: WebAudioParam;
    audioForwardY: WebAudioParam;
    audioForwardZ: WebAudioParam;
    audioUpX: WebAudioParam;
    audioUpY: WebAudioParam;
    audioUpZ: WebAudioParam;

    constructor();

    override updateMatrixWorld(force?: boolean): void;
}
