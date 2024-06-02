/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

export class PanelThumbnail extends Interface {
    constructor({
        name,
        value,
        callback
    }) {
        super('.panel-thumbnail');

        this.name = name;
        this.value = value;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.diagonal = this.width * 1.414;
        this.lineOffset = -(this.diagonal - this.width) / 2 + 1;

        this.init();
        this.initDragAndDrop();
        this.setValue(this.value);

        this.addListeners();
    }

    init() {
        this.container = new Interface('.container');
        this.container.css({
            position: 'relative',
            boxSizing: 'border-box',
            width: this.width,
            height: this.width,
            border: '1px solid var(--ui-color-divider-line)',
            cursor: 'pointer'
        });
        this.add(this.container);

        this.line = new Interface('.line');
        this.line.css({
            position: 'absolute',
            left: this.lineOffset,
            right: this.lineOffset,
            boxSizing: 'border-box',
            height: this.width / 2 - 0.5,
            borderBottom: '1px solid var(--ui-color-divider-line)',
            transformOrigin: 'center bottom',
            rotation: -45,
            pointerEvents: 'none'
        });
        this.container.add(this.line);

        // Not added to DOM
        this.input = new Interface(null, 'input');
        this.input.attr({
            type: 'file',
            accept: 'image/*'
        });
    }

    initDragAndDrop() {
        this.reader = new FileReader();
    }

    addListeners() {
        this.container.element.addEventListener('click', this.onClick);
        this.container.element.addEventListener('dragover', this.onDragOver);
        this.container.element.addEventListener('drop', this.onDrop);
        this.input.element.addEventListener('change', this.onChange);
        this.reader.addEventListener('load', this.onLoad);
    }

    removeListeners() {
        this.container.element.removeEventListener('click', this.onClick);
        this.container.element.removeEventListener('dragover', this.onDragOver);
        this.container.element.removeEventListener('drop', this.onDrop);
        this.input.element.removeEventListener('change', this.onChange);
        this.reader.removeEventListener('load', this.onLoad);
    }

    loadImage(path) {
        const image = new Image();

        image.onload = () => {
            this.setValue(image);

            image.onload = null;
        };

        image.src = path;
    }

    // Event handlers

    onClick = e => {
        e.preventDefault();

        this.input.element.click();
    };

    onDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    onDrop = e => {
        e.preventDefault();

        this.reader.readAsDataURL(e.dataTransfer.files[0]);
    };

    onChange = e => {
        e.preventDefault();

        if (e.target.files.length) {
            this.reader.readAsDataURL(e.target.files[0]);
        }
    };

    onLoad = e => {
        this.loadImage(e.target.result);
    };

    onUpdate = e => {
        this.events.emit('update', e);
    };

    // Public methods

    setContent(content) {
        content.events.on('update', this.onUpdate);

        if (!this.group) {
            this.group = new Interface('.group');
            this.group.css({
                position: 'relative'
            });
            this.add(this.group);
        }

        const oldGroup = this.group;

        const newGroup = this.group.clone();
        newGroup.add(content);

        this.replace(oldGroup, newGroup);
        this.group = newGroup;

        oldGroup.destroy();
    }

    setValue(value) {
        if (value instanceof ImageBitmap) {
            const canvas = document.createElement('canvas');
            canvas.width = value.width;
            canvas.height = value.height;
            canvas.getContext('2d').drawImage(value, 0, 0, canvas.width, canvas.height);
            this.loadImage(canvas.toDataURL());
            return;
        } else {
            this.value = value;
        }

        if (!this.wrapper) {
            this.wrapper = new Interface('.wrapper');
            this.container.add(this.wrapper);
        }

        const content = new Interface(this.value && this.value.cloneNode());
        content.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        });

        const oldWrapper = this.wrapper;

        const newWrapper = this.wrapper.clone();
        newWrapper.add(content);

        this.replace(oldWrapper, newWrapper);
        this.wrapper = newWrapper;

        oldWrapper.destroy();

        this.update();
    }

    update() {
        this.events.emit('update', { value: this.value, target: this });

        if (this.callback) {
            this.callback(this.value, this);
        }
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
