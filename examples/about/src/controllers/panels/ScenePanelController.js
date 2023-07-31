import { Vector3 } from 'three';

import { MaterialOptions, MaterialPanelController, Point3D } from '@alienkitty/space.js/three';
import { MeshTransmissionDistortionMaterial, MeshTransmissionMaterial } from '@alienkitty/alien.js/three';

import { CameraController } from '../world/CameraController.js';
import { TransmissionMaterialPanel } from './TransmissionMaterialPanel.js';
import { TransmissionDistortionMaterialPanel } from './TransmissionDistortionMaterialPanel.js';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();

        this.addListeners();
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
            Distortion: [MeshTransmissionDistortionMaterial, TransmissionDistortionMaterialPanel],
            Normal: MaterialOptions.Normal
        };

        const { darkPlanet, floatingCrystal, abstractCube } = this.view;

        const objects = [darkPlanet, floatingCrystal, abstractCube];

        objects.forEach(object => {
            const { geometry, material } = object.mesh;

            object.point = new Point3D(object.mesh, {
                name: material.name,
                type: geometry.type
            });
            object.add(object.point);

            MaterialPanelController.init(object.mesh, object.point, {
                materialOptions
            });

            // Transmission defaults
            // object.mesh.userData.thickness = 0.1;
            // object.mesh.userData.backside = true;
            object.mesh.userData.thickness = 1;
            object.mesh.userData.backside = false;
            object.mesh.userData.backsideThickness = 3;
        });

        // Shrink tracker meshes a little bit
        floatingCrystal.point.mesh.scale.multiply(new Vector3(1, 0.9, 1));
        abstractCube.point.mesh.scale.multiplyScalar(0.9);
    }

    static addListeners() {
        Point3D.events.on('click', this.onClick);
    }

    /**
     * Event handlers
     */

    static onClick = () => {
        if (CameraController.isAnimatingOut) {
            CameraController.isAnimatingOut = false;
        }
    };
}
