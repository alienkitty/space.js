import { Loader } from './Loader.js';

/**
 * A multi-loader.
 *
 * @example
 * const assetLoader = new AssetLoader();
 * assetLoader.setPath('/');
 * assetLoader.cache = true;
 * assetLoader.loadAll([
 *     'assets/images/alienkitty.svg',
 *     'assets/sounds/gong.mp3'
 * ]);
 *
 * const loader = new MultiLoader();
 * loader.events.on('progress', onProgress);
 * loader.events.on('complete', onComplete);
 * loader.load(assetLoader);
 * loader.add(3);
 *
 * // ...
 * loader.trigger(1);
 *
 * // ...
 * loader.trigger(1);
 *
 * // ...
 * loader.trigger(1);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/MultiLoader.js | Source}
 */
export class MultiLoader extends Loader {
    private loaders: Loader[];
    private weights: number[];

    override load(loader: Loader, weight?: number): void;

    private onProgress: (e: { progress: number }) => void;

    private onComplete: () => void;

    override destroy(): null;
}
