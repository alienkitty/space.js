import { Loader } from './Loader.js';

export type Asset = HTMLImageElement | object | string | ArrayBuffer;

/**
 * Loads various assets based on the file extension, plus helper methods for loading images and data.
 *
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
 *
 * @example
 * const loader = new AssetLoader();
 * const image = await loader.loadImage('assets/images/alienkitty.svg');
 * console.log(image);
 *
 * @example
 * const loader = new AssetLoader();
 * const data = await loader.loadData('assets/data/data.json');
 * console.log(data);
 *
 * @example
 * const loader = new AssetLoader();
 * const loadImage = path => loader.loadImage(path);
 *
 * // ...
 * const image = await loadImage('assets/images/alienkitty.svg');
 * console.log(image);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/AssetLoader.js | Source}
 */
export class AssetLoader extends Loader {
    override load(path: string, callback: (asset: Asset) => void): void;

    loadImage(path: string): Promise<HTMLImageElement>;

    loadData(path: string): Promise<object>;
}
