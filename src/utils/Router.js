/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from './Interface.js';

export class Router {
    static path = '';
    static routes = new Map();

    static init({
        path = '',
        page,
        transition
    }) {
        this.path = path;
        this.page = page;
        this.transition = transition;

        this.lastPage = null;
        this.nextPage = null;
        this.isTransitioning = false;

        history.scrollRestoration = 'manual';

        this.addListeners();
        this.onPopState();
    }

    static replacePage({ object, data }) {
        const page = new object(data);

        if (page instanceof Interface) {
            window.scrollTo(0, 0);

            this.page.replace(this.page, page);
        }

        this.page = page;

        if (this.lastPage && this.lastPage.destroy) {
            this.lastPage.destroy();
        }

        this.lastPage = this.page;

        if (this.transition) {
            this.transition.animateOut(() => {
                if (page.animateIn) {
                    page.animateIn();
                }

                this.isTransitioning = false;
            });
        } else {
            this.isTransitioning = false;
        }
    }

    static transitionPage() {
        if (this.lastPage && this.transition) {
            if (this.lastPage.animateOut) {
                this.lastPage.animateOut();
            }

            this.transition.animateIn(() => {
                this.replacePage(this.nextPage);
            });
        } else {
            this.replacePage(this.nextPage);
        }
    }

    static addListeners() {
        window.addEventListener('popstate', this.onPopState);
    }

    // Event handlers

    static onPopState = () => {
        const value = this.get(location.pathname);

        if (value) {
            this.nextPage = value;

            if (!this.isTransitioning) {
                this.isTransitioning = true;

                this.transitionPage();
            }
        }
    };

    // Public methods

    static add(path, object, data) {
        this.routes.set(path, { object, data });
    }

    static get(path) {
        let value = this.routes.get(`/${path.replace(this.path, '').split('/')[1]}`);

        if (!value) {
            value = this.routes.get('404');
        }

        return value;
    }

    static getPath(path) {
        return this.path + path;
    }

    static setPath(path) {
        if (path === location.pathname) {
            return;
        }

        history.pushState(null, null, path);

        this.onPopState();
    }
}
