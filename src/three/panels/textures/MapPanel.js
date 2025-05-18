/**
 * @author pschroen / https://ufo.ai/
 */

import { NoColorSpace, Texture, UVMapping } from 'three';

import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { ColorSpaceOptions, RefractionMappingOptions, WrapOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MapPanel extends Panel {
    constructor(mesh, ui, key, mapping = UVMapping, colorSpace = NoColorSpace) {
        super();

        this.mesh = mesh;
        this.ui = ui;
        this.key = key;
        this.mapping = mapping;
        this.colorSpace = colorSpace;

        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[0];
        this.supported = false;
        this.initialized = false;

        this.initPanel();
    }

    initPanel() {
        if (Array.isArray(this.mesh.material)) {
            this.updateOptions();

            const items = [
                {
                    type: 'divider'
                },
                {
                    type: 'list',
                    name: 'Index',
                    list: this.options,
                    value: getKeyByValue(this.options, 0),
                    callback: (value, item) => {
                        const index = this.options.get(value);

                        const indexPanel = new Panel();
                        indexPanel.animateIn(true);

                        this.initThumbnailPanel(index, indexPanel, item);

                        item.setContent(indexPanel);
                    }
                }
            ];

            items.forEach(data => {
                this.add(new PanelItem(data));
            });
        } else {
            this.initThumbnailPanel(0, this);
        }
    }

    initThumbnailPanel(index, panel, parent) {
        this.update(index);

        const mesh = this.mesh;
        const ui = this.ui;
        const key = this.key;

        const material = this.material;

        let point;

        if (ui.constructor.points) {
            point = ui.constructor.getPoint(mesh);
        }

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'thumbnail',
                name: 'Map',
                data: this.supported ? this.textures[index] : {},
                value: this.supported ? this.thumbnails[index] : null,
                callback: (value, item) => {
                    const data = item.data;

                    const mapItems = [];

                    if (this.initialized) {
                        if (data.isTexture && data.userData.uv && !mesh.userData.uv) {
                            mesh.userData.uv = true;

                            if (point) {
                                point.toggleUVHelper(true);
                            }
                        }

                        if (point && point.uvTexture) {
                            if (value) {
                                if (material[key] && data.isTexture && !data.userData.uv) {
                                    mesh.userData.uv = false;
                                    point.toggleUVHelper(false);
                                }
                            } else if (material[key]) {
                                mesh.userData.uv = false;
                                point.toggleUVHelper(false);

                                if (material[key] && material[key].source.data) {
                                    item.setData(material[key]);
                                    item.setValue(material[key].source.data);
                                    return;
                                }
                            }
                        } else if (value) {
                            if (this.supported) {
                                material[key].dispose();
                                material[key] = value instanceof Texture ? value : new Texture(value);
                                material[key].mapping = data.mapping;
                                material[key].colorSpace = value instanceof Texture ? value.colorSpace : this.colorSpace;
                                material[key].anisotropy = data.anisotropy;
                                material[key].wrapS = data.wrapS;
                                material[key].wrapT = data.wrapT;
                                material[key].repeat.copy(data.repeat);
                            } else {
                                material[key] = value instanceof Texture ? value : new Texture(value);
                                material[key].mapping = this.mapping;
                                material[key].colorSpace = value instanceof Texture ? value.colorSpace : this.colorSpace;
                            }

                            material[key].needsUpdate = true;
                            material.needsUpdate = true;
                        } else if (this.supported) {
                            material[key].dispose();
                            material[key] = null;
                            material.needsUpdate = true;
                        }

                        this.update(index);

                        if (parent) {
                            this.updateOptions();

                            parent.setList(this.options);
                        }

                        item.setData(this.supported ? material[key] : {});
                        item.setValue(this.supported ? material[key].userData.thumbnail : null);
                    }

                    if (this.supported && !(key === 'envMap' && material.isMeshStandardMaterial)) {
                        if (material[key].mapping !== UVMapping) {
                            mapItems.push(
                                {
                                    type: 'spacer'
                                },
                                {
                                    type: 'list',
                                    name: 'Mapping',
                                    list: RefractionMappingOptions,
                                    value: getKeyByValue(RefractionMappingOptions, material[key].mapping),
                                    callback: value => {
                                        if (this.initialized) {
                                            material[key].mapping = RefractionMappingOptions.get(value);
                                            material[key].needsUpdate = true;
                                            material.needsUpdate = true;
                                        }
                                    }
                                }
                            );
                        } else {
                            mapItems.push(
                                {
                                    type: 'spacer'
                                },
                                {
                                    type: 'list',
                                    name: 'Color Space',
                                    list: ColorSpaceOptions,
                                    value: getKeyByValue(ColorSpaceOptions, material[key].colorSpace),
                                    callback: value => {
                                        if (this.initialized) {
                                            material[key].colorSpace = ColorSpaceOptions.get(value);
                                            material[key].needsUpdate = true;
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'Anisotropy',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].anisotropy,
                                    callback: value => {
                                        if (this.initialized) {
                                            material[key].anisotropy = value;
                                            material[key].needsUpdate = true;
                                        }
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'Wrap',
                                    list: WrapOptions,
                                    value: getKeyByValue(WrapOptions, material[key].wrapS),
                                    callback: value => {
                                        if (this.initialized) {
                                            const wrapping = WrapOptions.get(value);

                                            material[key].wrapS = wrapping;
                                            material[key].wrapT = wrapping;
                                            material[key].needsUpdate = true;
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'U',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].repeat.x,
                                    callback: value => {
                                        if (this.initialized) {
                                            material[key].repeat.setX(value);
                                        }
                                    }
                                },
                                {
                                    type: 'slider',
                                    name: 'V',
                                    min: 1,
                                    max: 16,
                                    step: 1,
                                    value: material[key].repeat.y,
                                    callback: value => {
                                        if (this.initialized) {
                                            material[key].repeat.setY(value);
                                        }
                                    }
                                }
                            );
                        }
                    }

                    const mapPanel = new Panel();
                    mapPanel.animateIn(true);

                    mapItems.forEach(data => {
                        mapPanel.add(new PanelItem(data));
                    });

                    item.setContent(mapPanel);

                    if (!this.initialized) {
                        this.initialized = true;
                    }
                }
            }
        ];

        items.forEach(data => {
            panel.add(new PanelItem(data));
        });
    }

    update(index) {
        this.materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
        this.material = this.materials[index];
        this.textures = this.materials.map(material => material[this.key]);
        this.thumbnails = this.textures.map(texture => texture && texture.source.data);

        const texture = this.textures[index];

        this.supported = !!(texture && texture.isTexture && !texture.isRenderTargetTexture && !texture.isCubeTexture);
        this.initialized = false;
    }

    updateOptions() {
        this.options = new Map(this.materials.map((material, i) => [material.name || (i + 1).toString(), i]));
    }
}
