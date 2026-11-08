import { Interface } from '../utils/Interface.js';
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

import type { DetailsData } from './Details.js';
import type { DetailsInfoData } from './DetailsInfo.js';
import type { HeaderData, HeaderOptions } from './Header.js';
import type { FooterData } from './Footer.js';
import type { MenuOptions } from './Menu.js';
import type { InfoData, InfoOptions } from './Info.js';
import type { ThumbnailData } from './Thumbnail.js';
import type { MuteButtonOptions } from './MuteButton.js';
import type { AudioButtonOptions } from './AudioButton.js';
import type { PanelItem } from '../panels/PanelItem.js';

export interface UIOpenEvent {
    open: boolean;
    target: UI;
}

export interface UIInvertEvent {
    invert: boolean;
}

export interface UIDetailsEvent {
    open: boolean;
    target: UI;
}

export interface UIOptions {
    fps: true;
    fpsOpen: true;
    breakpoint: true;
}

export interface UIData {
    details: Partial<DetailsData>;
    detailsInfo: Partial<DetailsInfoData>;
    header: Partial<HeaderOptions & HeaderData>;
    footer: Partial<FooterData>;
    menu: Partial<MenuOptions>;
    info: Partial<InfoOptions & InfoData>;
    instructions: Partial<InfoOptions & InfoData>;
    thumbnail: Partial<ThumbnailData>;
    detailsButton: boolean;
    muteButton: Partial<MuteButtonOptions>;
    audioButton: Partial<AudioButtonOptions>;
}

/**
 * A HUD (heads-up display) container for various components.
 *
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
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/UI.js | Source}
 */
export class UI extends Interface {
    fps: true;
    fpsOpen: true;
    breakpoint: true;
    data: Partial<UIData>;

    invertColors: {
        light: string;
        lightTriplet: string;
        lightLine: string;
        dark: string;
        darkTriplet: string;
        darkLine: string;
    };

    startTime: number;
    frame: number;

    buttons: (DetailsButton | MuteButton | AudioButton)[];
    isDetailsToggle: boolean;
    isDetailsInfoToggle: boolean;
    animatedIn: boolean;

    details?: Details;
    detailsInfo?: DetailsInfo;
    header?: Header;
    footer?: Footer;
    menu?: Menu;
    info?: Info;
    instructions?: Info;
    thumbnail?: Thumbnail;
    detailsButton?: DetailsButton;
    muteButton?: MuteButton;
    audioButton?: AudioButton;

    constructor(options?: Partial<UIOptions & UIData>);

    init(): void;

    initViews(): void;

    addListeners(): void;

    removeListeners(): void;

    onResize: () => void;

    onKeyUp: (e: KeyboardEvent) => void;

    onDetailsClick: () => void;

    addPanel(item: PanelItem): void;

    getPanelIndex(name: string): number | undefined;

    getPanelValue(name: string): any;

    setPanelIndex(name: string, index: number, notify?: boolean, path?: [string, number][]): void;

    setPanelValue(name: string, value: any, notify?: boolean, path?: [string, number][]): void;

    invert(isInverted: boolean): void;

    update(): void;

    animateIn(): void;

    animateOut(): void;

    toggleDetails(show: boolean): void;

    override destroy(): null;
}
