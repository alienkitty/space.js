import type { Texture } from 'three';

/**
 * Texture map thumbnail utility functions.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/MapPanelUtils.js | Source}
 */

export function getThumbnail(texture: Texture, size: number): HTMLImageElement;

export function getBallThumbnail(texture: Texture, size: number): HTMLImageElement;
