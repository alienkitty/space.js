import type { BufferGeometry } from 'three';

/**
 * Buffer geometry loader worker.
 *
 * @example
 * BufferGeometryLoaderThread.init();
 *
 * const buffers = await BufferGeometryLoaderThread.load(path, fetchOptions);
 * console.log(buffers);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/BufferGeometryLoaderThread.js | Source}
 */
export class BufferGeometryLoaderThread {
    static init(): void;

    static load(path: string, fetchOptions: RequestInit): Promise<BufferGeometry>;
}
