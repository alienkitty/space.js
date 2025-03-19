import { AssetLoader, MultiLoader, Stage } from '@alienkitty/space.js/three';

import { PreloaderView } from '../views/PreloaderView.js';

import { store } from '../config/Config.js';

export class Preloader {
    static init() {
        store.loading = 'Loading';
        this.initStage();
        this.initView();
        this.initLoader();

        this.addListeners();
    }

    static initStage() {
        Stage.init();
    }

    static initView() {
        this.view = new PreloaderView();
        Stage.add(this.view);
    }

    static async initLoader() {
        this.view.animateIn();

        const assetLoader = new AssetLoader();
        assetLoader.setPath('/examples/assets/');
        assetLoader.cache = true;

        assetLoader.loadAll([
            // 'textures/cube/hiptyc_2020_cube.ktx2',
            'textures/cube/mars/mars_basecolor_px.jpg',
            'textures/cube/mars/mars_basecolor_nx.jpg',
            'textures/cube/mars/mars_basecolor_py.jpg',
            'textures/cube/mars/mars_basecolor_ny.jpg',
            'textures/cube/mars/mars_basecolor_pz.jpg',
            'textures/cube/mars/mars_basecolor_nz.jpg',
            'textures/cube/mars/mars_normal_px.jpg',
            'textures/cube/mars/mars_normal_nx.jpg',
            'textures/cube/mars/mars_normal_py.jpg',
            'textures/cube/mars/mars_normal_ny.jpg',
            'textures/cube/mars/mars_normal_pz.jpg',
            'textures/cube/mars/mars_normal_nz.jpg',
            'textures/smaa/area.png',
            'textures/smaa/search.png',
            'sounds/enough_loop.mp3'
        ]);

        this.loader = new MultiLoader();
        this.loader.load(assetLoader);
        this.loader.add(2);

        const { App } = await import('./App.js');
        this.loader.trigger(1);

        this.app = App;

        await this.app.init(assetLoader);
        this.loader.trigger(1);
    }

    static addListeners() {
        this.loader.events.on('progress', this.view.onProgress);
        // this.view.events.on('complete', this.onComplete);
        this.view.events.on('start', this.onStart);
    }

    static removeListeners() {
        this.loader.events.off('progress', this.view.onProgress);
        // this.view.events.off('complete', this.onComplete);
        this.view.events.off('start', this.onStart);
    }

    // Event handlers

    static onStart = async () => {
        this.removeListeners();

        this.loader = this.loader.destroy();

        this.app.start();

        await this.view.animateOut();
        this.view = this.view.destroy();

        this.app.animateIn();
    };
}
