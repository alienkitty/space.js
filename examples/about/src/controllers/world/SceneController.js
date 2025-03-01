import { defer } from '@alienkitty/space.js/three';

import { params } from '../../config/Config.js';

export class SceneController {
    static init(renderer, scene, camera, view) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;

        this.animatedOneFramePast = false;
    }

    // Public methods

    static toggle = show => {
        this.view.toggle(show);
    };

    static update = time => {
        if (!this.view.visible) {
            return;
        }

        if (params.animate || !this.animatedOneFramePast) {
            this.view.update(time);

            this.animatedOneFramePast = !params.animate;
        }
    };

    static animateIn = () => {
        this.view.animateIn();

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
