/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { Details } from './Details.js';
import { DetailsInfo } from './DetailsInfo.js';
import { Header } from './Header.js';
import { Menu } from './Menu.js';
import { Info } from './Info.js';
import { Thumbnail } from './Thumbnail.js';
import { DetailsButton } from './DetailsButton.js';
import { MuteButton } from './MuteButton.js';

import { ticker } from '../tween/Ticker.js';

export class UI extends Interface {
    constructor({
        fps = false,
        fpsOpen = false,
        breakpoint = 1000,
        ...data
    } = {}) {
        super('.ui');

        this.fps = fps;
        this.fpsOpen = fpsOpen;
        this.breakpoint = breakpoint;
        this.data = data;

        if (!Stage.root) {
            Stage.root = document.querySelector(':root');
            Stage.rootStyle = getComputedStyle(Stage.root);
        }

        this.invertColors = {
            light: Stage.rootStyle.getPropertyValue('--ui-invert-light-color').trim(),
            lightTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-triplet').trim(),
            lightLine: Stage.rootStyle.getPropertyValue('--ui-invert-light-color-line').trim(),
            dark: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color').trim(),
            darkTriplet: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-triplet').trim(),
            darkLine: Stage.rootStyle.getPropertyValue('--ui-invert-dark-color-line').trim()
        };

        this.startTime = performance.now();
        this.isDetailsOpen = false;
        this.buttons = [];

        this.init();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            color: 'var(--ui-color)',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    initViews() {
        const fps = this.fps;
        const fpsOpen = this.fpsOpen;

        if (this.data.details) {
            this.details = new Details(this.data.details);
            this.add(this.details);
        }

        if (this.data.detailsInfo) {
            this.detailsInfo = new DetailsInfo(this.data.detailsInfo);
            this.add(this.detailsInfo);
        }

        if (this.data.header || fps || fpsOpen) {
            this.header = new Header({ ...this.data.header, fps, fpsOpen });
            this.add(this.header);
        }

        if (this.data.menu) {
            this.menu = new Menu(this.data.menu);
            this.add(this.menu);
        }

        if (this.data.info) {
            this.info = new Info(this.data.info);
            this.add(this.info);
        }

        if (this.data.instructions) {
            this.instructions = new Info({ ...this.data.instructions, bottom: true });
            this.add(this.instructions);
        }

        if (this.data.thumbnail) {
            this.thumbnail = new Thumbnail(this.data.thumbnail);
            this.add(this.thumbnail);
        }

        if (this.data.detailsButton) {
            this.detailsButton = new DetailsButton();
            this.detailsButton.css({
                position: 'absolute',
                left: 19,
                bottom: 18
            });
            this.add(this.detailsButton);
            this.buttons.push(this.detailsButton);
        }

        if (this.data.muteButton) {
            this.muteButton = new MuteButton(this.data.muteButton);
            this.muteButton.css({
                position: 'absolute',
                right: 22,
                bottom: 20
            });
            this.add(this.muteButton);
            this.buttons.push(this.muteButton);
        }
    }

    addListeners() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('keyup', this.onKeyUp);

        if (this.details) {
            this.details.events.on('click', this.onDetailsClick);
        }

        if (this.detailsButton) {
            this.detailsButton.events.on('click', this.onDetailsClick);
        }
    }

    removeListeners() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('keyup', this.onKeyUp);

        if (this.details) {
            this.details.events.off('click', this.onDetailsClick);
        }

        if (this.detailsButton) {
            this.detailsButton.events.off('click', this.onDetailsClick);
        }
    }

    // Event handlers

    onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        if (this.details) {
            this.details.resize(width, height, dpr, this.breakpoint);
        }

        if (this.detailsInfo) {
            this.detailsInfo.resize(width, height, dpr, this.breakpoint);
        }

        if (this.header) {
            this.header.resize(width, height, dpr, this.breakpoint);
        }

        if (this.menu) {
            this.menu.resize(width, height, dpr, this.breakpoint);
        }

        if (this.thumbnail) {
            this.thumbnail.resize(width, height, dpr, this.breakpoint);
        }

        if (this.detailsButton) {
            if (width < this.breakpoint) {
                this.detailsButton.css({
                    left: 9,
                    bottom: 8
                });
            } else {
                this.detailsButton.css({
                    left: 19,
                    bottom: 18
                });
            }
        }

        if (this.muteButton) {
            if (width < this.breakpoint) {
                this.muteButton.css({
                    right: 12,
                    bottom: 10
                });
            } else {
                this.muteButton.css({
                    right: 22,
                    bottom: 20
                });
            }
        }

        this.buttons.forEach(button => button.resize());
    };

    onKeyUp = e => {
        if (this.details) {
            if (e.keyCode === 27) { // Esc
                this.onDetailsClick();
            }
        }
    };

    onDetailsClick = () => {
        if (!this.isDetailsOpen) {
            this.toggleDetails(true);
        } else {
            this.toggleDetails(false);
        }
    };

    // Public methods

    addPanel(item) {
        this.header.info.addPanel(item);
    }

    setPanelIndex(name, index, path = []) {
        this.header.info.panel.setPanelIndex(name, index, path);
    }

    setPanelValue(name, value, path = []) {
        this.header.info.panel.setPanelValue(name, value, path);
    }

    invert(isInverted) {
        Stage.root.style.setProperty('--ui-color', isInverted ? this.invertColors.light : this.invertColors.dark);
        Stage.root.style.setProperty('--ui-color-triplet', isInverted ? this.invertColors.lightTriplet : this.invertColors.darkTriplet);
        Stage.root.style.setProperty('--ui-color-line', isInverted ? this.invertColors.lightLine : this.invertColors.darkLine);

        Stage.events.emit('invert', { invert: isInverted });

        this.buttons.forEach(button => button.resize());
    }

    update() {
        if (!ticker.isAnimating) {
            ticker.onTick(performance.now() - this.startTime);
        }

        this.buttons.forEach(button => {
            if (button.needsUpdate) {
                button.update();
            }
        });

        if (this.header && this.header.info) {
            this.header.info.update();
        }

        if (this.thumbnail) {
            this.thumbnail.update();
        }
    }

    animateIn() {
        if (this.header) {
            this.header.animateIn();
        }

        if (this.menu) {
            this.menu.animateIn();
        }

        if (this.thumbnail) {
            this.thumbnail.animateIn();
        }

        this.buttons.forEach(button => button.animateIn());
    }

    animateOut() {
        if (this.details) {
            this.details.animateOut();
        }

        if (this.detailsInfo) {
            this.detailsInfo.animateOut();
        }

        if (this.header) {
            this.header.animateOut();
        }

        if (this.menu) {
            this.menu.animateOut();
        }

        if (this.info) {
            this.info.animateOut();
        }

        if (this.instructions) {
            this.instructions.animateOut();
        }

        if (this.thumbnail) {
            this.thumbnail.animateOut();
        }

        this.buttons.forEach(button => button.animateOut());
    }

    toggleDetails(show) {
        if (show) {
            this.isDetailsOpen = true;

            if (this.detailsButton) {
                this.detailsButton.open();
            }

            this.details.animateIn();
        } else {
            this.isDetailsOpen = false;

            this.details.animateOut();

            if (this.detailsButton) {
                this.detailsButton.close();
            }
        }

        Stage.events.emit('details', { open: this.isDetailsOpen, target: this });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
