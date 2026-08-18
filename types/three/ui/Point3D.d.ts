import { Group, Matrix4, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, TextureLoader, Vector2 } from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';

import type { Object3D, PerspectiveCamera, Scene, Sphere, Texture, WebGLRenderer } from 'three';
import type { OimoPhysics } from '@alienkitty/alien.js/three/oimophysics';

import { EventEmitter } from '../../utils/EventEmitter.js';
import { Interface } from '../../utils/Interface.js';
import { RadialGraphTracker } from '../../ui/RadialGraphTracker.js';
import { ReticleCanvas } from '../../ui/ReticleCanvas.js';
import { LineCanvas } from '../../ui/LineCanvas.js';
import { Tracker } from '../../ui/Tracker.js';
import { Point } from '../../ui/Point.js';
import { PanelItem } from '../../panels/PanelItem.js';

import type { Tween } from '../../tween/Tween.js';
import type { AssetData } from '../../loaders/FileUtils.js';
import type { ColorPicker } from '../../panels/ColorPicker.js';
import type { PanelThumbnail } from '../../panels/PanelThumbnail.js';
import type { RadialGraphCanvasInstance } from '../../ui/RadialGraphContainer.js';
import type { PointData } from '../../ui/Point.js';
import type { TrackerData } from '../../ui/Tracker.js';

export interface Point3DInitOptions {
    root: Interface;
    container: Interface;
    breakpoint: number;
    headerSnap: boolean;
    dividerSnap: boolean;
    physics: OimoPhysics | null;
    textureLoader: TextureLoader;
    hdrLoader: HDRLoader;
    uvTexturePath: string;
    uvHelper: boolean;
    debug: boolean;
}

export interface Point3DOptions {
    name: string;
    type: string;
    graph: RadialGraphCanvasInstance | null;
    noLine: boolean;
    noTracker: boolean;
    noPoint: boolean;
}

export type Point3DData = PointData & TrackerData & {
    index: number;
};

/**
 * A UI and panel container for various components with screen space tracking.
 *
 * @example
 * // ...
 * Point3D.init(renderer, scene, camera);
 *
 * const point = new Point3D(mesh);
 * scene.add(point);
 *
 * const materialPanel = new MaterialsPanel(mesh, point);
 * materialPanel.animateIn(true);
 *
 * point.setContent(materialPanel);
 *
 * @example
 * // ...
 * const point = new Point3D(mesh, {
 *     type: '',
 *     noTracker: true
 * });
 * scene.add(point);
 *
 * @example
 * // ...
 * const point = new Point3D(points, {
 *     name: '',
 *     type: '',
 *     noLine: true,
 *     noPoint: true
 * });
 * scene.add(point);
 * // ...
 * point.setData({ name: '127.0.0.1' });
 *
 * @example
 * // ...
 * const point = new Point3D(mesh, { graph });
 * point.setData({
 *     name: '127.0.0.1',
 *     type: 'localhost'
 * });
 * scene.add(point);
 *
 * @example
 * // ...
 * const item = new PanelItem({
 *     // ...
 * });
 * point.addPanel(item);
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/ui/Point3D.js | Source}
 */
export class Point3D extends Group {
    static events: EventEmitter;
    static renderer: WebGLRenderer;
    static scene: Scene;
    static camera: PerspectiveCamera;
    static root: Interface;
    static container: Interface;
    static breakpoint: number;
    static headerSnap: boolean;
    static dividerSnap: boolean;
    static physics: OimoPhysics | null;
    static textureLoader: TextureLoader;
    static hdrLoader: HDRLoader;
    static uvTexturePath: string;
    static uvHelper: boolean;
    static debug: boolean;

    static raycaster: Raycaster;
    static raycastInterval: number;
    static lastRaycast: number;

    static objects: Object3D[];
    static points: Point3D[];
    static multiple: Point3D[];
    static index: number | null;
    static lastIndex: number | null;
    static mouse: Vector2;
    static delta: Vector2;
    static coords: Vector2;
    static hover: Point3D | null;
    static click: Point3D | null;
    static lastTime: number;
    static lastMouse: Vector2;
    static lastCursor: string;
    static halfScreen: Vector2;
    static anisotropy: number;
    static uvTexture: Texture | null;
    static windowSnapMarginTop: number;
    static windowSnapMarginLeft: number;
    static windowSnapTop: number;
    static openColor: ColorPicker | null;
    static isDragging: boolean;
    static enabled: boolean;
    static hoverEnabled: boolean;

    static canvas?: Interface;
    static context?: CanvasRenderingContext2D;

