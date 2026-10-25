import { EventEmitter } from './EventEmitter.js';

export type HandlerConstructor = (...args: any[]) => any;

export interface ThreadParams {
    imports: string[][];
    classes: ReturnType<HandlerConstructor>[];
    controller: [ReturnType<HandlerConstructor>, ...string[]];
    handlers: ReturnType<HandlerConstructor>[];
}

/**
 * Creates a shared worker cluster or individual worker with the given methods.
 *
 * @example
 * Thread.upload(loadImage);
 *
 * const image = await Thread.shared().loadImage({ path, fetchOptions, options });
 * console.log(image);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Thread.js | Source}
 */
export class Thread extends EventEmitter {
    static count: number;
    static params: ThreadParams;

    static upload(...objects: ReturnType<HandlerConstructor>[]): void;

    static shared(params?: Partial<ThreadParams>): Thread;

    constructor(params?: Partial<ThreadParams>);

    initWorker(
        imports: string[][],
        classes: ReturnType<HandlerConstructor>[],
        controller: [ReturnType<HandlerConstructor>, ...string[]],
        handlers: ReturnType<HandlerConstructor>[]
    ): void;

    createMethod(name: string): void;
    [key: string]: any;

    addListeners(): void;

    removeListeners(): void;

    onMessage: (e: MessageEvent) => void;

    send(name: string, message?: {}, callback?: () => void): void;

    destroy(): null;
}
