/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { brightness } from '../../../utils/Utils.js';

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

        if (scene.background && scene.background.isColor) {
            items.push(
                {
                    type: 'divider'
                },
                {
                    type: 'color',
                    value: scene.background,
                    callback: value => {
                        scene.background.copy(value);

                        this.setInvert(value);
                    }
                }
            );
        }

        if (scene.environment) {
            items.push(
                {
                    type: 'divider'
                },
                {
                    type: 'slider',
                    name: 'Rotate X',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.x),
                    callback: value => {
                        value = MathUtils.degToRad(value);
                        scene.environmentRotation.x = value;
                    }
                },
                {
                    type: 'slider',
                    name: 'Rotate Y',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.y),
                    callback: value => {
                        value = MathUtils.degToRad(value);
                        scene.environmentRotation.y = value;
                    }
                },
                {
                    type: 'slider',
                    name: 'Rotate Z',
                    min: 0,
                    max: 360,
                    step: 1,
                    value: MathUtils.radToDeg(scene.environmentRotation.z),
                    callback: value => {
                        value = MathUtils.degToRad(value);
                        scene.environmentRotation.z = value;
                    }
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
