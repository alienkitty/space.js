import { Group } from 'three';

// import { InputManager } from '../controllers/world/InputManager.js';
import { Mars } from './scene/Mars.js';
import { Sun } from './scene/Sun.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initViews();
    }

    initViews() {
        this.mars = new Mars();
        this.add(this.mars);

        this.sun = new Sun();
        this.add(this.sun);
    }

    // Public methods

    resize = () => {
    };

    update = () => {
        this.mars.update();
    };

    ready = () => this.mars.ready();
}
