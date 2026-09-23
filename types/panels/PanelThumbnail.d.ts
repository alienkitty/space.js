import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

export type PanelThumbnailValue = HTMLImageElement | ImageBitmap | HTMLCanvasElement;

export interface PanelThumbnailOptions {
    name: string;
    data: any;
    value: PanelThumbnailValue;
    callback: (value: PanelThumbnailValue, target: PanelThumbnail) => void;
}

/**
 * A panel thumbnail.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/panels/PanelThumbnail.js | Source}
 */
export class PanelThumbnail extends Interface {
    private name: string;
    private data: any;
    private value: PanelThumbnailValue;
    private callback: (value: PanelThumbnailValue, target: PanelThumbnail) => void;

    private width: number;
    private diagonal: number;
    private lineOffset: number;

    private bounds: DOMRect | null;
    private origin: Vector2;
    private mouse: Vector2;
    private delta: Vector2;
    private thumbnails: { element: Element; bounds: DOMRect }[];
    private lastTime: number;
    private lastMouse: Vector2;
    private isDragging: boolean;
    private snapPosition: Vector2;
    private snapTarget: Vector2;
    private snapped: Element | null;
    private duplicate: Interface | null;

    private container?: Interface;
    private line?: Interface;
    private input?: Interface;
    private wrapper?: Interface;
    private group?: Interface;

    constructor(options: Partial<PanelThumbnailOptions>);

    private init(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private imageToCanvas(image: HTMLImageElement | ImageBitmap): HTMLCanvasElement;

    private loadFiles(files: File[]): Promise<void>;

    private onThumbnailDrop: (e: { element: Element; data: any; value: any }) => void;

    private onClick: (e: MouseEvent) => void;

    private onPointerDown: (e: PointerEvent) => void;

    private onPointerMove: (e: PointerEvent) => void;

    private onPointerUp: (e: PointerEvent) => void;

    private onKeyUp: (e: KeyboardEvent) => void;

    private onDragOver: (e: DragEvent) => void;

    private onDrop: (e: DragEvent) => void;

    private onChange: (e: Event) => void;

    private onUpdate: (e: any) => null;

    hasContent(): boolean;

    setContent(content: Interface): void;

    toggleContent(show: boolean): void;

    setData(data: any): void;

    setValue(value: PanelThumbnailValue, notify?: boolean): void;

    update(notify?: boolean): void;

    topLeftSnap(target: Vector2, bounds: DOMRect): boolean;

    snap(): void;

    override destroy(): null;
}
