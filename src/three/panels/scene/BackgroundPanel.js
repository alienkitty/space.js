/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { BackgroundMapPanel } from '../textures/BackgroundMapPanel.js';

import { brightness } from '../../../utils/Utils.js';

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
                type: 'content',
                callback: (value, item) => {
                    const materialPanel = new BackgroundMapPanel(scene);
                    materialPanel.animateIn(true);

                    item.setContent(materialPanel);
                }
            },
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
