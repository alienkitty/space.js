import { ImageBitmapLoaderThread, Stage, Thread, UI, WebAudio, clearTween, delayedCall, ticker, wait } from '@alienkitty/space.js/three';

import { Data } from '../data/Data.js';
import { AudioController } from './audio/AudioController.js';
import { WorldController } from './world/WorldController.js';
import { CameraController } from './world/CameraController.js';
import { SceneController } from './world/SceneController.js';
// import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { PanelController } from './panels/PanelController.js';
import { SceneView } from '../views/SceneView.js';

import { basePath, isDebug, isMobile, numViews, store } from '../config/Config.js';

export class App {
    static async init(loader) {
        this.loader = loader;

        this.isTransitioning = false;
        this.animatedIn = false;

        const params = new URL(location.href).searchParams;
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

    static initViews() {
        const data = Data.pages[0];

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

        // Header
        this.ui.header.title.css({
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
        this.ui.header.info.events.on('hover', this.onHover);
        this.ui.header.info.events.on('click', this.onClick);

        // Footer
        this.ui.footer.info.css({
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
        this.ui.footer.info.events.on('hover', this.onHover);
        this.ui.footer.info.events.on('click', this.onClick);

        // Details button
        this.ui.detailsButton.setData({
            number: 1,
            total: numViews
        });
        this.ui.detailsButton.events.on('hover', this.onHover);
        this.ui.detailsButton.events.on('click', this.onClick);

        // Details
        this.ui.details.links.forEach(item => {
            item.events.on('hover', this.onHover);
            item.events.on('click', this.onClick);
        });

        this.ui.link = this.ui.details.links[1];
        this.ui.link.events.on('click', this.onLinkClick);

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
            obliqueCameraControls,
            northPolarCameraControls,
            southPolarCameraControls,
            point1CameraControls,
            point2CameraControls,
            point3CameraControls,
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
            obliqueCameraControls,
            northPolarCameraControls,
            southPolarCameraControls,
            point1CameraControls,
            point2CameraControls,
            point3CameraControls,
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

    static transition(data) {
        if (!this.animatedIn) {
            return;
        }

        this.isTransitioning = true;

        this.ui.details.animateOut(() => {
            this.setDetails(data);

            if (!this.ui.detailsInfo.animatedIn) {
                this.ui.details.animateIn();
            }

            this.isTransitioning = false;
        });
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
            });
        }

        CameraController.setDetails(open);
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

    static onHover = e => {
        if (e.type === 'mouseenter' && !isMobile) {
            AudioController.trigger('hover');
        }
    };

    static onClick = () => {
        if (!isMobile) {
            AudioController.trigger('click');
        }
    };

    static onLinkClick = (e, { target }) => {
        e.preventDefault();

        const data = Data.get(target.link);

        this.transition(data);
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
            this.ui.setPanelValue('Light X', -3);
            this.ui.setPanelValue('Light Y', 1.5);
            this.ui.setPanelValue('Light Z', 3);
            this.ui.header.title.setData({ caption: 'Oblique view' });
        } else if (index === 1) {
            camera = WorldController.northPolarCamera;
            controls = WorldController.northPolarCameraControls;
            this.ui.setPanelValue('Light X', -1.5);
            this.ui.setPanelValue('Light Y', 3);
            this.ui.setPanelValue('Light Z', -1.5);
            this.ui.header.title.setData({ caption: 'North polar view' });
        } else if (index === 2) {
            camera = WorldController.southPolarCamera;
            controls = WorldController.southPolarCameraControls;
            this.ui.setPanelValue('Light X', 1.5);
            this.ui.setPanelValue('Light Y', -3);
            this.ui.setPanelValue('Light Z', -1.5);
            this.ui.header.title.setData({ caption: 'South polar view' });
        } else if (index === 3) {
            camera = WorldController.point1Camera;
            controls = WorldController.point1CameraControls;
            this.ui.setPanelValue('Light X', -3);
            this.ui.setPanelValue('Light Y', 1.5);
            this.ui.setPanelValue('Light Z', 3);
            this.ui.header.title.setData({ caption: 'Southern hemisphere view' });
        } else if (index === 4) {
            camera = WorldController.point2Camera;
            controls = WorldController.point2CameraControls;
            this.ui.setPanelValue('Light X', -3);
            this.ui.setPanelValue('Light Y', 1.5);
            this.ui.setPanelValue('Light Z', 3);
            this.ui.header.title.setData({ caption: 'Surface close-up view' });
        } else if (index === 5) {
            camera = WorldController.point3Camera;
            controls = WorldController.point3CameraControls;
            this.ui.setPanelValue('Light X', -3);
            this.ui.setPanelValue('Light Y', 1.5);
            this.ui.setPanelValue('Light Z', -1.5);
            this.ui.header.title.setData({ caption: 'Horizon view' });
        }

        WorldController.setCamera(camera, controls);
        CameraController.setCamera(camera, controls);
        RenderManager.setCamera(camera);
        this.ui.detailsButton.setData({ number: index + 1 }, true);

        store.viewIndex = index;
    };

    static setDetails = data => {
        // Remove listeners
        this.ui.details.links.forEach(item => {
            item.events.off('hover', this.onHover);
            item.events.off('click', this.onClick);
        });

        this.ui.link.events.off('click', this.onLinkClick);

        // Update details
        this.ui.details.setData(data.details);

        if (data.path === '/about') {
            this.ui.details.title.css({ marginLeft: 0 });
        }

        // Re-add listeners
        this.ui.details.links.forEach(item => {
            item.events.on('hover', this.onHover);
            item.events.on('click', this.onClick);
        });

        this.ui.link = this.ui.details.links[1];
        this.ui.link.events.on('click', this.onLinkClick);
    };

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
            if (!this.ui.details.animatedIn && !this.isTransitioning) {
                this.ui.detailsInfo.animateIn();
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
