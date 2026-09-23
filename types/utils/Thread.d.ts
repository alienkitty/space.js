import { EventEmitter } from './EventEmitter.js';

type HandlerConstructor = (...args: any[]) => any;

export interface ThreadParams {
    imports: string[][];
    classes: HandlerConstructor[];
    controller: [HandlerConstructor, ...string[]];
    handlers: HandlerConstructor[];
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

    static upload(...objects: HandlerConstructor[]): void;

    static shared(params?: Partial<ThreadParams>): Thread;

    constructor(params?: Partial<ThreadParams>);

    private initWorker(
        imports: string[][],
        classes: HandlerConstructor[],
        controller: [HandlerConstructor, ...string[]],
        handlers: HandlerConstructor[]
    ): void;

    private createMethod(name: string): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onMessage: (e: MessageEvent) => void;

    send(name: string, message?: {}, callback?: () => void): void;

    destroy(): null;
}
