import { Panel, PanelItem } from '@alienkitty/space.js/three';

export class TransmissionMaterialTransmissionPanel extends Panel {
    constructor(material) {
        super();

        this.material = material;

        this.initPanel();
    }

    initPanel() {
        const material = this.material;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Intensity',
                min: 0,
                max: 1,
                step: 0.01,
                value: material._transmission,
                callback: value => {
                    material._transmission = value;
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
                label: 'Thick',
                min: 0,
                max: 10,
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
                max: 10,
                step: 0.01,
                value: material.attenuationDistance,
                callback: value => {
                    material.attenuationDistance = value;
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
                label: 'Chroma',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.chromaticAberration,
                callback: value => {
                    material.chromaticAberration = value;
                }
            },
            {
                type: 'slider',
                label: 'Anisotropy',
                min: 0,
                max: 1,
                step: 0.01,
                value: material.anisotropy,
                callback: value => {
                    material.anisotropy = value;
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
