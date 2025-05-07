/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { SceneMapPanel } from '../textures/SceneMapPanel.js';

import { TwoPI, brightness } from '../../../utils/Utils.js';

export class BackgroundPanel extends Panel {
    constructor(scene, ui) {
        super();

        this.scene = scene;
        this.ui = ui;

        this.lastValue = this.scene.background;
        this.lastInvert = null;

        this.initPanel();

        if (this.scene.background && this.scene.background.isColor) {
            this.setInvert(this.scene.background);
        }
    }

    initPanel() {
        const scene = this.scene;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: scene.background,
                callback: value => {
                    if (scene.background && scene.background.isColor) {
                        scene.background.copy(value);

                        this.setInvert(value);
                    } else if (this.lastValue && this.lastValue.isColor) {
                        this.lastValue.copy(value);

                        this.setInvert(value);
                    }
                }
            },
            {
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new SceneMapPanel(scene);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
            {
                type: 'divider'
            },
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
        ];

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
