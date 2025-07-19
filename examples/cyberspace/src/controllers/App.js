import { Stage, UI, ticker } from '@alienkitty/space.js/three';

import { Data } from '../data/Data.js';
import { WorldController } from './world/WorldController.js';
import { RenderManager } from './world/RenderManager.js';
import { PanelController } from './panels/PanelController.js';
import { SceneView } from '../views/SceneView.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.initWorld();

        await Promise.all([
            document.fonts.ready,
            this.loader.ready()
        ]);

        this.initData();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await WorldController.ready();

        this.initPanel();
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.canvas);
    }

    static initData() {
        const { files } = this.loader;

        const buffer = files.get('https://cdn.cyberspace.app/cyberspace_names.bin');
        const geoip = files.get('https://api.cyberspace.app/geoip');

        Data.init(buffer, geoip);
        WorldController.setPoint(Data.point);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({ fps: true });
        this.ui.animateIn();
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        RenderManager.init(renderer, scene, camera);
    }

    static initPanel() {
        const { renderer, scene, camera } = WorldController;

        PanelController.init(renderer, scene, camera, this.view, this.ui);
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
        ticker.start();
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        WorldController.resize(width, height, dpr);
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        RenderManager.update(time, delta, frame);
        PanelController.update(time);
        this.ui.update();
    };

    // Public methods

    static start = async () => {
        WorldController.animateIn();
    };
}
