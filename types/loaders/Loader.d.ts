import { EventEmitter } from '../utils/EventEmitter.js';

/**
 * A base class for loaders based on the three.js `Cache` and `Loader` classes.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/Cache.js | three.js `Cache` Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/loaders/Loader.js | three.js `Loader` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/Loader.js | Source}
 */
export class Loader {
    events: EventEmitter;
    total: number;
    loaded: number;
    progress: number;
    path: string;
    crossOrigin: string;
    fetchOptions?: RequestInit;
    cache: boolean;
    files: Map<string, any>;

    promise: Promise<void>;

    load(...params: any[]): void;

    loadAsync(path: string): Promise<void>;

    loadAll(assets: string[]): void[];

    loadAllAsync(assets: string[]): Promise<void>[];

    increment(): void;

    complete(): void;

    add(num?: number): void;

    trigger(num?: number): void;

    ready(): Promise<void>;

    filter(callback: (file: [string, any]) => boolean, index?: number, files?: [string, any][]): Map<string, any>;

    getPath(path: string): string;

    setPath(path: string): this;

    setCrossOrigin(crossOrigin: string): this;

    setFetchOptions(fetchOptions: RequestInit): this;

    destroy(): null;
}
