import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export type ThumbnailImage = HTMLImageElement | HTMLCanvasElement;

export interface ThumbnailData {
    image: ThumbnailImage;
    width: number;
    height: number;
    snapMargin: number;
    position: 'tl' | 'tr' | 'br' | 'bl';
    noCanvas: boolean;
    callback: (value: ThumbnailImage, target: Thumbnail) => void;
}

/**
 * Thumbnail.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Thumbnail.js | Source}
 */
export class Thumbnail extends Interface {
    private image: ThumbnailImage;
    private width: number;
    private height: number;
    private snapMargin: number;
    private position: 'tl' | 'tr' | 'br' | 'bl';
    private noCanvas: boolean;
    private callback: (value: ThumbnailImage, target: Thumbnail) => void;

    private bounds: DOMRect | null;
    private origin: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private lastTime: number;
    private lastMouse: Vector2;
    private lastOrigin: Vector2;
    private snapPosition: Vector2;
    private snapTarget: Vector2;
    private windowSnapMargin: number;
    private snappedTop: boolean;
    private snappedRight: boolean;
    private snappedBottom: boolean;
    private snappedLeft: boolean;
    private snapped: boolean;

    private canvas?: Interface;
    private context?: CanvasRenderingContext2D;
    private wrapper?: Interface;

    constructor(data: Partial<ThumbnailData>);

    private init(): void;

    private initCanvas(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private loadFiles(files: File[]): Promise<void>;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    private onDragOver: (e: DragEvent) => void;

    private onDrop: (e: DragEvent) => void;

    setThumbnail(image: ThumbnailImage, noCanvas?: boolean): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    update(): void;

    animateIn(delay?: number): void;

    animateOut(delay?: number): void;

    snap(): void;

    override destroy(): null;
}