    static init(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera,
        options?: Partial<Point3DInitOptions>
    ): void;

    static initCanvas(): void;

    static initTextures(): void;

    static addListeners(): void;

    static removeListeners(): void;

    static onColorPicker: (e: { open: boolean; target: ColorPicker }) => void;

    static onThumbnailDragging: (e: { dragging: boolean, target: PanelThumbnail }) => void;

    static onInvert: () => void;

    static onImagesDrop: (e: { data: AssetData[] }) => void;

    static onDragOver: (e: DragEvent) => void;

    static onDrop: (e: DragEvent) => void;

    static onResize: () => void;

    static onPointerDown: (e: PointerEvent) => void;

    static onPointerMove: (e: PointerEvent) => void;

    static onPointerUp: (e: PointerEvent) => void;

    static onKeyUp: (e: KeyboardEvent) => void;

    static setCamera(camera: PerspectiveCamera): void;

    static getPoint(object: Object3D): Point3D;

    static getSelected(): Point3D[];

    static getCursor(): Point3D;

    static getMoved(): Point3D[];

    static getSnapped(): Point3D[];

    static getSnappedSorted(): Point3D[];

    static getMultipleName(): string;

    static getMultipleTypes(): string;

    static getMultipleTargetNumbers(): number[];

    static setIndexes(): void;

    static setCursor(cursor: string): void;

    static update(time: number): void;

    static add(...points: Point3D[]): void;

    static remove(...points: Point3D[]): void;

    static animateOut(): void;

    static destroy(): null;

    static getTexture: (path: string, callback: (texture: Texture) => void) => Texture;

    static loadTexture: (path: string) => Promise<Texture>;

    static loadHDRTexture: (path: string) => Promise<Texture>;

    object: Object3D;
    name: string;
    type: string;
    graph: RadialGraphCanvasInstance | null;
    noLine: boolean;
    noTracker: boolean;
    noPoint: boolean;
    isMesh: boolean;
    isInstanced: boolean;
    isPoints: boolean;
    isDefault: boolean;
    isMultiple: boolean;
    camera: PerspectiveCamera;
    halfScreen: Vector2;

    instances: Mesh[];
    center: Vector2;
    size: Vector2;
    selected: boolean;
    lastCursor: string;
    animatedIn: boolean;
    currentMaterialMap: Texture | null;
    uvTexture: Texture | null;
    snapPosition: Vector2;
    snapTarget: Vector2;
    snappedLeft: boolean;
    snappedRight: boolean;
    snapped: boolean;

    boundingSphere?: Sphere;
    geometry?: SphereGeometry;
    material?: MeshBasicMaterial;
    mesh?: Mesh;
    container?: Interface;
    reticle?: ReticleCanvas;
    line?: LineCanvas;
    tracker?: Tracker | RadialGraphTracker;
    point?: Point;
    timeout?: Tween;
    normalsHelper?: VertexNormalsHelper;
    tangentsHelper?: VertexTangentsHelper;

    constructor(object: Object3D, options: Partial<Point3DOptions>);

    initMesh(): void;

    initContainer(): void;

    initViews(): void;

    createMesh(): Mesh;

    removeMesh(mesh: Mesh): void;

    setInitialPosition(): void;

    removeListeners(): void;

    onHover: (e: { type: 'over' | 'out', isPoint: boolean }) => void;

    onClick: (multiple: boolean) => void;

    onCursor: (e: { cursor: string }) => void;

    onUpdate: (e: { path: [string, number][], value: any, index: number, target: Interface }) => void;

    setCamera(camera: PerspectiveCamera): void;

    setData(data: Point3DData): void;

    setIndex(index: number): void;

    setContent(content: Interface): void;

    addPanel(item: PanelItem): void;

    getPanelIndex(name: string): number | undefined;

    getPanelValue(name: string): any;

    setPanelIndex(name: string, index: number, notify?: boolean, path?: [string, number][]): void;

    setPanelValue(name: string, value: any, notify?: boolean, path?: [string, number][]): void;

    toggleNormalsHelper(show: boolean): void;

    toggleTangentsHelper(show: boolean): void;

    toggleUVHelper(show: boolean): void;

    theme(): void;

    update(): void;

    override updateMatrixWorld(force?: boolean): void;

    toggle(show: boolean, multiple: boolean): void;

    togglePoint(show: boolean, multiple: boolean): void;

    lock(): void;

    unlock(): void;

    show(): void;

    hide(): void;

    animateIn(reverse?: boolean): void;

    animateOut(fast?: boolean, callback?: boolean): void;

    deactivate(): void;

    snap(): void;

    destroy(): null;
}
