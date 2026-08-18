import { Interface } from '../utils/Interface.js';
import { AudioButtonInfo } from './AudioButtonInfo.js';

export interface AudioButtonOptions {
    sound: boolean;
    callback: (value: boolean, target: AudioButton) => void;
}

export interface AudioButtonData {
    name?: string;
    title?: string;
    image?: HTMLImageElement;
    link?: string;
}

/**
 * Audio toggle button.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/AudioButton.js | Source}
 */
export class AudioButton extends Interface {
    private sound: boolean;
    private callback: (value: boolean, target: AudioButton) => void;

    private width: number;
    private height: number;
    private animatedIn: boolean;
    private needsUpdate: boolean;

    private props: {
        yMultiplier: number,
        progress: number
    };

    private container?: Interface;
    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;
    private info?: AudioButtonInfo;

    constructor(options: Partial<AudioButtonOptions>);

    private init(): void;

    private initCanvas(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setData(data: AudioButtonData): void;

    setSound(sound: boolean): void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
