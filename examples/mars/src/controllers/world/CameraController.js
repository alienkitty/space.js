import { MathUtils } from 'three';
import { clearTween, router, tween } from '@alienkitty/space.js/three';

import { WorldController } from './WorldController.js';
import { RenderManager } from './RenderManager.js';

import { isDebug } from '../../config/Config.js';

export class CameraController {
    static init(scene, camera) {
        this.scene = scene;
        this.camera = camera;

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

    static setDetails = (open, fast) => {
        this.isDetailsOpen = open;

        this.transition(fast);
    };

    static resize = (width, height) => {
        this.offsetX = -width / 4;

        this.camera.aspect = width / height;
        this.camera.setViewOffset(width, height, this.isDetailsOpen ? this.offsetX : 0, 0, width, height);
        this.camera.updateProjectionMatrix();

        if (width < height) {
            // this.camera.position.z = 4.5;
            this.camera.position.set(-1, 2.4, 3.6);
        } else {
            // this.camera.position.z = 2.5;
            this.camera.position.set(-1.3, 0.7, 2);
        }

        this.camera.lookAt(this.scene.position);
    };

    static update = () => {
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
