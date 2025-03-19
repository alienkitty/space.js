import { ImageBitmapLoaderThread, Stage, Thread, UI, WebAudio, clearTween, delayedCall, ticker, wait } from '@alienkitty/space.js/three';

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
        Stage.add(WorldController.canvas);
    }

    static initViews() {
        this.view = new SceneView();
        WorldController.scene.add(this.view);

        this.ui = new UI({
            fps: true,
            detailsButton: true,
            details: {
                dividerLine: true,
                width: '50vw',
                title: 'Mars',
                content: [
                    {
                        content: /* html */ `
Mars is the fourth planet from the Sun. The surface of Mars is orange-red because it is covered in iron(III) oxide dust, giving it the nickname "the Red Planet". It is classified as a terrestrial planet and is the second smallest of the Solar System's planets with a diameter of 6,779 km.
                        `,
                        links: [
                            {
                                title: 'Wikipedia',
                                link: 'https://en.wikipedia.org/wiki/Mars'
                            },
                            {
                                title: 'About this project',
                                link: ''
                            }
                        ]
                    },
                    {
                        title: 'Distance from Sun',
                        content: '230 million km',
                        width: 145
                    },
                    {
                        title: 'Mass',
                        content: '0.107 Earths',
                        width: 105
                    },
                    {
                        title: 'Surface gravity',
                        content: '0.3794 Earths',
                        width: 130
                    },
                    {
                        title: ''
                    },
                    {
                        title: 'About',
                        content: /* html */ `
This is a cinematic Mars demo featuring high quality cubemaps with 2k faces.
<br>
<br>Special thanks to Brian T. Jacobs for help with generating the cubemaps and feedback, and John Van Vliet for contributing the 32k normal map.
                        `,
                        links: [
                            {
                                title: 'GitHub',
                                link: 'https://github.com/alienkitty/space.js/tree/main/examples/mars'
                            },
                            {
                                title: 'Back to details',
                                link: ''
                            }
                        ],
                        width: '100%'
                    },
                    {
                        title: 'Textures',
                        content: /* html */ `
John Van Vliet
<br>Celestia Origin
<br>Deep Star Maps 2020
                        `,
                        width: 145
                    },
                    {
                        title: 'Licenses',
                        content: /* html */ `
Source code: MIT
<br>Art and design: CC BY
<br>Audio: CC BY
<br>Textures: CC BY-SA
                        `,
                        width: 255
                    },
                    {
                        title: 'Development',
                        content: /* html */ `
Space.js
<br>Alien.js
<br>Three.js
<br>GDAL
<br>ImageMagick
                        `,
                        width: 145
                    },
                    {
                        title: 'Fonts',
                        content: /* html */ `
Roboto
<br>Roboto Mono
<br>Gothic A1
                        `,
                        width: 105
                    },
                    {
                        title: 'Audio',
                        content: /* html */ `
Generative.fm
                        `,
                        width: 130
                    }
                ]
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

    static onDetails = ({ open }) => {
        clearTween(this.timeout);

        if (open) {
            document.documentElement.classList.add('scroll');
        } else {
            this.timeout = delayedCall(400, () => {
                document.documentElement.classList.remove('scroll');
            });
        }
    };

    // Public methods

    static start = () => {
        AudioController.trigger('mars_start');
        CameraController.start();
    };

    static animateIn = async () => {
        WorldController.animateIn();
        CameraController.animateIn();
        SceneController.animateIn();

        if (isDebug) {
            this.ui.detailsInfo.animateIn();
            this.ui.animateIn();

            Stage.events.on('details', this.onDetails);
        } else {
            await wait(6000);
            this.ui.detailsInfo.animateIn();
            await wait(3000);
            this.ui.animateIn();

            Stage.events.on('details', this.onDetails);
        }
    };
}
