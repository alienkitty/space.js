import type { Material } from 'three';

/**
 * A set of texture file utility functions.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/loaders/TextureFileUtils.js | Source}
 */

export function getMaterialName(materials: Material[], filename: string, index: number): string;

export function getTextureName(filename: string): string;

export function isCubeTextures(data: string[]): boolean;

export function sortCubeTextures(data: string[]): string[];
