/**
 * @author pschroen / https://ufo.ai/
 */

/**
 * A pool of objects created from a given constructor.
 */
export class ObjectPool {
    constructor(typeConstructor, num = 10) {
        this.typeConstructor = typeConstructor;

        this.array = [];

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
        const object = this.array.shift();

        if (object !== undefined) {
            return object;
        }

        return this.typeConstructor ? new this.typeConstructor() : null;
    }

    empty() {
        this.array.length = 0;
    }

    put(...objects) {
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
