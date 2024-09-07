import { params } from '../../config/Config.js';

export class SceneController {
    static init(view) {
        this.view = view;

        this.animatedOneFramePast = false;
    }

    // Public methods

    static update = time => {
        if (!this.view.visible) {
            return;
        }

        if (params.animate || !this.animatedOneFramePast) {
            this.view.update(time);

            this.animatedOneFramePast = !params.animate;
        }
    };

    static animateIn = () => {
        this.view.animateIn();

        this.view.visible = true;
    };

    static toggle = show => {
        this.view.toggle(show);
    };

    static ready = () => this.view.ready();
}
