import { MathUtils } from 'three';
import { clearTween, router, tween } from '@alienkitty/space.js/three';

import { WorldController } from './WorldController.js';
import { RenderManager } from './RenderManager.js';

import { isDebug } from '../../config/Config.js';

export class CameraController {
    static init(
        scene,
        obliqueCamera,
        northPolarCamera,
        southPolarCamera,
        point1Camera,
        point2Camera,
        point3Camera,
        camera,
        controls
    ) {
        this.scene = scene;
        this.obliqueCamera = obliqueCamera;
        this.northPolarCamera = northPolarCamera;
        this.southPolarCamera = southPolarCamera;
        this.point1Camera = point1Camera;
        this.point2Camera = point2Camera;
        this.point3Camera = point3Camera;
        this.camera = camera;
        this.controls = controls;

        this.offsetX = 0;
        this.progress = 0;
        this.isDetailsOpen = false;
    }

    static transition(fast) {
        clearTween(this);

        if (fast) {
            this.camera.view.offsetX = this.isDetailsOpen ? this.offsetX : 0;
            this.camera.updateProjectionMatrix();
        } else {
            this.progress = 0;

            tween(this, { progress: 1 }, 2000, 'easeInOutSine', null, () => {
                this.camera.view.offsetX = MathUtils.lerp(this.camera.view.offsetX, this.isDetailsOpen ? this.offsetX : 0, this.progress);
                this.camera.updateProjectionMatrix();
            });
        }
    }

    // Public methods

    static setCamera = (camera, controls) => {
        this.camera = camera;
        this.controls = controls;

        this.camera.view.offsetX = MathUtils.lerp(this.camera.view.offsetX, this.isDetailsOpen ? this.offsetX : 0, this.progress);
        this.camera.updateProjectionMatrix();
    };

    static setDetails = (open, fast) => {
        this.isDetailsOpen = open;

        this.transition(fast);
    };

    static resize = (width, height) => {
        this.offsetX = -width / 4;

        // Oblique camera
        this.obliqueCamera.aspect = width / height;
        this.obliqueCamera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.obliqueCamera.updateProjectionMatrix();

        if (width < height) {
            // this.obliqueCamera.position.z = 4.5;
            this.obliqueCamera.position.set(-1, 2.4, 3.6);
        } else {
            // this.obliqueCamera.position.z = 2.5;
            this.obliqueCamera.position.set(-1.3, 0.7, 2);
        }

        this.obliqueCamera.lookAt(this.scene.position);

        // North polar camera
        this.northPolarCamera.aspect = width / height;
        this.northPolarCamera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.northPolarCamera.updateProjectionMatrix();

        /* if (width < height) {
            // this.northPolarCamera.position.z = 4.5;
            this.northPolarCamera.position.set(-1, 2.4, 3.6);
        } else {
            // this.northPolarCamera.position.z = 2.5;
            this.northPolarCamera.position.set(-1.3, 0.7, 2);
        }

        this.northPolarCamera.lookAt(this.scene.position); */

        // South polar camera
        this.southPolarCamera.aspect = width / height;
        this.southPolarCamera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.southPolarCamera.updateProjectionMatrix();

        /* if (width < height) {
            // this.southPolarCamera.position.z = 4.5;
            this.southPolarCamera.position.set(-1, 2.4, 3.6);
        } else {
            // this.southPolarCamera.position.z = 2.5;
            this.southPolarCamera.position.set(-1.3, 0.7, 2);
        }

        this.southPolarCamera.lookAt(this.scene.position); */

        // Point of interest #1 camera
        this.point1Camera.aspect = width / height;
        this.point1Camera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.point1Camera.updateProjectionMatrix();

        /* if (width < height) {
            // this.point1Camera.position.z = 4.5;
            this.point1Camera.position.set(-1, 2.4, 3.6);
        } else {
            // this.point1Camera.position.z = 2.5;
            this.point1Camera.position.set(-1.3, 0.7, 2);
        }

        this.point1Camera.lookAt(this.scene.position); */

        // Point of interest #2 camera
        this.point2Camera.aspect = width / height;
        this.point2Camera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.point2Camera.updateProjectionMatrix();

        /* if (width < height) {
            // this.point2Camera.position.z = 4.5;
            this.point2Camera.position.set(-1, 2.4, 3.6);
        } else {
            // this.point2Camera.position.z = 2.5;
            this.point2Camera.position.set(-1.3, 0.7, 2);
        }

        this.point2Camera.lookAt(this.scene.position); */

        // Point of interest #3 camera
        this.point3Camera.aspect = width / height;
        this.point3Camera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.point3Camera.updateProjectionMatrix();

        /* if (width < height) {
            // this.point3Camera.position.z = 4.5;
            this.point3Camera.position.set(-1, 2.4, 3.6);
        } else {
            // this.point3Camera.position.z = 2.5;
            this.point3Camera.position.set(-1.3, 0.7, 2);
        }

        this.point3Camera.lookAt(this.scene.position); */
    };

    static update = () => {
        if (this.controls && this.controls.enabled) {
            this.controls.update();
            // console.log('update', this.camera.position);
        }
    };

    static start = () => {
        const { data } = router.get(location.pathname);

        if (isDebug || data.path === '/about') {
            return;
        }

        this.scene.backgroundIntensity = 10;
        this.camera.scale.z = -1;
        RenderManager.vlMaterial.uniforms.uTransition.value = true;
    };

    static animateIn = () => {
        const { data } = router.get(location.pathname);

        if (isDebug || data.path === '/about') {
            RenderManager.animatedIn = true;
            RenderManager.vlMaterial.uniforms.uTransition.value = false;
            return;
        }

        tween(this.camera.scale, { z: 1 }, 7000, 'easeInOutCubic', () => {
            RenderManager.animatedIn = true;
            RenderManager.vlMaterial.uniforms.uTransition.value = false;
        }, () => {
            this.scene.backgroundIntensity = Math.max(WorldController.backgroundIntensity, 10 * (1 - this.camera.scale.z));
        });
    };
}
