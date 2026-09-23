import { BufferGeometry } from 'three';

import { Loader } from '../../loaders/Loader.js';

/**
 * Buffer geometry loader with worker support.
 *
 * @example
 * const loader = new BufferGeometryLoader();
 * const buffers = await loader.loadAsync('assets/geometry/cube.json');
 * console.log(buffers);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/BufferGeometryLoader.js | Source}
 */
export class BufferGeometryLoader extends Loader {
    override load(path: string, callback: (geometry: BufferGeometry) => void): void;
}
