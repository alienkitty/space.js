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

import { basePath, isDebug, numViews, store } from '../config/Config.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.isTransitioning = false;
        this.animatedIn = false;

        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        store.viewIndex = params.has('view') ? Number(params.get('view')) - 1 : 0;

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
        store.loading = 'View';
        this.setView(store.viewIndex);
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
            header: {
                title: {
                    name: 'Mars',
                    caption: 'Oblique view'
                }
            },
            footer: {
                info: {
                    name: 'Next view',
                    callback: this.onNextView
                }
            },
            detailsButton: true,
            details: {
                dividerLine: true,
                width: 'max(50vw, 250px)',
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

        this.ui.header.title.css({
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.ui.footer.info.css({
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.ui.detailsButton.setData({
            number: 1,
            total: numViews
        });

        if (data.path === '/about') {
            this.ui.details.title.css({ marginLeft: 0 });
        }

        this.ui.link = this.ui.details.links[1];
        this.ui.link.events.on('click', this.onClick);

        Stage.add(this.ui);
    }

    static initControllers() {
        const {
            renderer,
            scene,
            obliqueCamera,
            northPolarCamera,
            southPolarCamera,
            point1Camera,
            point2Camera,
            point3Camera,
            camera,
            controls
        } = WorldController;

        CameraController.init(
            scene,
            obliqueCamera,
            northPolarCamera,
            southPolarCamera,
            point1Camera,
            point2Camera,
            point3Camera,
            camera,
            controls
        );

        SceneController.init(renderer, scene, camera, this.view);
        RenderManager.init(renderer, scene, camera, this.view);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.loader.files);

        AudioController.init();
    }

    static initPanel() {
        const { renderer, scene, camera } = WorldController;

        PanelController.init(renderer, scene, camera, this.view, this.ui);
    }

    static addListeners() {
        Stage.events.on('details', this.onDetails);
        window.addEventListener('popstate', this.onPopState);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate);
        ticker.start();
    }

    // Event handlers

    static onNextView = () => {
        this.nextView();
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

        CameraController.setDetails(open);
    };

    static onPopState = () => {
        if (!this.animatedIn) {
            return;
        }

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

    static onKeyUp = e => {
        if (e.keyCode === 37) { // Left
            this.prevView();
        }

        if (e.keyCode === 39) { // Right
            this.nextView();
        }

        if (e.ctrlKey && e.keyCode >= 49 && e.keyCode <= 54) { // Ctrl 1-6
            this.setView(e.keyCode - 49);
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

    static onClick = (e, { target }) => {
        e.preventDefault();

        const path = router.getPath(target.link);
        router.setPath(target.link !== '/' ? `${path}/` : path);
    };

    // Public methods

    static prevView = () => {
        let index = store.viewIndex;

        if (--index < 0) {
            index = numViews - 1;
        }

        this.setView(index);
    };

    static nextView = () => {
        let index = store.viewIndex;

        if (++index > numViews - 1) {
            index = 0;
        }

        this.setView(index);
    };

    static setView = index => {
        let camera;
        let controls;

        if (index === 0) {
            camera = WorldController.obliqueCamera;
            controls = WorldController.obliqueCameraControls;
            this.ui.header.title.setData({ caption: 'Oblique view' });
        } else if (index === 1) {
            camera = WorldController.northPolarCamera;
            controls = WorldController.northPolarCameraControls;
            this.ui.header.title.setData({ caption: 'North polar view' });
        } else if (index === 2) {
            camera = WorldController.southPolarCamera;
            controls = WorldController.southPolarCameraControls;
            this.ui.header.title.setData({ caption: 'South polar view' });
        } else if (index === 3) {
            camera = WorldController.point1Camera;
            controls = WorldController.point1CameraControls;
            this.ui.header.title.setData({ caption: 'Southern hemisphere view' });
        } else if (index === 4) {
            camera = WorldController.point2Camera;
            controls = WorldController.point2CameraControls;
            this.ui.header.title.setData({ caption: 'Surface close-up view' });
        } else if (index === 5) {
            camera = WorldController.point3Camera;
            controls = WorldController.point3CameraControls;
            this.ui.header.title.setData({ caption: 'Horizon view' });
        }

        WorldController.setCamera(camera, controls);
        CameraController.setCamera(camera, controls);
        RenderManager.setCamera(camera);
        this.ui.detailsButton.setData({ number: index + 1 }, true);

        store.viewIndex = index;

        /* const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        params.set('view', index + 1);

        router.setPath(`${location.pathname}?${params.toString()}`); */
    };

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
        this.animatedIn = true;

        const { data } = router.get(location.pathname);

        WorldController.animateIn();
        CameraController.animateIn();
        SceneController.animateIn();

        if (isDebug || data.path === '/about') {
            if (data.path === '/' && !this.ui.details.animatedIn && !this.isTransitioning) {
                this.ui.detailsInfo.animateIn();
            } else if (data.path === '/about') {
                CameraController.setDetails(true, true);
                this.ui.toggleDetails(true);

                document.documentElement.classList.add('scroll');
            }

            this.ui.animateIn();
        } else {
            await wait(6000);

            if (!this.ui.details.animatedIn && !this.isTransitioning) {
                this.ui.detailsInfo.animateIn();
            }

            await wait(3000);

            this.ui.animateIn();
        }
    };
}
