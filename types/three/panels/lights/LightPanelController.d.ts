import { DirectionalLight, HemisphereLight, PointLight, RectAreaLight, SpotLight } from 'three';

import type { Light, Scene } from 'three';

import type { Panel } from '../../../panels/Panel.js';
import type { UI } from '../../../ui/UI.js';

export const LightOptions: Map<string, [Light, Panel]>;

export function getKeyByLight(lightOptions: Map<string, [Light, Panel]>, light: Light): string;

/**
 * Light panel controller for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/lights/LightPanelController.js | Source}
 */
export class LightPanelController {
    private scene: Scene;
    private ui: UI;

    private lights: Light[];

    static init(scene: Scene, ui?: UI): void;

    private static initPanel(): void;

    static toggleHemisphereLightHelper(light: HemisphereLight, show: boolean): void;

    static toggleDirectionalLightHelper(light: DirectionalLight, show: boolean): void;

    static togglePointLightHelper(light: PointLight, show: boolean): void;

    static toggleSpotLightHelper(light: SpotLight, show: boolean): void;

    static toggleRectAreaLightHelper(light: RectAreaLight, show: boolean): void;

    static update(): void;

    static destroy(): null;
}
