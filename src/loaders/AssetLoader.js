/**
 * @author pschroen / https://ufo.ai/
 */

import { Loader } from './Loader.js';

var id = 0;

/**
 * Creates various objects based on the file extension of a given source,
 * plus helper methods for loading images and data.
 * @example
 * const loader = new AssetLoader();
 * loader.setPath('/');
 * loader.cache = true;
 * loader.loadAll([
 *     'assets/images/alienkitty.svg',
 *     'assets/sounds/gong.mp3'
 * ]);
 *
 * await loader.ready();
 * console.log(loader.filter(([path, data]) => /sounds/.test(path)));
 * @example
 * const loader = new AssetLoader();
 * const image = await loader.loadImage('assets/images/alienkitty.svg');
 * console.log(image);
 * @example
 * const loader = new AssetLoader();
 * const data = await loader.loadData('assets/data/data.json');
 * console.log(data);
 * @example
 * const loader = new AssetLoader();
 * const loadImage = path => loader.loadImage(path);
 *
 * // ...
 * const image = await loadImage('assets/images/alienkitty.svg');
 * console.log(image);
 */
export class AssetLoader extends Loader {
    load(path, callback) {
        const cached = this.files.get(path);

        let promise;

        if (cached) {
            promise = Promise.resolve(cached);
        } else if (/\.(jpe?g|png|webp|gif|svg)/.test(path)) {
            promise = this.loadImage(path);
        } else if (/\.json/.test(path)) {
            promise = this.loadData(path);
        } else {
            promise = fetch(this.getPath(path), this.fetchOptions).then(response => {
                if (/\.(mp3|m4a|ogg|wav|aiff?)/.test(path)) {
                    return response.arrayBuffer();
                } else {
                    return response.text();
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

        image.crossOrigin = this.crossOrigin;
        image.src = this.getPath(path);

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

        return promise;
    }

    loadData(path) {
        const promise = fetch(`${this.getPath(path)}?${++id}`, this.options).then(response => {
            return response.json();
        });

        return promise;
    }
}
