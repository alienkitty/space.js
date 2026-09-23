import { CubeTexture } from 'three';

import { Loader } from '../../loaders/Loader.js';

/**
 * Cube texture loader with worker support based on the three.js `CubeTextureLoader` class.
 *
 * @example
 * const loader = new CubeTextureLoader();
 * loader.setPath('/');
 * loader.setOptions({
 *     preserveData: true
 * });
 * loader.cache = true;
 *
 * const cubeTexture = await loader.loadAsync([
 *     'px.jpg', 'nx.jpg',
 *     'py.jpg', 'ny.jpg',
 *     'pz.jpg', 'nz.jpg'
 * ]);
 * console.log(cubeTexture);
 *
 * @example
 * const loader = new CubeTextureLoader();
 * const loadCubeTexture = paths => loader.loadAsync(paths);
 *
 * // ...
 * const cubeTexture = await loadCubeTexture([
 *     'px.jpg', 'nx.jpg',
 *     'py.jpg', 'ny.jpg',
 *     'pz.jpg', 'nz.jpg'
 * ]);
 * console.log(cubeTexture);
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/CubeTextureLoader.js | three.js `CubeTextureLoader` Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/TextureLoader.js | three.js `TextureLoader` Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js | three.js `ImageBitmapLoader` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/CubeTextureLoader.js | Source}
 */
export class CubeTextureLoader extends Loader {
    private defaultOptions: ImageBitmapOptions;
    private options: ImageBitmapOptions;

    constructor();

    override load(paths: string[], callback: (texture: CubeTexture) => void): void;

    setOptions(options: Partial<ImageBitmapOptions>): this;
}
