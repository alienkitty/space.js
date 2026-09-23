import { Loader } from './Loader.js';

/**
 * Loads an array buffer.
 *
 * @example
 * const loader = new BufferLoader();
 * const buffers = await loader.loadAllAsync(['assets/sounds/gong.mp3']);
 * console.log(buffers);
 *
 * @example
 * const loader = new BufferLoader();
 * await loader.loadAllAsync(['assets/sounds/gong.mp3']);
 * console.log(loader.files);
 *
 * @example
 * const loader = new BufferLoader();
 * loader.setPath('assets/sounds/');
 * await loader.loadAllAsync(['gong.mp3']);
 * console.log(loader.files);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/BufferLoader.js | Source}
 */
export class BufferLoader extends Loader {
    override load(path: string, callback: (buffer: ArrayBuffer) => void): void;
}
