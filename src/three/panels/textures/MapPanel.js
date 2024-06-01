/**
 * @author pschroen / https://ufo.ai/
 */

import { ColorManagement, SRGBColorSpace, Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, WrapOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MapPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                value: mesh.material.map && mesh.material.map.image,
                callback: (value, panel) => {
                    const mapItems = [];

                    if (value) {
                        if (!mesh.material.map || value !== mesh.material.map.image) {
                            if (mesh.material.map) {
                                mesh.material.map.image = value;
                            } else {
                                mesh.material.map = new Texture(value);
                            }

                            if (ColorManagement.enabled) {
                                mesh.material.map.colorSpace = SRGBColorSpace;
                            }

                            mesh.material.map.needsUpdate = true;
                            mesh.material.needsUpdate = true;
                        }

                        mapItems.push(
                            {
                                type: 'spacer'
                            },
                            {
                                type: 'list',
                                name: 'Color Space',
                                list: ColorSpaceOptions,
                                value: getKeyByValue(ColorSpaceOptions, mesh.material.map.colorSpace),
                                callback: value => {
                                    mesh.material.map.colorSpace = ColorSpaceOptions[value];
                                    mesh.material.map.needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Anisotropy',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material.map.anisotropy,
                                callback: value => {
                                    mesh.material.map.anisotropy = value;
                                }
                            },
                            {
                                type: 'list',
                                name: 'Wrap',
                                list: WrapOptions,
                                value: getKeyByValue(WrapOptions, mesh.material.map.wrapS),
                                callback: value => {
                                    const wrapping = WrapOptions[value];

                                    mesh.material.map.wrapS = wrapping;
                                    mesh.material.map.wrapT = wrapping;
                                    mesh.material.map.needsUpdate = true;
                                }
                            },
                            {
                                type: 'slider',
                                name: 'X',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material.map.repeat.x,
                                callback: value => {
                                    mesh.material.map.repeat.setX(value);
                                }
                            },
                            {
                                type: 'slider',
                                name: 'Y',
                                min: 1,
                                max: 16,
                                step: 1,
                                value: mesh.material.map.repeat.y,
                                callback: value => {
                                    mesh.material.map.repeat.setY(value);
                                }
                            }
                        );
                    } else if (mesh.material.map) {
                        mesh.material.map.dispose();
                        mesh.material.map = null;
                        mesh.material.needsUpdate = true;
                    }

                    const mapPanel = new Panel();
                    mapPanel.animateIn(true);

                    mapItems.forEach(data => {
                        mapPanel.add(new PanelItem(data));
                    });

                    panel.setContent(mapPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
