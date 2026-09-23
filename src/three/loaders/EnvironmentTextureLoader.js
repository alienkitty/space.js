/**
 * @author pschroen / https://ufo.ai/
 */

import { PMREMGenerator } from 'three';

import { TextureLoader } from './TextureLoader.js';
import { Loader } from '../../loaders/Loader.js';

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
        this.textureLoader.setPath(path);

        return this;
    }

    setCrossOrigin(crossOrigin) {
        this.textureLoader.setCrossOrigin(crossOrigin);

        return this;
    }

    setFetchOptions(fetchOptions) {
        this.textureLoader.setFetchOptions(fetchOptions);

        return this;
    }

    destroy() {
        this.pmremGenerator.dispose();
        this.textureLoader.destroy();

        return super.destroy();
    }
}
