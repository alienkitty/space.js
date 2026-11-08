import { Interface } from '../utils/Interface.js';
import { AudioButtonInfo } from './AudioButtonInfo.js';

export interface AudioButtonUpdateEvent {
    sound: boolean;
    target: AudioButton;
}

export interface AudioButtonOptions {
    sound: boolean;
    callback: (value: boolean, target: AudioButton) => void;
}

export interface AudioButtonData {
    name: string;
    title: string;
    image: HTMLImageElement;
    link: string;
}

/**
 * Audio toggle button.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/AudioButton.js | Source}
 */
export class AudioButton extends Interface {
    sound: boolean;
    callback: (value: boolean, target: AudioButton) => void;

    width: number;
    height: number;
    animatedIn: boolean;
    needsUpdate: boolean;

    props: {
        yMultiplier: number,
        progress: number
    };

    container?: Interface;
    canvas?: Interface;
    context?: CanvasRenderingContext2D;
    info?: AudioButtonInfo;

    constructor(options: Partial<AudioButtonOptions>);

    init(): void;

    initCanvas(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e?: MouseEvent) => void;

    onClick: (e?: MouseEvent) => void;

    setData(data: Partial<AudioButtonData>): void;

    setSound(sound: boolean): void;

    resize(): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
