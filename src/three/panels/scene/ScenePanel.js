/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { TwoPI, brightness } from '../../../utils/Utils.js';

export class ScenePanel extends Panel {
    constructor(scene, ui) {
        super();

        this.scene = scene;
        this.ui = ui;

        this.lastInvert = null;

        this.initPanel();
        this.setInvert(this.scene.background);
    }

    initPanel() {
        const scene = this.scene;

        const items = [
            // TODO: Texture thumbnails
        ];

        if (scene.background) {
            items.push(
                {
                    type: 'divider'
                }
            );

            if (scene.background.isColor) {
                items.push(
                    {
                        type: 'color',
                        value: scene.background,
                        callback: value => {
                            scene.background.copy(value);

                            this.setInvert(value);
                        }
                    }
                );
            } else if (scene.background.isTexture) {
                // TODO: Fix CubeTexture backgroundBlurriness
                items.push(
                    {
                        type: 'slider',
                        name: 'Blur',
                        min: 0,
                        max: 1,
                        step: 0.01,
                        value: scene.backgroundBlurriness,
                        callback: value => {
                            scene.backgroundBlurriness = value;
                        }
                    },
                    {
                        type: 'slider',
                        name: 'Int',
                        min: 0,
                        max: 10,
                        step: 0.1,
                        value: scene.backgroundIntensity,
                        callback: value => {
                            scene.backgroundIntensity = value;
                        }
                    },
                    {
                        type: 'slider',
                        name: 'Rotate X',
                        min: 0,
                        max: 360,
                        step: 1,
                        value: MathUtils.radToDeg(scene.backgroundRotation.x + (scene.backgroundRotation.x < 0 ? TwoPI : 0)),
                        callback: value => {
                            scene.backgroundRotation.x = MathUtils.degToRad(value);
                        }
                    },
                    {
                        type: 'slider',
                        name: 'Rotate Y',
                        min: 0,
                        max: 360,
                        step: 1,
                        value: MathUtils.radToDeg(scene.backgroundRotation.y + (scene.backgroundRotation.y < 0 ? TwoPI : 0)),
                        callback: value => {
                            scene.backgroundRotation.y = MathUtils.degToRad(value);
                        }
                    },
                    {
                        type: 'slider',
                        name: 'Rotate Z',
                        min: 0,
                        max: 360,
                        step: 1,
                        value: MathUtils.radToDeg(scene.backgroundRotation.z + (scene.backgroundRotation.z < 0 ? TwoPI : 0)),
                        callback: value => {
                            scene.backgroundRotation.z = MathUtils.degToRad(value);
                        }
                    }
                );
            }
        }

        if (scene.environment) {
            items.push(
                {
                    type: 'divider'
                },
                {
                    type: 'slider',
                    name: 'Int',
                    min: 0,
                    max: 10,
                    step: 0.1,
                    value: scene.environmentIntensity,
                    callback: value => {
                        scene.environmentIntensity = value;
                    }
                },
                {
                    type: 'slider',
                    name: 'Rotate X',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.x + (scene.environmentRotation.x < 0 ? TwoPI : 0)),
                    callback: value => {
                        scene.environmentRotation.x = MathUtils.degToRad(value);
                    }
                },
                {
                    type: 'slider',
                    name: 'Rotate Y',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.y + (scene.environmentRotation.y < 0 ? TwoPI : 0)),
                    callback: value => {
                        scene.environmentRotation.y = MathUtils.degToRad(value);
                    }
                },
                {
                    type: 'slider',
                    name: 'Rotate Z',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.z + (scene.environmentRotation.z < 0 ? TwoPI : 0)),
                    callback: value => {
                        scene.environmentRotation.z = MathUtils.degToRad(value);
                    }
                }
            );
        }

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }

    // Public methods

    setInvert = value => {
        if (!this.ui) {
            return;
        }

        // Light colour is inverted
        const invert = brightness(value) > 0.6;

        if (invert !== this.lastInvert) {
            this.lastInvert = invert;

            this.ui.invert(invert);
        }
    };
}
