import { Point3D, clearTween, delayedCall } from '@alienkitty/space.js/three';

export class CameraController {
    static init(
        polarCamera,
        obliqueCamera,
        isometricCamera,
        polarCameraControls,
        obliqueCameraControls,
        isometricCameraControls,
        camera,
        controls
    ) {
        this.polarCamera = polarCamera;
        this.obliqueCamera = obliqueCamera;
        this.isometricCamera = isometricCamera;
        this.polarCameraControls = polarCameraControls;
        this.obliqueCameraControls = obliqueCameraControls;
        this.isometricCameraControls = isometricCameraControls;
        this.camera = camera;
        this.controls = controls;

        this.isDown = false;
        this.isTransforming = false;
        this.isAnimatingOut = false;

        this.addListeners();
    }

    static addListeners() {
        // Polar camera
        this.polarCameraControls.addEventListener('change', this.onChange);
        this.polarCameraControls.addEventListener('start', this.onInteraction);
        this.polarCameraControls.addEventListener('end', this.onInteraction);

        // Oblique camera
        this.obliqueCameraControls.addEventListener('change', this.onChange);
        this.obliqueCameraControls.addEventListener('start', this.onInteraction);
        this.obliqueCameraControls.addEventListener('end', this.onInteraction);

        // Isometric camera
        this.isometricCameraControls.addEventListener('change', this.onChange);
        this.isometricCameraControls.addEventListener('start', this.onInteraction);
        this.isometricCameraControls.addEventListener('end', this.onInteraction);
    }

    // Event handlers

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

    // Public methods

    static setCamera = (camera, controls) => {
        this.camera = camera;
        this.controls = controls;
    };

    static resize = (width, height) => {
        // Polar camera
        this.polarCamera.aspect = width / height;
        this.polarCamera.updateProjectionMatrix();

        // Oblique camera
        this.obliqueCamera.aspect = width / height;
        this.obliqueCamera.updateProjectionMatrix();

        // Isometric camera
        const aspect = width / height;
        const distance = 2.5;

        this.isometricCamera.left = -distance * aspect;
        this.isometricCamera.right = distance * aspect;
        this.isometricCamera.top = distance;
        this.isometricCamera.bottom = -distance;
        this.isometricCamera.updateProjectionMatrix();
    };

    static update = () => {
        // Polar camera controls
        if (this.polarCameraControls.enabled) {
            this.polarCameraControls.update();
        }

        // Oblique camera controls
        if (this.obliqueCameraControls.enabled) {
            this.obliqueCameraControls.update();
        }

        // Isometric camera controls
        if (this.isometricCameraControls.enabled) {
            this.isometricCameraControls.update();
        }
    };
}
