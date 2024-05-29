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
        this.height = this.width * 0.75;

        this.init();
        this.initDragAndDrop();
        this.setValue(this.value);

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative',
            boxSizing: 'border-box',
            width: this.width,
            height: this.height,
            border: '1px solid var(--ui-color-divider-line)',
            cursor: 'pointer'
        });
    }

    initDragAndDrop() {
        this.reader = new FileReader();
    }

    addListeners() {
        this.element.addEventListener('click', this.onClick);
        this.element.addEventListener('dragover', this.onDragOver);
        this.element.addEventListener('drop', this.onDrop);
        this.reader.addEventListener('load', this.onLoad);
    }

    removeListeners() {
        this.element.removeEventListener('click', this.onClick);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('drop', this.onDrop);
        this.reader.removeEventListener('load', this.onLoad);
    }

    // Event handlers

    onClick = () => {
        console.log('onClick');
    };

    onDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    onDrop = e => {
        e.preventDefault();

        this.reader.readAsDataURL(e.dataTransfer.files[0]);
    };

    onLoad = e => {
        const image = new Image();

        image.onload = () => {
            this.setValue(image);

            image.onload = null;
        };

        image.src = e.target.result;
    };

    // Public methods

    setValue(value) {
        this.value = value;

        if (!this.group) {
            this.group = new Interface('.group');
            this.add(this.group);
        }

        const content = new Interface(this.value);
        content.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        });

        const oldGroup = this.group;

        const newGroup = this.group.clone();
        newGroup.add(content);

        this.replace(oldGroup, newGroup);
        this.group = newGroup;

        oldGroup.destroy();

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
