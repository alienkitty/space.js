import { ImageBitmapLoaderThread, Stage, Thread, UI, WebAudio, ticker, wait } from '@alienkitty/space.js/three';

import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { CameraController } from './world/CameraController.js';
import { SceneController } from './world/SceneController.js';
// import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { PanelController } from './panels/PanelController.js';
import { SceneView } from '../views/SceneView.js';

import { isDebug, store } from '../config/Config.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.animatedIn = false;

        this.initThread();
        this.initWorld();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        store.loading = 'Transfer';
        await Promise.all([
            document.fonts.ready,
            SceneController.ready(),
            this.loader.ready()
        ]);

        store.loading = 'Textures';
        await WorldController.ready();
        store.loading = 'Shaders';
        await SceneController.precompile();
        await wait(250);

        store.loading = 'Audio';
        this.initAudio();
        this.initPanel();
        store.loading = 'Nominal';
    }

    static initThread() {
        ImageBitmapLoaderThread.init();

        // https://github.com/mrdoob/three.js/blob/dev/examples/jsm/utils/WorkerPool.js
        Thread.count = 4; // Make room for the ktx2 loader worker pool
    }

    static initWorld() {
        WorldController.init();
        document.body.appendChild(WorldController.canvas.element);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            detailsInfo: {
                title: 'Mars',
                content: /* html */ `
Distance from Sun: 230 million km
<br>Mass: 0.107 Earths
<br>Surface gravity: 0.3794 Earths
                `
            }
        });
        document.body.appendChild(this.ui.element);
    }

    static initControllers() {
        const { renderer, scene, camera } = WorldController;

        CameraController.init(scene, camera);
        SceneController.init(renderer, scene, camera, this.view);
        RenderManager.init(renderer, scene, camera, this.view);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.loader.files);

        AudioController.init();
    }

    static initPanel() {
        const { renderer, scene, camera, light } = WorldController;

        PanelController.init(renderer, scene, camera, light, this.view, this.ui);
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
        CameraController.resize(width, height);
        SceneController.resize();
        RenderManager.resize(width, height, dpr);
    };

    static onUpdate = (time, delta, frame) => {
        WorldController.update(time, delta, frame);
        CameraController.update();
        SceneController.update();
        RenderManager.update(time, delta, frame);
        this.ui.update();
        // console.log('FPS', this.ui.header.info.fps);
    };

    static onUI = ({ open }) => {
        if (open) {
            this.ui.detailsInfo.animateIn();
            this.animatedIn = true;
        }
    };

    static onKeyUp = e => {
        if (e.keyCode === 27) { // Esc
            if (this.animatedIn) {
                this.ui.detailsInfo.animateOut();
                this.animatedIn = false;
            } else {
                this.ui.detailsInfo.animateIn();
                this.animatedIn = true;
            }
        }
    };

    // Public methods

    static start = () => {
        AudioController.trigger('mars_start');
        CameraController.start();
    };

    static animateIn = async () => {
        this.animatedIn = true;

        WorldController.animateIn();
        CameraController.animateIn();
        SceneController.animateIn();

        if (isDebug) {
            this.ui.detailsInfo.animateIn();
            this.ui.animateIn();

            Stage.events.on('ui', this.onUI);
            window.addEventListener('keyup', this.onKeyUp);
        } else {
            await wait(7000);

            this.ui.detailsInfo.animateIn();

            await wait(3000);

            this.ui.animateIn();

            Stage.events.on('ui', this.onUI);
            window.addEventListener('keyup', this.onKeyUp);
        }
    };
}
