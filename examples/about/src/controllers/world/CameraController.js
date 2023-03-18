export class CameraController {
    static init(camera) {
        this.camera = camera;
    }

    /**
     * Public methods
     */

    static resize = (width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    static update = () => {
    };
}
