/**
 * @author pschroen / https://ufo.ai/
 */

import { PMREMGenerator } from 'three';

import { TextureLoader } from './TextureLoader.js';
import { Loader } from '../../loaders/Loader.js';

/**
 * Creates an environment diffuse texture from a given source with worker support.
 * @example
 * // ...
 * const loader = new EnvironmentTextureLoader(renderer);
 * loader.load('assets/textures/env/jewelry_black_contrast.jpg', texture => {
 *     scene.environment = texture;
 *     scene.environmentIntensity = 1.2;
 * });
 * @example
 * // ...
 * const loader = new EnvironmentTextureLoader(renderer);
 * scene.environment = await loader.loadAsync('assets/textures/env/jewelry_black_contrast.jpg');
 * scene.environmentIntensity = 1.2;
 */
export class EnvironmentTextureLoader extends Loader {
    constructor(renderer, options = {}) {
        super();

        this.textureLoader = new TextureLoader();
        this.textureLoader.setOptions(options);

        this.pmremGenerator = new PMREMGenerator(renderer);
        this.pmremGenerator.compileEquirectangularShader();
    }

    load(path, callback) {
        this.textureLoader.load(path, texture => {
            if (texture instanceof Error) {
                throw new Error(texture);
            }

            const renderTargetCube = this.pmremGenerator.fromEquirectangular(texture);

            texture.dispose();

            this.increment();

            if (callback) {
                callback(renderTargetCube.texture);
            }
        });

        this.total++;
    }

    getPath(path) {
        return this.textureLoader.getPath(path);
    }

    setPath(path) {
        return this.textureLoader.setPath(path);
    }

    setCrossOrigin(crossOrigin) {
        return this.textureLoader.setCrossOrigin(crossOrigin);
    }

    setFetchOptions(fetchOptions) {
        return this.textureLoader.setFetchOptions(fetchOptions);
    }

    destroy() {
        this.pmremGenerator.dispose();
        this.textureLoader.destroy();

        return super.destroy();
    }
}
