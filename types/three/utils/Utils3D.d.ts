/**
 * A set of three.js utility functions.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/utils/Utils3D.js | Source}
 */

import { Box2, BoxGeometry, BufferGeometry, Sphere, Vector2, Vector3, WebGLRenderTarget } from 'three';

import type { Mesh, PerspectiveCamera, RenderTargetOptions } from 'three';

export interface DoubleRenderTarget {
    read: WebGLRenderTarget;
    write: WebGLRenderTarget;
    swap: () => void;
    setSize: (wwidth: number, height: number) => void;
    dispose: () => void;
}

export function getFullscreenTriangle(): BufferGeometry;

export function getSphericalCube(radius?: number, segments?: number): BoxGeometry;

export function getFibonacciSphere(numPoints: number, i: number, radius?: number): Vector3;

export function getBoundingSphereWorld(mesh: Mesh): Sphere;

export function getScreenSpaceBox(mesh: Mesh, camera: PerspectiveCamera): Box2;

export function getViewSize(camera: PerspectiveCamera, offsetZ?: number): Vector2;

export function lerpCameras(camera1: PerspectiveCamera, camera2: PerspectiveCamera, alpha: number): void;

export function getDoubleRenderTarget(width?: number, height?: number, options?: RenderTargetOptions): DoubleRenderTarget;
