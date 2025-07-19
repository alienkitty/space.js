import { Group } from 'three';

import { Stars } from './scene/Stars.js';

export class SceneView extends Group {
    constructor() {
        super();

        this.initViews();
    }

    initViews() {
        this.stars = new Stars();
        this.add(this.stars);
    }
}
