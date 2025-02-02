/**
 * @author pschroen / https://ufo.ai/
 */

/**
 * A linked list of objects.
 */
export class LinkedList {
    constructor() {
        this.nodes = [];
        this.first = null;
        this.last = null;
        this.current = null;
    }

    get length() {
        return this.nodes.length;
    }

    push(object) {
        const node = {
            object,
            prev: null,
            next: null
        };

        this.nodes.push(node);

        if (!this.first) {
            this.first = node;
            this.last = node;
            node.prev = node;
            node.next = node;
        } else {
            node.next = this.first;
            node.prev = this.last;
            this.last.next = node;
            this.last = node;
        }
    }

    remove(object) {
        let node;
        let index;

        for (let i = 0, l = this.nodes.length; i < l; i++) {
            if (this.nodes[i].object === object) {
                node = this.nodes[i];
                index = i;
                break;
            }
        }

        if (!node) {
            return;
        }

        if (this.nodes.length === 1) {
            this.empty();
        } else if (node === this.first) {
            this.first = node.next;
            this.last.next = this.first;
            this.first.prev = this.last;
        } else if (node === this.last) {
            this.last = node.prev;
            this.last.next = this.first;
            this.first.prev = this.last;
        } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        this.nodes.splice(index, 1);
    }

    empty() {
        this.nodes.length = 0;
        this.first = null;
        this.last = null;
        this.current = null;
    }

    start() {
        this.current = this.first;

        return this.current.object;
    }

    next() {
        if (!this.current) {
            return;
        }

        this.current = this.current.next;

        if (this.nodes.length === 1 || this.current === this.first) {
            return;
        }

        return this.current.object;
    }

    find(callback) {
        return this.nodes.map(node => node.object).find(callback);
    }

    destroy() {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            if (this.nodes[i].object && this.nodes[i].object.destroy) {
                this.nodes[i].object.destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}
