/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';

/**
 * An info panel.
 */
export class PanelInfo extends Interface {
    constructor({
        name,
        precision = 2,
        value = 0
    }) {
        super('.info');

        this.name = name;
        this.precision = precision;
        this.value = this.getValue(value);

        this.init();
        this.setValue(this.value);
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            height: 20
        });
        this.add(this.container);

        this.content = new Interface('.content');
        this.content.css({
            cssFloat: 'left',
            marginRight: 10,
            lineHeight: 20,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
        });
        this.content.text(this.name);
        this.container.add(this.content);

        this.number = new Interface('.number');
        this.number.css({
            cssFloat: 'right',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 20,
            letterSpacing: 'var(--ui-number-letter-spacing)'
        });
        this.container.add(this.number);
    }

    getValue(value) {
        return parseFloat(value).toFixed(this.precision);
    }

    // Public methods

    setValue(value) {
        this.value = this.getValue(value);

        this.number.text(this.value);
    }
}
