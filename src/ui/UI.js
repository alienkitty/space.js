/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';
import { Details } from './Details.js';
import { DetailsInfo } from './DetailsInfo.js';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Menu } from './Menu.js';
import { Info } from './Info.js';
import { Thumbnail } from './Thumbnail.js';
import { DetailsButton } from './DetailsButton.js';
import { MuteButton } from './MuteButton.js';
import { AudioButton } from './AudioButton.js';

import { ticker } from '../tween/Ticker.js';

/**
 * A HUD (heads-up display) container for various components.
 * @example
 * const ui = new UI({
 *     fps: true
 *     // header
 *     // footer
 *     // menu
 *     // info
 *     // details
 *     // instructions
 *     // detailsButton
 *     // muteButton
 *     // audioButton
 * });
 * ui.animateIn();
 * document.body.appendChild(ui.element);
 *
 * function animate() {
 *     requestAnimationFrame(animate);
 *
 *     ui.update();
 * }
 *
 * requestAnimationFrame(animate);
 */
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
        this.frame = 0;

        this.buttons = [];
        this.isDetailsToggle = false;
        this.isDetailsInfoToggle = false;
        this.animatedIn = false;

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
            pointerEvents: 'none'
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
            this.detailsInfo = new DetailsInfo({ ...this.data.detailsInfo, detailsButton: this.data.detailsButton });
            this.add(this.detailsInfo);
        }

        if (this.data.header || fps || fpsOpen) {
            this.header = new Header({ ...this.data.header, fps, fpsOpen });
            this.add(this.header);
        }

        if (this.data.footer) {
            this.footer = new Footer(this.data.footer);
            this.add(this.footer);
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
                position: 'fixed',
                left: 19,
                bottom: 18
            });
            this.add(this.detailsButton);
            this.buttons.push(this.detailsButton);
        }

        if (this.data.muteButton) {
            this.muteButton = new MuteButton(this.data.muteButton);
            this.muteButton.css({
                position: 'fixed',
                right: 22,
                bottom: 20
            });
            this.add(this.muteButton);
            this.buttons.push(this.muteButton);
        }

        if (this.data.audioButton) {
            this.audioButton = new AudioButton(this.data.audioButton);
            this.audioButton.css({
                position: 'fixed',
                right: 22,
                bottom: 20
            });
            this.add(this.audioButton);
            this.buttons.push(this.audioButton);
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

        if (this.footer) {
            this.footer.resize(width, height, dpr, this.breakpoint);
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

        if (this.audioButton) {
            if (width < this.breakpoint) {
                this.audioButton.css({
                    right: 12,
                    bottom: 10
                });
            } else {
                this.audioButton.css({
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

                this.isDetailsToggle = this.details && this.details.animatedIn;
                this.isDetailsInfoToggle = this.detailsInfo && this.detailsInfo.animatedIn;
            }
        }

        if (e.ctrlKey && e.keyCode === 48) { // Ctrl 0
            if (this.animatedIn) {
                this.isDetailsToggle = this.details && this.details.animatedIn;
                this.isDetailsInfoToggle = this.detailsInfo && this.detailsInfo.animatedIn;

                this.animateOut();
            } else {
                this.animateIn();

                this.isDetailsToggle = false;
                this.isDetailsInfoToggle = false;
            }

            Stage.events.emit('ui', { open: this.animatedIn, target: this });
        }
    };

    onDetailsClick = () => {
        if (this.details.animatedIn) {
            this.toggleDetails(false);
        } else {
            this.toggleDetails(true);
        }
    };

    // Public methods

    addPanel(item) {
        this.header.info.addPanel(item);
    }

    getPanelIndex(name) {
        return this.header.info.panel.getPanelIndex(name);
    }

    getPanelValue(name) {
        return this.header.info.panel.getPanelValue(name);
    }

    setPanelIndex(name, index, path) {
        this.header.info.panel.setPanelIndex(name, index, path);
    }

    setPanelValue(name, value, path) {
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
        if (!ticker.isAnimating && ++this.frame > ticker.frame) {
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
        if (this.details && this.isDetailsToggle && !this.details.animatedIn) {
            this.details.animateIn();
        }

        if (this.detailsInfo && this.isDetailsInfoToggle && !this.detailsInfo.animatedIn) {
            this.detailsInfo.animateIn();
        }

        if (this.header) {
            this.header.animateIn();
        }

        if (this.footer) {
            this.footer.animateIn();
        }

        if (this.menu) {
            this.menu.animateIn();
        }

        if (this.thumbnail) {
            this.thumbnail.animateIn();
        }

        this.buttons.forEach(button => button.animateIn());

        this.animatedIn = true;
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

        if (this.footer) {
            this.footer.animateOut();
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

        this.animatedIn = false;
    }

    toggleDetails(show) {
        if (show) {
            if (this.detailsButton) {
                this.detailsButton.open();
            }

            if (this.detailsInfo) {
                this.detailsInfo.animateOut();
            }

            this.details.animateIn();
        } else {
            this.details.animateOut();

            if (this.detailsInfo) {
                this.detailsInfo.animateIn();
            }

            if (this.detailsButton) {
                this.detailsButton.close();
            }
        }

        Stage.events.emit('details', { open: this.details.animatedIn, target: this });
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
