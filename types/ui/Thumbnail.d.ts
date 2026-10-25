import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export type ThumbnailImage = HTMLImageElement | HTMLCanvasElement;

export interface ThumbnailUpdateEvent {
    image: ThumbnailImage;
    target: Thumbnail;
}

export interface ThumbnailClickEvent {
    target: Thumbnail;
}

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
    image: ThumbnailImage;
    width: number;
    height: number;
    snapMargin: number;
    position: 'tl' | 'tr' | 'br' | 'bl';
    noCanvas: boolean;
    callback: (value: ThumbnailImage, target: Thumbnail) => void;

    bounds: DOMRect | null;
    origin: Vector2;
    mouse: Vector2;
    delta: Vector2;
    lastTime: number;
    lastMouse: Vector2;
    lastOrigin: Vector2;
    snapPosition: Vector2;
    snapTarget: Vector2;
    windowSnapMargin: number;
    snappedTop: boolean;
    snappedRight: boolean;
    snappedBottom: boolean;
    snappedLeft: boolean;
    snapped: boolean;

    canvas?: Interface;
    context?: CanvasRenderingContext2D;
    wrapper?: Interface;

    constructor(data: Partial<ThumbnailData>);

    init(): void;

    initCanvas(): void;

    addListeners(): void;

    removeListeners(): void;

    loadFiles(files: File[]): Promise<void>;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    onDragOver: (e: DragEvent) => void;

    onDrop: (e: DragEvent) => void;

    setThumbnail(image: ThumbnailImage, noCanvas?: boolean): void;

    resize(width: number, height: number, dpr: number, breakpoint: number): void;

    update(): void;

    animateIn(delay?: number): void;

    animateOut(delay?: number): void;

    snap(): void;

    override destroy(): null;
}
