export interface TickerCallback {
    (time: number, delta: number, frame: number): void;
    fps?: number;
    last?: number;
    frame?: number;
}

/**
 * A minimal requestAnimationFrame render loop with worker support.
 *
 * @example
 * ticker.add(onUpdate);
 * ticker.start();
 *
 * function onUpdate(time, delta, frame) {
 *     console.log(time, delta, frame);
 * }
 *
 * setTimeout(() => {
 *     ticker.remove(onUpdate);
 * }, 1000);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/tween/Ticker.js | Source}
 */
export class Ticker {
    private callbacks: TickerCallback[];
    private last: number;
    private time: number;
    private delta: number;
    private frame: number;
    private isAnimating: boolean;

    private requestId: any;

    constructor();

    private onTick: FrameRequestCallback | ((time: number) => void);

    add(callback: TickerCallback, fps?: number): void;

    remove(callback: TickerCallback): void;

    start(): void;

    stop(): void;

    setRequestFrame(request: (callback: FrameRequestCallback | ((time: number) => void)) => any): void;

    setCancelFrame(cancel: (id: any) => void): void;
}

export const ticker: Ticker;
