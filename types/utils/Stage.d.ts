import { Interface } from './Interface.js';

interface StageInstance extends Interface {
    root: HTMLElement;
    rootStyle: CSSStyleDeclaration;

    /**
     * Sets the root interface element, root styles, and starts the ticker.
     *
     * @example
     * Stage.init();
     *
     * @example
     * Stage.init(document.querySelector('#root'));
     *
     * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Stage.js | Source}
     */
    init: (element?: HTMLElement) => void;
}

/**
 * The root interface object.
 *
 * @example
 * Stage.init();
 *
 * @example
 * Stage.init(document.querySelector('#root'));
 * Stage.css({ opacity: 0 });
 * Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
 *     Stage.css({ opacity: '' });
 * });
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Stage.js | Source}
 */
export const Stage: StageInstance;
