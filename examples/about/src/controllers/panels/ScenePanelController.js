import { Vector3 } from 'three';
import { MaterialsPanel, Point3D } from '@alienkitty/space.js/three';

import { CameraController } from '../world/CameraController.js';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();

        this.addListeners();
    }

    static initPanel() {
        const { darkPlanet, floatingCrystal, abstractCube } = this.view;

        const objects = [darkPlanet, floatingCrystal, abstractCube];

        objects.forEach(object => {
            const { geometry, material } = object.mesh;

            object.point = new Point3D(object.mesh, {
                name: material.name,
                type: geometry.type
            });
            object.add(object.point);

            const materialPanel = new MaterialsPanel(object.mesh, object.point);
            materialPanel.animateIn(true);

            object.point.setContent(materialPanel);
        });

        // Shrink tracker mesh to better match the visual size of the object
        floatingCrystal.point.mesh.scale.multiply(new Vector3(0.6, 1, 0.6));
        abstractCube.point.mesh.scale.multiplyScalar(0.9);

        // Debug
        // darkPlanet.point.setPanelIndex('Standard', 13);
        // darkPlanet.point.setPanelValue('UV', true);
        // darkPlanet.point.setPanelValue('UV', true, [['Standard', 13]]);
    }

    static addListeners() {
        Point3D.events.on('click', this.onClick);
    }

    // Event handlers

    static onClick = () => {
        if (CameraController.isAnimatingOut) {
            CameraController.isAnimatingOut = false;
        }
    };
}
