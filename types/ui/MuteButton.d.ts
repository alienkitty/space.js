import { Interface } from '../utils/Interface.js';

export interface MuteButtonOptions {
    sound: boolean;
    callback: (sound: boolean, target: MuteButton) => void;
}

/**
 * Mute toggle button.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/MuteButton.js | Source}
 */
export class MuteButton extends Interface {
    private sound: boolean;
    private callback: (sound: boolean, target: MuteButton) => void;

    private width: number;
    private height: number;
    private animatedIn: boolean;
    private needsUpdate: boolean;

    private props: {
        yMultiplier: number;
        progress: number;
    };

    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;

    constructor(options: Partial<MuteButtonOptions>);

    private init(): void;

    private initCanvas(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setSound(sound: boolean): void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
