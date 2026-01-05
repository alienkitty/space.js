/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/TextureLoader.js
 */

import { Texture } from 'three';

import { Thread } from '../../utils/Thread.js';
import { ImageBitmapLoaderThread } from '../../loaders/ImageBitmapLoaderThread.js';
import { Loader } from '../../loaders/Loader.js';

/**
 * Creates a texture from a given source with worker support.
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
 * @example
 * const loader = new TextureLoader();
 * const loadTexture = path => loader.loadAsync(path);
 *
 * // ...
 * const map = await loadTexture('assets/images/alienkitty.svg');
 * map.minFilter = LinearFilter;
 * map.generateMipmaps = false;
 */
export class TextureLoader extends Loader {
    constructor() {
        super();

        this.defaultOptions = {
            imageOrientation: 'flipY',
            premultiplyAlpha: 'none',
            colorSpaceConversion: 'none',
            preserveData: false
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        const cached = this.files.get(path);

        let texture;
        let promise;

        if (cached && cached.isTexture) {
            texture = cached;

            this.increment();

            if (callback) {
                callback(texture);
            }
        } else {
            texture = new Texture();

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

                texture.image = bitmap;
                texture.needsUpdate = true;

                texture.onUpdate = () => {
                    if (!this.options.preserveData) {
                        bitmap.close();
                    }

                    texture.onUpdate = null;
                };

                this.increment();

                if (callback) {
                    callback(texture);
                }
            }).catch(event => {
                this.increment();

                if (callback) {
                    callback(event);
                }
            });

            if (this.cache) {
                this.files.set(path, texture);
            }
        }

        this.total++;

        return texture;
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }
}
