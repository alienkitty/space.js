/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { EnvironmentMapPanel } from '../textures/EnvironmentMapPanel.js';

export class EnvironmentPanel extends Panel {
    constructor(scene) {
        super();

        this.scene = scene;

        this.initPanel();
    }

    initPanel() {
        const scene = this.scene;

        const items = [
            {
                type: 'content',
                callback: (value, item) => {
                    const scenePanel = new EnvironmentMapPanel(scene);
                    scenePanel.animateIn(true);

                    item.setContent(scenePanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
