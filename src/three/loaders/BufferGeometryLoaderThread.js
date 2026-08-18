/**
 * @author pschroen / https://ufo.ai/
 */

import { Thread } from '../../utils/Thread.js';

import { absolute } from '../../utils/Utils.js';

export class BufferGeometryLoaderThread {
    static init() {
        Thread.upload(loadBufferGeometry);

        function loadBufferGeometry({ path, fetchOptions, id }) {
            fetch(path, fetchOptions).then(response => {
                return response.json();
            }).then(({ data }) => {
                const buffers = {};

                for (const key in data.attributes) {
                    buffers[key] = new Float32Array(data.attributes[key].array);
                }

                postMessage({ id, message: buffers });
            }).catch(error => {
                if (error instanceof Error) {
                    error = `${error.name}: ${error.message}`;
                }

                postMessage({ id, message: { error } });
            });
        }
    }

    static load(path, fetchOptions) {
        path = absolute(path);

        return Thread.shared().loadBufferGeometry({ path, fetchOptions });
    }
}
