/**
 * Image bitmap loader worker.
 *
 * @example
 * ImageBitmapLoaderThread.init();
 *
 * const bitmap = await ImageBitmapLoaderThread.load(path, fetchOptions, options);
 * console.log(bitmap);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/ImageBitmapLoaderThread.js | Source}
 */
export class ImageBitmapLoaderThread {
    static init(): void;

    static load(path: string, fetchOptions: RequestInit, options?: ImageBitmapOptions): Promise<ImageBitmap>;
}
