/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from './Interface.js';

import { ticker } from '../tween/Ticker.js';

/**
 * The root interface object.
 * @example
 * Stage.init();
 * @example
 * Stage.init(document.querySelector('#root'));
 * Stage.css({ opacity: 0 });
 * Stage.tween({ opacity: 1 }, 1000, 'linear', () => {
 *     Stage.css({ opacity: '' });
 * });
 */
export const Stage = new Interface(null, null);

/**
 * Sets the root interface element, root styles and starts the ticker.
 * @param {HTMLElement} element Target element.
 * @returns {void}
 * @example
 * Stage.init();
 * @example
 * Stage.init(document.querySelector('#root'));
 */
Stage.init = (element = document.body) => {
    Stage.element = element;

    Stage.root = document.querySelector(':root');
    Stage.rootStyle = getComputedStyle(Stage.root);

    ticker.start();
};
