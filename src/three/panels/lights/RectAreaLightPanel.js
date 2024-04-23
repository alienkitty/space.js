/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { HelperOptions, VisibleOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class RectAreaLightPanel extends Panel {
    constructor(panel, light) {
        super();

        this.panel = panel;
        this.light = light;

        this.initPanel();
    }

    initPanel() {
        const light = this.light;

        // Defaults
        if (light.userData.helper === undefined) {
            light.userData.helper = false;
        }

        const lightItems = [
            {
                type: 'list',
                name: 'Helper',
                list: HelperOptions,
                value: getKeyByValue(HelperOptions, light.userData.helper),
                callback: value => {
                    light.userData.helper = HelperOptions[value];

                    this.panel.toggleRectAreaLightHelper(light, light.userData.helper);
                }
            },
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
            },
            {
                type: 'slider',
                name: 'Width',
                min: 0,
                max: 10,
                step: 0.1,
                value: light.width,
                callback: value => {
                    light.width = value;
                }
            },
            {
                type: 'slider',
                name: 'Height',
                min: 0,
                max: 10,
                step: 0.1,
                value: light.height,
                callback: value => {
                    light.height = value;
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
                callback: (value, panel) => {
                    if (!panel.group) {
                        const lightPanel = new Panel();
                        lightPanel.animateIn(true);

                        lightItems.forEach(data => {
                            lightPanel.add(new PanelItem(data));
                        });

                        panel.setContent(lightPanel);
                    }

                    light.visible = VisibleOptions[value];

                    if (light.visible) {
                        panel.group.show();
                    } else {
                        panel.group.hide();
                    }

                    if (light.helper) {
                        light.helper.visible = light.visible;
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
