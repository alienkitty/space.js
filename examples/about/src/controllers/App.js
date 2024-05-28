import { ImageBitmapLoaderThread, Stage, Thread, UI, ticker, wait } from '@alienkitty/space.js/three';

import { WorldController } from './world/WorldController.js';
import { CameraController } from './world/CameraController.js';
import { SceneController } from './world/SceneController.js';
import { PhysicsController } from './world/PhysicsController.js';
import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { PanelController } from './panels/PanelController.js';
import { SceneView } from '../views/SceneView.js';

export class App {
    static async init() {
        this.initThread();
        this.initWorld();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        await Promise.all([
            document.fonts.ready,
            SceneController.ready(),
            WorldController.textureLoader.ready(),
            WorldController.environmentLoader.ready()
        ]);

        this.initPanel();
    }

    static initThread() {
        ImageBitmapLoaderThread.init();

        Thread.shared();
    }

    static initWorld() {
        WorldController.init();
        Stage.add(WorldController.element);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            header: {
                links: [
                    {
                        title: 'Space.js',
                        link: 'https://github.com/alienkitty/space.js'
                    }
                ]
            },
            menu: {
                items: ['POL', 'OBL', 'ISO'],
                // active: 'OBL'
                active: 'ISO'
            }
        });
        Stage.add(this.ui);
    }

    static initControllers() {
        const { renderer, scene, polarCamera, obliqueCamera, isometricCamera, camera, controls, physics } = WorldController;

        CameraController.init(polarCamera, obliqueCamera, isometricCamera, controls);
        SceneController.init(this.view);
        PhysicsController.init(physics);
        InputManager.init(scene, camera, controls);
        RenderManager.init(renderer, scene, camera, this.ui);
    }

    static initPanel() {
        const { renderer, scene, camera, physics } = WorldController;

        PanelController.init(renderer, scene, camera, physics, this.view, this.ui);
    }

    static addListeners() {
        Stage.events.on('invert', this.onInvert);
        this.ui.menu.events.on('update', this.onMenu);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
    }

    // Event handlers

    static onInvert = ({ invert }) => {
        this.view.invert(invert);
        RenderManager.invert(invert);
    };

    static onMenu = ({ index }) => {
        let camera;

        if (index === 0) {
            camera = WorldController.polarCamera;
        } else if (index === 1) {
            camera = WorldController.obliqueCamera;
        } else if (index === 2) {
            camera = WorldController.isometricCamera;
        }

        WorldController.setCamera(camera);
        InputManager.setCamera(camera);
        RenderManager.setCamera(camera);
        PanelController.setCamera(camera);
    };

    static onKeyUp = e => {
        if (e.ctrlKey && e.keyCode >= 49 && e.keyCode <= 51) { // 1-3
            this.ui.menu.index = e.keyCode - 49;
            this.ui.menu.update();
        }
    };

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        WorldController.resize(width, height, dpr);
        CameraController.resize(width, height);
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        CameraController.update();
        SceneController.update(time);
        PhysicsController.update();
        InputManager.update(time);
        RenderManager.update(time, delta, frame);
        PanelController.update(time);
        this.ui.update();
    };

    // Public methods

    static start = async () => {
        WorldController.animateIn();
        SceneController.animateIn();
        RenderManager.animateIn();

        await wait(1000);

        PanelController.animateIn();
        this.ui.animateIn();
    };
}
