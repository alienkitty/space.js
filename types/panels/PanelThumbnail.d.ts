import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';

import type { AssetData } from '../loaders/FileUtils.js';
import type { Point3D } from '../three/ui/Point3D.js';

export type PanelThumbnailValue = HTMLImageElement | ImageBitmap | HTMLCanvasElement;

export interface ImagesDropEvent {
    data: AssetData[];
    target: PanelThumbnail | Point3D;
}

export interface ThumbnailDraggingEvent {
    dragging: boolean;
    target: PanelThumbnail;
}

export interface ThumbnailDropEvent {
    element: HTMLDivElement;
    data: any;
    value: PanelThumbnailValue;
    target: PanelThumbnail;
}

export interface ThumbnailSnapEvent {
    element: HTMLDivElement;
    target: PanelThumbnail;
}

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
    name: string;
    data: any;
    value: PanelThumbnailValue;
    callback: (value: PanelThumbnailValue, target: PanelThumbnail) => void;

    width: number;
    diagonal: number;
    lineOffset: number;

    bounds: DOMRect | null;
    origin: Vector2;
    mouse: Vector2;
    delta: Vector2;
    thumbnails: { element: Element; bounds: DOMRect }[];
    lastTime: number;
    lastMouse: Vector2;
    isDragging: boolean;
    snapPosition: Vector2;
    snapTarget: Vector2;
    snapped: Element | null;
    duplicate: Interface | null;

    container?: Interface;
    line?: Interface;
    input?: Interface;
    wrapper?: Interface;
    group?: Interface;

    constructor(options: Partial<PanelThumbnailOptions>);

    init(): void;

    addListeners(): void;

    removeListeners(): void;

    imageToCanvas(image: HTMLImageElement | ImageBitmap): HTMLCanvasElement;

    loadFiles(files: File[]): Promise<void>;

    onThumbnailDrop: (e: { element: Element; data: any; value: any }) => void;

    onClick: (e: MouseEvent) => void;

    onPointerDown: (e: PointerEvent) => void;

    onPointerMove: (e: PointerEvent) => void;

    onPointerUp: (e: PointerEvent) => void;

    onKeyUp: (e: KeyboardEvent) => void;

    onDragOver: (e: DragEvent) => void;

    onDrop: (e: DragEvent) => void;

    onChange: (e: Event) => void;

    onUpdate: (e: any) => null;

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
