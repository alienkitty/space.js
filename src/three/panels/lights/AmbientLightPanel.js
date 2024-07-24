/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { VisibleOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class AmbientLightPanel extends Panel {
    constructor(panel, light) {
        super();

        this.panel = panel;
        this.light = light;

        this.initPanel();
    }

    initPanel() {
        const light = this.light;

        const lightItems = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                name: 'Color',
                value: light.color,
                callback: value => {
                    light.color.copy(value);
                }
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 5,
                step: 0.05,
                value: light.intensity,
                callback: value => {
                    light.intensity = value;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Visible',
                list: VisibleOptions,
                value: getKeyByValue(VisibleOptions, light.visible),
                callback: (value, item) => {
                    if (!item.group) {
                        const lightPanel = new Panel();
                        lightPanel.animateIn(true);

                        lightItems.forEach(data => {
                            lightPanel.add(new PanelItem(data));
                        });

                        item.setContent(lightPanel);
                    }

                    light.visible = VisibleOptions[value];

                    if (light.visible) {
                        item.toggleContent(true);
                    } else {
                        item.toggleContent(false);
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
