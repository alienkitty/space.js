/**
 * @author pschroen / https://ufo.ai/
 */

/**
 * A cluster of objects created from a given constructor.
 */
export class Cluster {
    constructor(typeConstructor, num = 10) {
        this.typeConstructor = typeConstructor;

        this.array = [];
        this.index = 0;

        if (this.typeConstructor) {
            for (let i = 0; i < num; i++) {
                this.array.push(new this.typeConstructor());
            }
        }
    }

    get length() {
        return this.array.length;
    }

    get() {
        const object = this.array[this.index];

        this.index++;

        if (this.index === this.array.length) {
            this.index = 0;
        }

        return object;
    }

    empty() {
        this.array.length = 0;
    }

    push(...objects) {
        this.array.push(...objects);
    }

    shuffle() {
        this.array.sort(() => Math.random() - 0.5);
    }

    destroy() {
        for (let i = this.array.length - 1; i >= 0; i--) {
            if (this.array[i] && this.array[i].destroy) {
                this.array[i].destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
