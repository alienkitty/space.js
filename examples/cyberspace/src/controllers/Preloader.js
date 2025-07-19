import { AssetLoader, MultiLoader, Stage } from '@alienkitty/space.js/three';

import { PreloaderView } from '../views/PreloaderView.js';

import { assetPath } from '../config/Config.js';

export class Preloader {
    static init() {
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
        // assetLoader.setPath(`${assetPath}/`);
        assetLoader.cache = true;

        assetLoader.loadAll([
            'https://cdn.cyberspace.app/cyberspace_names.bin',
            'https://api.cyberspace.app/geoip',
            `${assetPath}/sounds/enough_loop.mp3`,
            `${assetPath}/sounds/hover.mp3`,
            `${assetPath}/sounds/click.mp3`
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
        this.view.events.on('complete', this.onComplete);
    }

    static removeListeners() {
        this.loader.events.off('progress', this.view.onProgress);
        this.view.events.off('complete', this.onComplete);
    }

    // Event handlers

    static onComplete = async () => {
        this.removeListeners();

        this.loader = this.loader.destroy();

        await this.view.animateOut();
        this.view = this.view.destroy();

        this.app.start();
    };
}
