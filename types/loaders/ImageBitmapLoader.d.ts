import { Loader } from './Loader.js';

/**
 * Image bitmap loader with worker support based on the three.js `ImageBitmapLoader` class.
 *
 * @example
 * const loader = new ImageBitmapLoader();
 * const bitmap = await loader.loadAsync(path, fetchOptions, options);
 * console.log(bitmap);
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/ImageBitmapLoader.js | three.js `ImageBitmapLoader` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/ImageBitmapLoader.js | Source}
 */
export class ImageBitmapLoader extends Loader {
    private defaultOptions: ImageBitmapOptions;
    private options: ImageBitmapOptions;

    override load(path: string, callback: (bitmap: ImageBitmap) => void): void;

    setOptions(options: Partial<ImageBitmapOptions>): this;
}
