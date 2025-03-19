import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

import { isDebug, params } from '../../config/Config.js';

export class MarsPanel extends Panel {
    constructor(light, view) {
        super();

        this.light = light;
        this.view = view;

        this.initPanel();
    }

    initPanel() {
        const { mars } = this.view;

        const animateOptions = {
            Off: false,
            Animate: true
        };

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Speed',
                min: 0,
                max: 50,
                step: 0.1,
                value: params.speed,
                callback: value => {
                    params.speed = value;
                }
            },
            {
                type: 'list',
                name: 'Animate',
                list: animateOptions,
                value: getKeyByValue(animateOptions, params.animate),
                callback: value => {
                    params.animate = animateOptions[value];
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Hue',
                min: -180,
                max: 180,
                step: 1,
                value: mars.hue.value * 360,
                callback: value => {
                    mars.hue.value = value / 360;
                }
            },
            {
                type: 'slider',
                name: 'Saturate',
                min: -100,
                max: 100,
                step: 1,
                value: mars.saturation.value * 100,
                callback: value => {
                    mars.saturation.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Light',
                min: -100,
                max: 100,
                step: 1,
                value: mars.lightness.value * 100,
                callback: value => {
                    mars.lightness.value = value / 100;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Bright',
                min: -100,
                max: 100,
                step: 1,
                value: mars.brightness.value * 100,
                callback: value => {
                    mars.brightness.value = value / 100;
                }
            },
            {
                type: 'slider',
                name: 'Contrast',
                min: -100,
                max: 100,
                step: 1,
                value: mars.contrast.value * 100,
                callback: value => {
                    mars.contrast.value = value / 100;
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Normal X',
                min: -10,
                max: 10,
                step: 0.1,
                value: mars.mesh.material[0].normalScale.x,
                callback: value => {
                    mars.mesh.material.forEach(material => material.normalScale.x = value);
                }
            },
            {
                type: 'slider',
                name: 'Normal Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: mars.mesh.material[0].normalScale.y,
                callback: value => {
                    mars.mesh.material.forEach(material => material.normalScale.y = value);
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Light X',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.light.position.x,
                callback: value => {
                    this.light.position.x = value;
                }
            },
            {
                type: 'slider',
                name: 'Light Y',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.light.position.y,
                callback: value => {
                    this.light.position.y = value;
                }
            },
            {
                type: 'slider',
                name: 'Light Z',
                min: -10,
                max: 10,
                step: 0.1,
                value: this.light.position.z,
                callback: value => {
                    this.light.position.z = value;
                }
            },
            {
                type: 'spacer'
            },
            {
                type: 'link',
                value: 'Reset',
                callback: () => {
                    this.setPanelValue('Speed', 0.5);
                    this.setPanelValue('Animate', !isDebug);
                    this.setPanelValue('Hue', -2);
                    this.setPanelValue('Saturate', -6);
                    this.setPanelValue('Light', -3);
                    this.setPanelValue('Bright', 5);
                    this.setPanelValue('Contrast', 10);
                    this.setPanelValue('Normal X', 2);
                    this.setPanelValue('Normal Y', -2);
                    this.setPanelValue('Light X', -3);
                    this.setPanelValue('Light Y', 1.5);
                    this.setPanelValue('Light Z', -1.5);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
