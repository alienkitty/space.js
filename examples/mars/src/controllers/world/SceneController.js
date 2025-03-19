import { defer } from '@alienkitty/space.js/three';

export class SceneController {
    static init(renderer, scene, camera, view) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;
    }

    // Public methods

    static resize = () => {
    };

    static update = () => {
        if (!this.view.visible) {
            return;
        }

        this.view.update();
    };

    static animateIn = () => {
        this.view.visible = true;
    };

    static async precompile() {
        this.view.visible = true;
        await defer();
        await this.renderer.compileAsync(this.view, this.camera, this.scene);
        this.view.visible = false;
    }

    static ready = () => this.view.ready();
}
