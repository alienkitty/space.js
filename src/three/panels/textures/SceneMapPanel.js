/**
 * @author pschroen / https://ufo.ai/
 */

import { SRGBColorSpace, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, WrapOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class SceneMapPanel extends Panel {
    constructor(scene, key = 'background') {
        super();

        this.scene = scene;
        this.key = key;

        this.lastValue = this.scene[key];

        this.initPanel();
    }

    initPanel() {
        const scene = this.scene;
        const key = this.key;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                flipY: true,
                data: scene[key] && scene[key].isTexture ? scene[key] : {},
                value: scene[key] && scene[key].isTexture && scene[key].source.data,
                callback: (value, item) => {
                    const mapItems = [];

                    if (value) {
                        if (scene[key] && scene[key].isTexture) {
                            scene[key].dispose();
                            scene[key] = new Texture(value);
                            scene[key].colorSpace = item.data.colorSpace;
                            scene[key].anisotropy = item.data.anisotropy;
                            scene[key].wrapS = item.data.wrapS;
                            scene[key].wrapT = item.data.wrapT;
                            scene[key].repeat.copy(item.data.repeat);
                        } else {
                            scene[key] = new Texture(value);
                            scene[key].colorSpace = SRGBColorSpace;
                        }

                        scene[key].needsUpdate = true;
                    } else if (scene[key] && scene[key].isTexture) {
                        scene[key].dispose();
                        scene[key] = this.lastValue;
                    }

                    item.setData(scene[key] || {});

                    if (scene[key] && scene[key].isTexture) {
                        mapItems.push(
                            {
                                type: 'spacer'
                            },
                            {
                                type: 'list',
                                name: 'Color Space',
                                list: ColorSpaceOptions,
                                value: getKeyByValue(ColorSpaceOptions, scene[key].colorSpace),
                                callback: value => {
                                    scene[key].colorSpace = ColorSpaceOptions[value];
                                    scene[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Anisotropy',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: scene[key].anisotropy,
                                callback: value => {
                                    scene[key].anisotropy = value;
                                    scene[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'list',
                                name: 'Wrap',
                                list: WrapOptions,
                                value: getKeyByValue(WrapOptions, scene[key].wrapS),
                                callback: value => {
                                    const wrapping = WrapOptions[value];

                                    scene[key].wrapS = wrapping;
                                    scene[key].wrapT = wrapping;
                                    scene[key].needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'X',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: scene[key].repeat.x,
                                callback: value => {
                                    scene[key].repeat.setX(value);
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Y',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: scene[key].repeat.y,
                                callback: value => {
                                    scene[key].repeat.setY(value);
                                }
                            }
                        );
                    }

                    const mapPanel = new Panel();
                    mapPanel.animateIn(true);

                    mapItems.forEach(data => {
                        mapPanel.add(new PanelItem(data));
                    });

                    item.setContent(mapPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
