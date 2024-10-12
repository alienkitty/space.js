/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../utils/Thread.js';

import { absolute } from '../utils/Utils.js';

/**
 * Creates a bitmap from a given source with a worker.
 * @example
 * ImageBitmapLoaderThread.init();
 *
 * const bitmap = await ImageBitmapLoaderThread.load(path, options, params);
 * console.log(bitmap);
 */
export class ImageBitmapLoaderThread {
    static init() {
        Thread.upload(loadImage);

        function loadImage({ path, options, params, id }) {
            fetch(path, options).then(response => {
                return response.blob();
            }).then(blob => {
                return createImageBitmap(blob, params);
            }).then(bitmap => {
                postMessage({ id, message: bitmap }, [bitmap]);
            }).catch(error => {
                if (error instanceof Error) {
                    error = `${error.name}: ${error.message}`;
                }

                postMessage({ id, message: { error } });
            });
        }
    }

    static load(path, options, params) {
        path = absolute(path);

        return Thread.shared().loadImage({ path, options, params });
    }
}
