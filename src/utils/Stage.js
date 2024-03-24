/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from './Interface.js';

import { ticker } from '../tween/Ticker.js';

export const Stage = new Interface(null, null);

// Public methods

Stage.init = (element = document.body) => {
    Stage.element = element;

    Stage.root = document.querySelector(':root');
    Stage.rootStyle = getComputedStyle(Stage.root);

    ticker.start();
};
