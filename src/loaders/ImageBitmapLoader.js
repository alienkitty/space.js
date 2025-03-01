/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js
 */

import { Thread } from '../utils/Thread.js';
import { ImageBitmapLoaderThread } from './ImageBitmapLoaderThread.js';
import { Loader } from './Loader.js';

/**
 * Creates a bitmap from a given source with worker support.
 * @example
 * const loader = new ImageBitmapLoader();
 * const bitmap = await loader.loadAsync(path, options, params);
 * console.log(bitmap);
 */
export class ImageBitmapLoader extends Loader {
    constructor() {
        super();

        this.defaultOptions = {
            imageOrientation: 'from-image',
            premultiplyAlpha: 'none',
            colorSpaceConversion: 'none'
        };

        this.options = this.defaultOptions;
    }

    load(path, callback) {
        const cached = this.files.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (Thread.handlers) {
            promise = ImageBitmapLoaderThread.load(this.getPath(path), this.fetchOptions, this.options);
        } else {
            promise = fetch(this.getPath(path), this.fetchOptions).then(response => {
                return response.blob();
            }).then(blob => {
                return createImageBitmap(blob, this.options);
            });
        }

        promise.then(bitmap => {
            if (bitmap.error) {
                throw new Error(bitmap.error);
            }

            if (this.cache) {
                this.files.set(path, bitmap);
            }

            this.increment();

            if (callback) {
                callback(bitmap);
            }
        }).catch(event => {
            this.increment();

            if (callback) {
                callback(event);
            }
        });

        this.total++;
    }

    setOptions(options) {
        this.options = Object.assign(this.defaultOptions, options);

        return this;
    }
}
