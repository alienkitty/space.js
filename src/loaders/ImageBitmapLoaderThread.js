/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../utils/Thread.js';

import { absolute } from '../utils/Utils.js';

export class ImageBitmapLoaderThread {
    static init() {
        Thread.upload(loadImage);

        function loadImage({ path, fetchOptions, options, id }) {
            fetch(path, fetchOptions).then(response => {
                return response.blob();
            }).then(blob => {
                return createImageBitmap(blob, options);
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

    static load(path, fetchOptions, options) {
        path = absolute(path);

        return Thread.shared().loadImage({ path, fetchOptions, options });
    }
}
