import { ImageBitmapLoaderThread, Stage, Thread, UI, WebAudio, clearTween, delayedCall, router, ticker, wait } from '@alienkitty/space.js/three';

import { Data } from '../data/Data.js';
import { Page } from '../data/Page.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { CameraController } from './world/CameraController.js';
import { SceneController } from './world/SceneController.js';
// import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { PanelController } from './panels/PanelController.js';
import { SceneView } from '../views/SceneView.js';

import { basePath, isDebug, store } from '../config/Config.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.isTransitioning = false;

        this.initThread();
        this.initWorld();

        store.loading = 'Transfer';
        await Promise.all([
            document.fonts.ready,
            this.loader.ready()
        ]);

        store.loading = 'Data';
        this.initData();
        this.initRouter();
        this.initViews();
        this.initControllers();

        this.addListeners();
        this.onResize();

        store.loading = 'Textures';
        await SceneController.ready();
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
        Stage.add(WorldController.canvas);
    }

    static initData() {
        const data = this.loader.files.get(`${basePath}/assets/data/data.json`);

        Data.init(data);
    }

    static initRouter() {
        Data.pages.forEach(page => {
            router.add(page.path, Page, page);
        });

        router.init({
            path: basePath,
            scrollRestoration: 'auto'
        });
    }

    static initViews() {
        const { data } = router.get(location.pathname);

        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            detailsButton: true,
            details: {
                dividerLine: true,
                width: '50vw',
                ...data.details
            },
            detailsInfo: {
                title: 'Mars',
                content: /* html */ `
Distance from Sun: 230 million km
<br>Mass: 0.107 Earths
<br>Surface gravity: 0.3794 Earths
                `
            }
        });
        this.ui.css({ position: 'static' });

        if (data.path === '/about') {
            this.ui.details.title.css({ marginLeft: 0 });
        }

        this.ui.link = this.ui.details.links[1];
        this.ui.link.events.on('click', this.onClick);

        Stage.add(this.ui);
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
        window.addEventListener('popstate', this.onPopState);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
        ticker.start();
    }

    // Event handlers

    static onPopState = () => {
        const { data } = router.get(location.pathname);

        if (data.path === '/about' && this.ui.detailsInfo.animatedIn) {
            this.setDetails();
            this.ui.toggleDetails(true);
        } else {
            this.isTransitioning = true;

            this.ui.details.animateOut(() => {
                this.setDetails();

                if (!this.ui.detailsInfo.animatedIn) {
                    this.ui.details.animateIn();
                }

                this.isTransitioning = false;
            });
        }
    };

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

    static onDetails = ({ open }) => {
        clearTween(this.timeout);

        if (open) {
            document.documentElement.classList.add('scroll');
        } else {
            this.timeout = delayedCall(400, () => {
                document.documentElement.classList.remove('scroll');

                const path = router.getPath('/');
                router.setPath(path);
            });
        }
    };

    static onClick = (e, { target }) => {
        e.preventDefault();

        const path = router.getPath(target.link);
        router.setPath(target.link !== '/' ? `${path}/` : path);
    };

    // Public methods

    static setDetails = () => {
        const { data } = router.get(location.pathname);

        if (this.ui.link) {
            this.ui.link.events.off('click', this.onClick);
        }

        this.ui.details.setData(data.details);

        if (data.path === '/about') {
            this.ui.details.title.css({ marginLeft: 0 });
        }

        this.ui.link = this.ui.details.links[1];
        this.ui.link.events.on('click', this.onClick);
    };

    static start = () => {
        AudioController.trigger('mars_start');
        CameraController.start();
    };

    static animateIn = async () => {
        const { data } = router.get(location.pathname);

        WorldController.animateIn();
        CameraController.animateIn();
        SceneController.animateIn();

        if (isDebug || data.path === '/about') {
            if (data.path === '/' && !this.ui.details.animatedIn && !this.isTransitioning) {
                this.ui.detailsInfo.animateIn();
            } else if (data.path === '/about') {
                this.ui.toggleDetails(true);

                document.documentElement.classList.add('scroll');
            }

            this.ui.animateIn();

            Stage.events.on('details', this.onDetails);
        } else {
            await wait(6000);

            if (!this.ui.details.animatedIn && !this.isTransitioning) {
                this.ui.detailsInfo.animateIn();
            }

            await wait(3000);

            this.ui.animateIn();

            Stage.events.on('details', this.onDetails);
        }
    };
}
