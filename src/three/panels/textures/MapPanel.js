/**
 * @author pschroen / https://ufo.ai/
 */

import { Texture } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { WrapOptions } from '../Options.js';

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
                    let texture;

                    if (value) {
                        texture = new Texture(value);
                        texture.needsUpdate = true;
                    } else {
                        texture = null;
                    }

                    if (mesh.material.map) {
                        mesh.material.map.dispose();
                    }

                    mesh.material.map = texture;
                    mesh.material.needsUpdate = true;

                    const mapItems = [];

                    if (mesh.material.map) {
                        const repeatItems = [
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
                        ];

                        mapItems.push(
                            {
                                type: 'spacer'
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
                                callback: (value, panel) => {
                                    if (!panel.group) {
                                        const repeatPanel = new Panel();
                                        repeatPanel.animateIn(true);

                                        repeatItems.forEach(data => {
                                            repeatPanel.add(new PanelItem(data));
                                        });

                                        panel.setContent(repeatPanel);
                                    }

                                    const wrapping = WrapOptions[value];

                                    mesh.material.map.wrapS = wrapping;
                                    mesh.material.map.wrapT = wrapping;
                                    mesh.material.map.needsUpdate = true;

                                    if (value === 'Repeat' || value === 'Mirror') {
                                        panel.group.show();
                                    } else {
                                        panel.group.hide();
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

                    panel.setContent(mapPanel);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
