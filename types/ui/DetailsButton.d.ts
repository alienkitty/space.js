import { Interface } from '../utils/Interface.js';

export interface DetailsButtonData {
    number: number;
    total: number;
}

/**
 * Details toggle button.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/DetailsButton.js | Source}
 */
export class DetailsButton extends Interface {
    width: number;
    height: number;
    x: number;
    y: number;
    radius: number;
    hoverRadius: number;
    openRadius: number;
    startAngle: number;
    endAngle: number;
    isOpen: boolean;
    animatedIn: boolean;
    hoveredIn: boolean;
    needsUpdate: boolean;

    props: {
        radius: number
    };

    canvas?: Interface;
    context?: CanvasRenderingContext2D;
    container?: Interface;
    number?: Interface;
    total?: Interface;

    constructor();

    init(): void;

    initCanvas(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    setData(data: Partial<DetailsButtonData>, fast?: boolean): void;

    resize(): void;

    update(): void;

    open(): void;

    close(): void;

    animateIn(): void;

    animateOut(): void;

    override destroy(): null;
}
