import { MaterialOptions, MaterialPanelController, Point3D } from '@alienkitty/space.js/three';

import { MeshTransmissionMaterial } from '@alienkitty/alien.js/three';

import { TransmissionMaterialPanel } from './TransmissionMaterialPanel.js';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();
    }

    static initPanel() {
        // https://threejs.org/docs/scenes/material-browser.html
        const materialOptions = {
            Basic: MaterialOptions.Basic,
            Lambert: MaterialOptions.Lambert,
            Matcap: MaterialOptions.Matcap,
            Phong: MaterialOptions.Phong,
            Toon: MaterialOptions.Toon,
            Standard: MaterialOptions.Standard,
            Physical: MaterialOptions.Physical,
            Transmission: [MeshTransmissionMaterial, TransmissionMaterialPanel],
            Normal: MaterialOptions.Normal
        };

        const objects = [this.view];

        objects.forEach(object => {
            const { geometry, material } = object.mesh;

            object.point = new Point3D(object.mesh, {
                name: material.name,
                type: geometry.type
            });
            object.add(object.point);

            MaterialPanelController.init(object.point, object.mesh, materialOptions);
        });
    }
}
