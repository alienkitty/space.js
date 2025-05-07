/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/TextureLoader.js
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/CubeTextureLoader.js
 */

import { CubeTexture } from 'three';

import { Thread } from '../../utils/Thread.js';
import { ImageBitmapLoaderThread } from '../../loaders/ImageBitmapLoaderThread.js';
import { Loader } from '../../loaders/Loader.js';

/**
 * Creates a texture from a given source with worker support.
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
 */
export class CubeTextureLoader extends Loader {
    constructor() {
        super();

        this.defaultOptions = {
            imageOrientation: 'from-image',
            premultiplyAlpha: 'none',
            colorSpaceConversion: 'none',
            preserveData: false
        };

        this.options = this.defaultOptions;
    }

    load(paths, callback) {
        const texture = new CubeTexture();

        let loaded = 0;

        paths.forEach((path, i) => {
            const cached = this.files.get(path);

            let promise;

            if (cached) {
                promise = Promise.resolve(cached);
            } else {
                const params = {
                    imageOrientation: this.options.imageOrientation,
                    premultiplyAlpha: this.options.premultiplyAlpha,
                    colorSpaceConversion: this.options.colorSpaceConversion
                };

                if (Thread.handlers) {
                    promise = ImageBitmapLoaderThread.load(this.getPath(path), this.fetchOptions, params);
                } else {
                    promise = fetch(this.getPath(path), this.fetchOptions).then(response => {
                        return response.blob();
                    }).then(blob => {
                        return createImageBitmap(blob, params);
                    });
                }
            }

            promise.then(bitmap => {
                if (bitmap.error) {
                    throw new Error(bitmap.error);
                }

                texture.images[i] = bitmap;

                if (this.options.preserveData) {
                    if (this.cache) {
                        this.files.set(path, bitmap);
                    }
                }

                this.increment();

                if (++loaded === 6) {
                    texture.needsUpdate = true;

                    texture.onUpdate = () => {
                        if (!this.options.preserveData) {
                            texture.images.forEach(bitmap => bitmap.close());
                        }

                        texture.onUpdate = null;
                    };

                    if (callback) {
                        callback(texture);
                    }
                }
            }).catch(event => {
                this.increment();

                if (callback) {
                    callback(event);
                }
            });
        });

        this.total += 6;

        return texture;
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }
}
