/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils, SRGBColorSpace, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, MappingOptions, WrapOptions } from '../Options.js';

import { TwoPI, getKeyByValue } from '../../../utils/Utils.js';

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
                            },
                            {
                                type: 'divider'
                            },
                            {
                                type: 'list',
                                name: 'Mapping',
                                list: MappingOptions,
                                value: getKeyByValue(MappingOptions, scene[key].mapping),
                                callback: (value, item) => {
                                    scene[key].mapping = MappingOptions[value];
                                    scene[key].needsUpdate = true;

                                    switch (value) {
                                        case 'UV': {
                                            const mappingPanel = new Panel();
                                            mappingPanel.animateIn(true);

                                            const mappingItems = [];

                                            if (key === 'background') {
                                                mappingItems.push(
                                                    {
                                                        type: 'divider'
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
                                                    }
                                                );
                                            } else {
                                                mappingItems.push(
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
                                                    }
                                                );
                                            }

                                            mappingItems.forEach(data => {
                                                mappingPanel.add(new PanelItem(data));
                                            });

                                            item.setContent(mappingPanel);
                                            break;
                                        }
                                        default: {
                                            const mappingPanel = new Panel();
                                            mappingPanel.animateIn(true);

                                            const mappingItems = [];

                                            if (key === 'background') {
                                                mappingItems.push(
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
                                                );
                                            } else {
                                                mappingItems.push(
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

                                            mappingItems.forEach(data => {
                                                mappingPanel.add(new PanelItem(data));
                                            });

                                            item.setContent(mappingPanel);
                                            break;
                                        }
                                    }
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
