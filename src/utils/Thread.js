/**
 * @author pschroen / https://ufo.ai/
 */

import { EventEmitter } from './EventEmitter.js';
import { Cluster } from './Cluster.js';

import { absolute, getConstructor } from './Utils.js';

let _id = 0;

let Concurrency;

if (typeof window !== 'undefined') {
    Concurrency = navigator.hardwareConcurrency || 4;
}

export class Thread extends EventEmitter {
    static count = Math.max(Math.min(Concurrency, 8), 4);
    static params = {};

    static upload(...objects) {
        if (!this.handlers) {
            this.handlers = [];
        }

        this.handlers.push(...objects);
    }

    static shared(params) {
        if (!this.cluster) {
            this.params = params || {};
            this.params.handlers = this.handlers;
            this.cluster = new Cluster(Thread, this.count);
        }

        return this.cluster.get();
    }

    constructor({
        imports = [],
        classes = [],
        controller = [],
        handlers = []
    } = Thread.params) {
        super();

        this.initWorker(imports, classes, controller, handlers);

        this.addListeners();
    }

    initWorker(imports, classes, controller, handlers) {
        const array = [];

        imports.forEach(bundle => {
            const [path, ...names] = bundle;

            array.push(`import { ${names.join(', ')} } from '${absolute(path)}';`);
        });

        if (classes.length) {
            array.push(classes.map(object => object.toString()).join('\n\n'));
        }

        if (controller.length) {
            const [object, ...handlers] = controller;
            const { name, code } = getConstructor(object);

            array.push(`${code}\n\nnew ${name}();`);

            handlers.forEach(name => this.createMethod(name));
        } else {
            array.push('addEventListener(\'message\', ({ data }) => self[data.message.fn].call(self, data.message));');

            handlers.forEach(object => {
                const { name, code } = getConstructor(object);

                this.createMethod(name);

                array.push(`self.${name} = ${code};`);
            });
        }

        this.worker = new Worker(URL.createObjectURL(new Blob([array.join('\n\n')], { type: 'text/javascript' })), { type: 'module' });
    }

    createMethod(name) {
        if (name.startsWith('void ')) {
            name = name.slice(5);

            this[name] = (message = {}) => this.send(name, message);
        } else {
            this[name] = (message = {}) => new Promise(resolve => this.send(name, message, resolve));
        }
    }

    addListeners() {
        this.worker.addEventListener('message', this.onMessage);
    }

    removeListeners() {
        this.worker.removeEventListener('message', this.onMessage);
    }

    // Event handlers

    onMessage = ({ data }) => {
        if (data.event) {
            this.emit(data.event, data.message);
        } else if (data.id) {
            this.emit(data.id, data.message);
            this.off(data.id);
        }
    };

    // Public methods

    send(name, message = {}, callback) {
        message.fn = name;

        if (callback) {
            _id++;

            message.id = id;

            this.on(id, callback);
        }

        this.worker.postMessage({ message }, message.buffer);
    }

    destroy() {
        this.removeListeners();

        this.worker.terminate();

        return super.destroy();
    }
}
