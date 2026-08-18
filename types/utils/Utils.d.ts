import type { RGB } from '../math/Color.js';

export interface GetConstructor {
	name: string;
	code: string;
	isInstance: boolean;
}

/**
 * A set of utility functions.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/src/math/MathUtils.js | three.js `MathUtils` Source}
 * @see {@link https://github.com/lo-th/uil | UIL}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Utils.js | Source}
 */

export const PI: number;
export const TwoPI: number;
export const PI90: number;
export const PI60: number;
export const Third: number;

export function degToRad(degrees: number): number;

export function radToDeg(radians: number): number;

export function isPowerOfTwo(value: number): number;

export function ceilPowerOfTwo(value: number): number;

export function floorPowerOfTwo(value: number): number;

export function clamp(value: number, min: number, max: number): number;

export function euclideanModulo(n: number, m: number): number;

export function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;

export function inverseLerp(x: number, y: number, value: number): number;

export function lerp(x: number, y: number, t: number): number;

export function step(edge: number, value: number): number;

export function smoothstep(x: number, min: number, max: number): number;

export function smootherstep(x: number, min: number, max: number): number;

export function parabola(x: number, k: number): number;

export function pcurve(x: number, a: number, b: number): number;

export function fract(value: number): number;

export function average(numbers: number[]): number;

export function rms(numbers: number[]): number;

export function median(numbers: number[]): number;

export function peaks(numbers: number[], windowSize: number, threshold: number): number[];

export function consecutive(numbers: number[]): number[];

export function shuffle<T>(array: T[]): T[];

export function randInt(low: number, high: number): number;

export function randFloat(low: number, high: number): number;

export function randFloatSpread(range: number): number;

export function headsTails<T>(heads?: T, tails?: T): T | number;

export function brightness(color: RGB): number;

export function basename(path: string, ext?: boolean): string;

export function extension(path: string): string;

export function absolute(path: string): string;

export function getKeyByValue<K, V>(map: Map<K, V>, searchValue: V): K | undefined;

export function getConstructor(object: any): GetConstructor;
