import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Point3D, clearTween, delayedCall } from '@alienkitty/space.js/three';

export class CameraController {
    static init(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.isDown = false;
        this.isTransforming = false;
        this.isAnimatingOut = false;

        this.addListeners();
    }

    static addListeners() {
        this.controls.addEventListener('change', this.onChange);
        this.controls.addEventListener('start', this.onInteraction);
        this.controls.addEventListener('end', this.onInteraction);
    }

    /**
     * Event handlers
     */

    static onChange = () => {
        if (this.isDown) {
            if (this.isTransforming) {
                return;
            }

            this.isTransforming = true;
            Point3D.enabled = false;

            clearTween(this.timeout);

            this.timeout = delayedCall(300, () => {
                if (!this.isAnimatingOut) {
                    return;
                }

                this.isAnimatingOut = false;
                Point3D.animateOut();
            });

            this.isAnimatingOut = true;
        }
    };

    static onInteraction = ({ type }) => {
        if (type === 'start') {
            this.isDown = true;
        } else {
            this.isDown = false;
            this.isTransforming = false;
            Point3D.enabled = true;
        }
    };

    /**
     * Public methods
     */

    static resize = (width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    static update = () => {
        this.controls.update();
    };
}
