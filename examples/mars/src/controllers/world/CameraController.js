import { MathUtils } from 'three';
import { clearTween, tween } from '@alienkitty/space.js/three';

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
        obliqueCameraControls,
        northPolarCameraControls,
        southPolarCameraControls,
        point1CameraControls,
        point2CameraControls,
        point3CameraControls,
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
        this.obliqueCameraControls = obliqueCameraControls;
        this.northPolarCameraControls = northPolarCameraControls;
        this.southPolarCameraControls = southPolarCameraControls;
        this.point1CameraControls = point1CameraControls;
        this.point2CameraControls = point2CameraControls;
        this.point3CameraControls = point3CameraControls;
        this.camera = camera;
        this.controls = controls;

        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.detailsOffsetX = 0;
        this.progress = 0;
        this.isDetailsOpen = false;
    }

    static transition(fast) {
        clearTween(this);

        if (fast) {
            this.camera.view.offsetX = this.isDetailsOpen ? this.offsetX + this.detailsOffsetX : this.offsetX;
            this.camera.view.offsetY = this.offsetY;
            this.camera.updateProjectionMatrix();
        } else {
            this.progress = 0;

            tween(this, { progress: 1 }, 2000, 'easeInOutSine', null, () => {
                this.camera.view.offsetX = MathUtils.lerp(
                    this.camera.view.offsetX,
                    this.isDetailsOpen ? this.offsetX + this.detailsOffsetX : this.offsetX,
                    this.progress
                );
                this.camera.view.offsetY = this.offsetY;
                this.camera.updateProjectionMatrix();
            });
        }
    }

    // Public methods

    static setCamera = (camera, controls) => {
        this.camera = camera;
        this.controls = controls;

        if (this.camera === this.obliqueCamera) {
            if (this.width < this.height) {
                this.offsetX = 0;
                this.offsetY = 50;
            } else {
                this.offsetX = 0;
                this.offsetY = 0;
            }
        } else if (this.camera === this.northPolarCamera) {
            if (this.width < this.height) {
                this.offsetX = 0;
                this.offsetY = 50;
            } else {
                this.offsetX = 0;
                this.offsetY = 0;
            }
        } else if (this.camera === this.southPolarCamera) {
            if (this.width < this.height) {
                this.offsetX = 0;
                this.offsetY = 50;
            } else {
                this.offsetX = 0;
                this.offsetY = 0;
            }
        } else if (this.camera === this.point1Camera) {
            if (this.width < this.height) {
                this.offsetX = -60;
                this.offsetY = 190;
            } else {
                this.offsetX = -110;
                this.offsetY = 240;
            }
        } else if (this.camera === this.point2Camera) {
            if (this.width < this.height) {
                this.offsetX = 0;
                this.offsetY = 0;
            } else {
                this.offsetX = 0;
                this.offsetY = 0;
            }
        } else if (this.camera === this.point3Camera) {
            if (this.width < this.height) {
                this.offsetX = 0;
                this.offsetY = 0;
            } else {
                this.offsetX = 0;
                this.offsetY = 0;
            }
        }

        this.camera.setViewOffset(
            this.width,
            this.height,
            this.isDetailsOpen ? this.offsetX + this.detailsOffsetX : this.offsetX,
            this.offsetY,
            this.width,
            this.height
        );
        this.camera.updateProjectionMatrix();
    };

    static setDetails = (open, fast) => {
        this.isDetailsOpen = open;

        this.transition(fast);
    };

    static resize = (width, height) => {
        this.width = width;
        this.height = height;
        this.detailsOffsetX = -width / 4;

        let offsetX;
        let offsetY;

        // Oblique camera
        this.obliqueCamera.aspect = width / height;

        if (width < height) {
            offsetX = 0;
            offsetY = 50;
            // this.obliqueCamera.position.set(0, 0, 4.5);
            this.obliqueCamera.position.set(-2.2, 0.9, 3.8);
        } else {
            offsetX = 0;
            offsetY = 0;
            // this.obliqueCamera.position.set(0, 0, 2.5);
            this.obliqueCamera.position.set(-1.3, 0.7, 2.015);
            // this.obliqueCamera.position.set(-1.3, 0.7, 11);
        }

        this.obliqueCamera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.obliqueCamera.updateProjectionMatrix();

        // North polar camera
        this.northPolarCamera.aspect = width / height;

        if (width < height) {
            offsetX = 0;
            offsetY = 50;
            this.northPolarCamera.position.set(0, 4.5, 0);
        } else {
            offsetX = 0;
            offsetY = 0;
            this.northPolarCamera.position.set(0, 2.5, 0);
        }

        this.northPolarCamera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.northPolarCamera.updateProjectionMatrix();

        // South polar camera
        this.southPolarCamera.aspect = width / height;

        if (width < height) {
            offsetX = 0;
            offsetY = 50;
            this.southPolarCamera.position.set(0, -4.5, 0);
        } else {
            offsetX = 0;
            offsetY = 0;
            this.southPolarCamera.position.set(0, -2.5, 0);
        }

        this.southPolarCamera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.southPolarCamera.updateProjectionMatrix();

        // Point of interest #1 camera
        this.point1Camera.aspect = width / height;

        if (width < height) {
            offsetX = -60;
            offsetY = 190;
            this.point1Camera.position.set(0, -0.25, 2.88);
        } else {
            offsetX = -110;
            offsetY = 240;
            this.point1Camera.position.set(0, -0.25, 1.6);
        }

        this.point1Camera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.point1Camera.updateProjectionMatrix();

        // Point of interest #2 camera
        this.point2Camera.aspect = width / height;

        if (width < height) {
            offsetX = 0;
            offsetY = 0;
            this.point2Camera.position.set(0, 0, 1.25);
        } else {
            offsetX = 0;
            offsetY = 0;
            this.point2Camera.position.set(0, 0, 1.25);
        }

        this.point2Camera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.point2Camera.updateProjectionMatrix();

        // Point of interest #3 camera
        this.point3Camera.aspect = width / height;

        if (width < height) {
            offsetX = 0;
            offsetY = 0;
            this.point3Camera.position.set(-0.62, 0, 1);
            this.point3Camera.rotation.y = MathUtils.degToRad(-10);
            this.point3Camera.rotation.z = MathUtils.degToRad(90);
        } else {
            offsetX = 0;
            offsetY = 0;
            this.point3Camera.position.set(-0.62, 0, 1);
            this.point3Camera.rotation.y = MathUtils.degToRad(-10);
            this.point3Camera.rotation.z = MathUtils.degToRad(90);
        }

        this.point3Camera.setViewOffset(
            width,
            height,
            this.isDetailsOpen ? offsetX + this.detailsOffsetX : offsetX,
            offsetY,
            width,
            height
        );
        this.point3Camera.updateProjectionMatrix();
    };

    static update = () => {
        this.obliqueCameraControls.update();
        // console.log('update', this.obliqueCameraControls.position);
    };

    static start = () => {
        if (isDebug) {
            return;
        }

        this.scene.backgroundIntensity = 10;
        this.camera.scale.z = -1;
        RenderManager.vlMaterial.uniforms.uTransition.value = true;
        RenderManager.vlMaterial.uniforms.uPower.value = 0.8;
        RenderManager.vlMaterial.uniforms.uAmount.value = 0.4;
    };

    static animateIn = () => {
        if (isDebug) {
            RenderManager.animatedIn = true;
            RenderManager.vlMaterial.uniforms.uTransition.value = false;
            RenderManager.vlMaterial.uniforms.uPower.value = RenderManager.glowPower;
            RenderManager.vlMaterial.uniforms.uAmount.value = RenderManager.glowAmount;
            return;
        }

        tween(this.camera.scale, { z: 1 }, 7000, 'easeInOutCubic', () => {
            RenderManager.animatedIn = true;
            RenderManager.vlMaterial.uniforms.uTransition.value = false;
            RenderManager.vlMaterial.uniforms.uPower.value = RenderManager.glowPower;
            RenderManager.vlMaterial.uniforms.uAmount.value = RenderManager.glowAmount;
        }, () => {
            const multiplier = 1 - this.camera.scale.z;

            this.scene.backgroundIntensity = Math.max(WorldController.backgroundIntensity, 10 * multiplier);
        });

        this.progress = 0;

        tween(this, { progress: 1 }, 7000, 'easeInOutCubic', 3500, null, () => {
            RenderManager.vlMaterial.uniforms.uPower.value = MathUtils.lerp(
                RenderManager.vlMaterial.uniforms.uPower.value,
                RenderManager.glowPower,
                this.progress
            );

            RenderManager.vlMaterial.uniforms.uAmount.value = MathUtils.lerp(
                RenderManager.vlMaterial.uniforms.uAmount.value,
                RenderManager.glowAmount,
                this.progress
            );
        });
    };
}
