import { Texture } from 'three';

import { Loader } from '../../loaders/Loader.js';

/**
 * Texture loader with worker support based on the three.js `TextureLoader` class.
 *
 * @example
 * const loader = new TextureLoader();
 * loader.setPath('/');
 * loader.setOptions({
 *     preserveData: true
 * });
 * loader.cache = true;
 *
 * const map = await loader.loadAsync('assets/textures/cubemap.jpg');
 * console.log(map);
 *
 * @example
 * const loader = new TextureLoader();
 * const loadTexture = path => loader.loadAsync(path);
 *
 * // ...
 * const map = await loadTexture('assets/images/alienkitty.svg');
 * map.minFilter = LinearFilter;
 * map.generateMipmaps = false;
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/TextureLoader.js | three.js `TextureLoader` Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js | three.js `ImageBitmapLoader` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/TextureLoader.js | Source}
 */
export class TextureLoader extends Loader {
    private defaultOptions: ImageBitmapOptions;
    private options: ImageBitmapOptions;

    constructor();

    override load(path: string, callback: (texture: Texture) => void): void;

    setOptions(options: Partial<ImageBitmapOptions>): this;
}
