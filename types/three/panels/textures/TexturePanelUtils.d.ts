import type { Material, Texture } from 'three';

import type { Panel } from '../../../panels/Panel.js';

/**
 * Texture map panel utility functions.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/textures/TexturePanelUtils.js | Source}
 */

export function setPanelTexture(panel: Panel, material: Material, texture: Texture, name: string, path?: [string, number][]): void;
