import { Interface } from '../utils/Interface.js';

export interface DetailsButtonData {
    number?: number;
    total?: number;
}

/**
 * Details toggle button.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsButton.js | Source}
 */
export class DetailsButton extends Interface {
    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private radius: number;
    private hoverRadius: number;
    private openRadius: number;
    private startAngle: number;
    private endAngle: number;
    private isOpen: boolean;
    private animatedIn: boolean;
    private hoveredIn: boolean;
    private needsUpdate: boolean;

    private props: {
        radius: number
    };

    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;
    private container?: Interface;
    private number?: Interface;
    private total?: Interface;

    constructor();

    private init(): void;

    private initCanvas(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    setData(data: DetailsButtonData, fast?: boolean): void;

    resize(): void;

    update(): void;

    open(): void;

    close(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
