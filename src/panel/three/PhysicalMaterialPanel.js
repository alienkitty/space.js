/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel } from '../Panel.js';
import { PanelItem } from '../PanelItem.js';
import { FlatShadingOptions, WireframeOptions } from './MaterialPanelOptions.js';

import { getKeyByValue } from '../../utils/Utils.js';

export class PhysicalMaterialPanel extends Panel {
    static type = [
        'common',
        'standard',
        'physical'
    ];

    static properties = {
        common: [
            'color',
            'emissive',
            'flatShading',
            'wireframe'
        ],
        standard: [
            'roughness',
            'metalness'
        ],
        physical: [
            'specularColor',
            'specularIntensity',
            'ior',
            'reflectivity',
            'transmission',
            'thickness',
            'attenuationColor',
            'attenuationDistance',
            'clearcoat',
            'clearcoatRoughness',
            'sheen',
            'sheenRoughness',
            'sheenColor'
        ]
    };

    constructor(material) {
        super();

        this.material = material;

        this.initPanel();
    }

    initPanel() {
        const material = this.material;

        const transmissionItems = [
            {
                type: 'slider',
                label: 'Thick',
                min: 0,
                max: 5,
                step: 0.01,
                value: material.thickness,
                callback: value => {
                    material.thickness = value;
                }
            },
            {
                type: 'color',
                value: material.attenuationColor,
                callback: value => {
                    material.attenuationColor.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Distance',
                min: 0,
                max: 5,
                step: 0.01,
                value: material.attenuationDistance,
                callback: value => {
                    material.attenuationDistance = value;
                }
            }
        ];

        const clearcoatItems = [
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.clearcoatRoughness,
                callback: value => {
                    material.clearcoatRoughness = value;
                }
            }
        ];

        const sheenItems = [
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.sheenRoughness,
                callback: value => {
                    material.sheenRoughness = value;
                }
            },
            {
                type: 'color',
                value: material.sheenColor,
                callback: value => {
                    material.sheenColor.copy(value);
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'color',
                value: material.color,
                callback: value => {
                    material.color.copy(value);
                }
            },
            {
                type: 'color',
                value: material.emissive,
                callback: value => {
                    material.emissive.copy(value);
                }
            },
            {
                type: 'color',
                value: material.specularColor,
                callback: value => {
                    material.specularColor.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Specular',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.specularIntensity,
                callback: value => {
                    material.specularIntensity = value;
                }
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.roughness,
                callback: value => {
                    material.roughness = value;
                }
            },
            {
                type: 'slider',
                label: 'Metal',
                min: 0,
                max: 2,
                step: 0.01,
                value: material.metalness,
                callback: value => {
                    material.metalness = value;
                }
            },
            {
                type: 'slider',
                label: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: material.ior,
                callback: value => {
                    material.ior = value;
                }
            },
            {
                type: 'slider',
                label: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.reflectivity,
                callback: value => {
                    material.reflectivity = value;
                }
            },
            {
                type: 'slider',
                label: 'Trans',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.transmission,
                callback: (value, panel) => {
                    if (!panel.group) {
                        const transmissionPanel = new Panel();
                        transmissionPanel.animateIn(true);

                        transmissionItems.forEach(data => {
                            transmissionPanel.add(new PanelItem(data));
                        });

                        panel.setContent(transmissionPanel);
                    }

                    material.transmission = value;

                    if (material.transmission > 0) {
                        panel.group.show();
                    } else {
                        panel.group.hide();
                    }
                }
            },
            {
                type: 'slider',
                label: 'Clearcoat',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.clearcoat,
                callback: (value, panel) => {
                    if (!panel.group) {
                        const clearcoatPanel = new Panel();
                        clearcoatPanel.animateIn(true);

                        clearcoatItems.forEach(data => {
                            clearcoatPanel.add(new PanelItem(data));
                        });

                        panel.setContent(clearcoatPanel);
                    }

                    material.clearcoat = value;

                    if (material.clearcoat > 0) {
                        panel.group.show();
                    } else {
                        panel.group.hide();
                    }
                }
            },
            {
                type: 'slider',
                label: 'Sheen',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.sheen,
                callback: (value, panel) => {
                    if (!panel.group) {
                        const sheenPanel = new Panel();
                        sheenPanel.animateIn(true);

                        sheenItems.forEach(data => {
                            sheenPanel.add(new PanelItem(data));
                        });

                        panel.setContent(sheenPanel);
                    }

                    material.sheen = value;

                    if (material.sheen > 0) {
                        panel.group.show();
                    } else {
                        panel.group.hide();
                    }
                }
            },
            {
                type: 'list',
                list: FlatShadingOptions,
                value: getKeyByValue(FlatShadingOptions, material.flatShading),
                callback: value => {
                    material.flatShading = FlatShadingOptions[value];
                    material.needsUpdate = true;
                }
            },
            {
                type: 'list',
                list: WireframeOptions,
                value: getKeyByValue(WireframeOptions, material.wireframe),
                callback: value => {
                    material.wireframe = WireframeOptions[value];
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
