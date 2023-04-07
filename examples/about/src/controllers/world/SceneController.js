export class SceneController {
    static init(view) {
        this.view = view;
    }

    /**
     * Public methods
     */

    static resize = (width, height) => {
        this.view.resize(width, height);
    };

    static update = time => {
        if (!this.view.visible) {
            return;
        }

        this.view.update(time);
    };

    static animateIn = () => {
        this.view.animateIn();

        this.view.visible = true;
    };

    static ready = () => this.view.ready();
}
