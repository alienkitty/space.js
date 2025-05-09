/**
 * @author pschroen / https://ufo.ai/
 */

import { MathUtils, SRGBColorSpace, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { BackgroundMappingOptions, ColorSpaceOptions, WrapOptions } from '../Options.js';

import { TwoPI, getKeyByValue } from '../../../utils/Utils.js';

export class BackgroundMapPanel extends Panel {
    constructor(scene) {
        super();

        this.scene = scene;

        this.lastValue = this.scene.background;

        this.initPanel();
    }

    initPanel() {
        const scene = this.scene;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                flipY: true,
                data: scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture ? scene.background : {},
                value: scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture && scene.background.source.data,
                callback: (value, item) => {
                    const mapItems = [];

                    if (value) {
                        if (scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture) {
                            scene.background.dispose();
                            scene.background = new Texture(value);
                            scene.background.mapping = item.data.mapping;
                            scene.background.colorSpace = item.data.colorSpace;
                            scene.background.anisotropy = item.data.anisotropy;
                            scene.background.wrapS = item.data.wrapS;
                            scene.background.wrapT = item.data.wrapT;
                            scene.background.repeat.copy(item.data.repeat);
                        } else {
                            scene.background = new Texture(value);
                            scene.background.colorSpace = SRGBColorSpace;
                        }

                        scene.background.needsUpdate = true;
                    } else if (scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture) {
                        scene.background.dispose();
                        scene.background = this.lastValue;
                    }

                    item.setData(scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture ? scene.background : {});

                    if (scene.background && scene.background.isTexture && !scene.background.isRenderTargetTexture && !scene.background.isCubeTexture) {
                        mapItems.push(
                            {
                                type: 'spacer'
                            },
                            {
                                type: 'list',
                                name: 'Mapping',
                                list: BackgroundMappingOptions,
                                value: getKeyByValue(BackgroundMappingOptions, scene.background.mapping),
                                callback: (value, item) => {
                                    scene.background.mapping = BackgroundMappingOptions[value];
                                    scene.background.needsUpdate = true;

                                    switch (value) {
                                        case 'UV': {
                                            const mappingPanel = new Panel();
                                            mappingPanel.animateIn(true);

                                            const mappingItems = [
                                                {
                                                    type: 'divider'
                                                },
                                                {
                                                    type: 'list',
                                                    name: 'Color Space',
                                                    list: ColorSpaceOptions,
                                                    value: getKeyByValue(ColorSpaceOptions, scene.background.colorSpace),
                                                    callback: value => {
                                                        scene.background.colorSpace = ColorSpaceOptions[value];
                                                        scene.background.needsUpdate = true;
                                                    }
                                                },
                                                {
                                                    type: 'slider',
                                                    name: 'Anisotropy',
                                                    min: 1,
                                                    max: 16,
                                                    step: 1,
                                                    value: scene.background.anisotropy,
                                                    callback: value => {
                                                        scene.background.anisotropy = value;
                                                        scene.background.needsUpdate = true;
                                                    }
                                                },
                                                {
                                                    type: 'list',
                                                    name: 'Wrap',
                                                    list: WrapOptions,
                                                    value: getKeyByValue(WrapOptions, scene.background.wrapS),
                                                    callback: value => {
                                                        const wrapping = WrapOptions[value];

                                                        scene.background.wrapS = wrapping;
                                                        scene.background.wrapT = wrapping;
                                                        scene.background.needsUpdate = true;
                                                    }
                                                },
                                                {
                                                    type: 'slider',
                                                    name: 'U',
                                                    min: 1,
                                                    max: 16,
                                                    step: 1,
                                                    value: scene.background.repeat.x,
                                                    callback: value => {
                                                        scene.background.repeat.setX(value);
                                                    }
                                                },
                                                {
                                                    type: 'slider',
                                                    name: 'V',
                                                    min: 1,
                                                    max: 16,
                                                    step: 1,
                                                    value: scene.background.repeat.y,
                                                    callback: value => {
                                                        scene.background.repeat.setY(value);
                                                    }
                                                },
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
                                            ];

                                            mappingItems.forEach(data => {
                                                mappingPanel.add(new PanelItem(data));
                                            });

                                            item.setContent(mappingPanel);
                                            break;
                                        }
                                        default: {
                                            const mappingPanel = new Panel();
                                            mappingPanel.animateIn(true);

                                            const mappingItems = [
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
