export type TickerCallback = (time: number, delta: number, frame: number) => void;

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
    callbacks: TickerCallback[];
    last: number;
    time: number;
    delta: number;
    frame: number;
    isAnimating: boolean;

    requestId: number;

    constructor();

    onTick: FrameRequestCallback | ((time: number) => void);

    add(callback: TickerCallback, fps?: number): void;

    remove(callback: TickerCallback): void;

    start(): void;

    stop(): void;

    setRequestFrame(request: (callback: FrameRequestCallback | ((time: number) => void)) => number): void;

    setCancelFrame(cancel: (id: number) => void): void;
}

export const ticker: Ticker;
