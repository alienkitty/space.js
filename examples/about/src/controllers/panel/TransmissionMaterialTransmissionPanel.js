import { Panel, PanelItem } from '@alienkitty/space.js/three';

export class TransmissionMaterialTransmissionPanel extends Panel {
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
                type: 'slider',
                label: 'Intensity',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material._transmission,
                callback: value => {
                    mesh.material._transmission = value;
                }
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: mesh.material.roughness,
                callback: value => {
                    mesh.material.roughness = value;
                }
            },
            {
                type: 'slider',
                label: 'Thick',
                min: 0,
                max: 10,
                step: 0.01,
                value: mesh.material.thickness,
                callback: value => {
                    mesh.material.thickness = value;
                }
            },
            {
                type: 'color',
                value: mesh.material.attenuationColor,
                callback: value => {
                    mesh.material.attenuationColor.copy(value);
                }
            },
            {
                type: 'slider',
                label: 'Distance',
                min: 0,
                max: 10,
                step: 0.01,
                value: mesh.material.attenuationDistance,
                callback: value => {
                    mesh.material.attenuationDistance = value;
                }
            },
            {
                type: 'slider',
                label: 'IOR',
                min: 1,
                max: 2.333,
                step: 0.01,
                value: mesh.material.ior,
                callback: value => {
                    mesh.material.ior = value;
                }
            },
            {
                type: 'slider',
                label: 'Reflect',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.reflectivity,
                callback: value => {
                    mesh.material.reflectivity = value;
                }
            },
            {
                type: 'slider',
                label: 'Chroma',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.chromaticAberration,
                callback: value => {
                    mesh.material.chromaticAberration = value;
                }
            },
            {
                type: 'slider',
                label: 'Anisotropy',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.material.anisotropy,
                callback: value => {
                    mesh.material.anisotropy = value;
                }
            }
            // TODO: Texture thumbnails
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
