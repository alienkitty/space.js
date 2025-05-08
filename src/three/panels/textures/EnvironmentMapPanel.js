/**
 * @author pschroen / https://ufo.ai/
 */

import { EquirectangularReflectionMapping, MathUtils, SRGBColorSpace, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';

import { TwoPI } from '../../../utils/Utils.js';

export class EnvironmentMapPanel extends Panel {
    constructor(scene) {
        super();

        this.scene = scene;

        this.lastValue = this.scene.environment;

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
                data: scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture ? scene.environment : {},
                value: scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture && scene.environment.source.data,
                callback: (value, item) => {
                    const mapItems = [];

                    if (value) {
                        if (scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture) {
                            scene.environment.dispose();
                            scene.environment = new Texture(value);
                            scene.environment.mapping = item.data.mapping;
                            scene.environment.colorSpace = item.data.colorSpace;
                        } else {
                            scene.environment = new Texture(value);
                            scene.environment.mapping = EquirectangularReflectionMapping;
                            scene.environment.colorSpace = SRGBColorSpace;
                        }

                        scene.environment.needsUpdate = true;
                    } else if (scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture) {
                        scene.environment.dispose();
                        scene.environment = this.lastValue;
                    }

                    item.setData(scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture ? scene.environment : {});

                    if (scene.environment && scene.environment.isTexture && !scene.environment.isRenderTargetTexture) {
                        mapItems.push(
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
