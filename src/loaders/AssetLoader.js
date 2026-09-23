/**
 * @author pschroen / https://ufo.ai/
 */

import { Loader } from './Loader.js';

let _id = 0;

export class AssetLoader extends Loader {
    load(path, callback) {
        const cached = this.files.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (/\.jpe?g|png|webp|gif|svg/i.test(path)) {
            promise = this.loadImage(path);
        } else if (/\.json/i.test(path)) {
            promise = this.loadData(path);
        } else {
            promise = fetch(this.getPath(path), this.fetchOptions).then(response => {
                if (/\.mp3|m4a|ogg|wav|aiff|bin?/i.test(path)) {
                    return response.arrayBuffer();
                } else {
                    const contentType = response.headers.get('content-type');

                    if (contentType.includes('application/json')) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                }
            });
        }

        promise.then(data => {
            if (this.cache) {
                this.files.set(path, data);
            }

            this.increment();

            if (callback) {
                callback(data);
            }
        }).catch(event => {
            this.increment();

            if (callback) {
                callback(event);
            }
        });

        this.total++;
    }

    loadImage(path) {
        const image = new Image();

        const promise = new Promise((resolve, reject) => {
            image.onload = () => {
                resolve(image);

                image.onload = null;
            };

            image.onerror = event => {
                reject(event);

                image.onerror = null;
            };
        });

        image.crossOrigin = this.crossOrigin;
        image.src = this.getPath(path);

        return promise;
    }

    loadData(path) {
        const promise = fetch(`${this.getPath(path)}?${++_id}`, this.options).then(response => {
            return response.json();
        });

        return promise;
    }
}
