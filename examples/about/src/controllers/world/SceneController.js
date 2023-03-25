import { Vector2 } from 'three';

import { WorldController } from './WorldController.js';

export class SceneController {
    static init(view) {
        this.view = view;

        this.mouse = new Vector2();

        this.addListeners();
    }

    static addListeners() {
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static removeListeners() {
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    /**
     * Event handlers
     */

    static onPointerDown = e => {
        this.onPointerMove(e);
    };

    static onPointerMove = ({ clientX, clientY }) => {
        if (!this.view.visible) {
            return;
        }

        this.mouse.x = (clientX / document.documentElement.clientWidth) * 2 - 1;
        this.mouse.y = 1 - (clientY / document.documentElement.clientHeight) * 2;
    };

    static onPointerUp = e => {
        this.onPointerMove(e);
    };

    /**
     * Public methods
     */

    static resize = () => {
        // const { width, height } = WorldController.getFrustum(this.view.light.position.z);
        const { width, height } = WorldController.getFrustum();

        this.width = width;
        this.height = height;
    };

    static update = () => {
        if (!this.view.visible) {
            return;
        }

        this.view.update();
    };

    static animateIn = () => {
        this.view.animateIn();

        this.view.visible = true;
    };

    static ready = () => this.view.ready();
}
