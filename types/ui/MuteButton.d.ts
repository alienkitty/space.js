import { Interface } from '../utils/Interface.js';

export interface MuteButtonUpdateEvent {
    sound: boolean;
    target: MuteButton;
}

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
    sound: boolean;
    callback: (sound: boolean, target: MuteButton) => void;

    width: number;
    height: number;
    animatedIn: boolean;
    needsUpdate: boolean;

    props: {
        yMultiplier: number;
        progress: number;
    };

    canvas?: Interface;
    context?: CanvasRenderingContext2D;

    constructor(options: Partial<MuteButtonOptions>);

    init(): void;

    initCanvas(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setSound(sound: boolean): void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
