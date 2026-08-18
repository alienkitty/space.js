import { PMREMGenerator } from 'three';

import type { CubeTexture, WebGLRenderer } from 'three';

import { TextureLoader } from './TextureLoader.js';
import { Loader } from '../../loaders/Loader.js';

/**
 * Creates an environment diffuse texture with worker support.
 *
 * @example
 * // ...
 * const loader = new EnvironmentTextureLoader(renderer);
 * loader.load('assets/textures/env/jewelry_black_contrast.jpg', texture => {
 *     scene.environment = texture;
 *     scene.environmentIntensity = 1.2;
 * });
 *
 * @example
 * // ...
 * const loader = new EnvironmentTextureLoader(renderer);
 * scene.environment = await loader.loadAsync('assets/textures/env/jewelry_black_contrast.jpg');
 * scene.environmentIntensity = 1.2;
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/EnvironmentTextureLoader.js | Source}
 */
export class EnvironmentTextureLoader extends Loader {
    textureLoader: TextureLoader;
    pmremGenerator: PMREMGenerator;

    constructor(renderer: WebGLRenderer, options: ImageBitmapOptions);

    override load(path: string, callback: (texture: CubeTexture) => void): void;

    override getPath(path: string): string;

    override setPath(path: string): this;

    override setCrossOrigin(crossOrigin: string): this;

    override setFetchOptions(fetchOptions: RequestInit): this;

    override destroy(): null;
}
