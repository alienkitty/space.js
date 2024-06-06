import { wait } from '@alienkitty/space.js/three';

import { RenderManager } from './RenderManager.js';

import { params } from '../../config/Config.js';

export class SceneController {
    static init(view) {
        this.view = view;

        this.animatedOneFramePast = false;
    }

    // Public methods

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

    static toggle = show => {
        this.view.toggle(show);
    };

    static ready = async () => {
        await this.view.ready();

        // Centre objects for prerender
        const currentPositions = this.view.children.map(object => object.position.clone());

        this.view.children.forEach(object => object.position.set(0, 0, 0));
        this.view.visible = true;

        RenderManager.update();

        await wait(500);

        // Restore positions
        this.view.visible = false;
        this.view.children.forEach((object, i) => object.position.copy(currentPositions[i]));
    };
}
