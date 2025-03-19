import { tween } from '@alienkitty/space.js/three';

import { WorldController } from './WorldController.js';
import { RenderManager } from './RenderManager.js';

import { isDebug } from '../../config/Config.js';

export class CameraController {
    static init(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    // Public methods

    static resize = (width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        if (width < height) {
            // this.camera.position.z = 4.5;
            this.camera.position.set(-1, 2.4, 3.6);
        } else {
            // this.camera.position.z = 2.5;
            this.camera.position.set(-1.3, 0.7, 2);
        }
    };

    static update = () => {
    };

    static start = () => {
        if (isDebug) {
            return;
        }

        this.scene.backgroundIntensity = 10;
        this.camera.scale.z = -1;
        RenderManager.vlMaterial.uniforms.uTransition.value = true;
    };

    static animateIn = () => {
        if (isDebug) {
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
