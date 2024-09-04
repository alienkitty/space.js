/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector2 } from '../math/Vector2.js';
import { Interface } from '../utils/Interface.js';
import { Stage } from '../utils/Stage.js';

export class PanelThumbnail extends Interface {
    constructor({
        name,
        flipY = false,
        data = {},
        value,
        callback
    }) {
        super('.panel-thumbnail');

        this.name = name;
        this.flipY = flipY;
        this.data = data;
        this.value = value;
        this.callback = callback;

        this.width = parseFloat(Stage.rootStyle.getPropertyValue('--ui-panel-width').trim());
        this.diagonal = this.width * 1.414;
        this.lineOffset = -(this.diagonal - this.width) / 2 + 1;

        this.origin = new Vector2();
        this.mouse = new Vector2();
        this.delta = new Vector2();
        this.bounds = null;
        this.thumbnails = [];
        this.lastTime = 0;
        this.lastMouse = new Vector2();
        this.isDragging = false;
        this.snapPosition = new Vector2();
        this.snapTarget = new Vector2();
        this.snapped = null;
        this.duplicate = null;

        this.init();
        this.initDragAndDrop();
        this.setValue(this.value);

        this.addListeners();
    }

    init() {
        this.css({
            position: 'relative'
        });

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
        Stage.events.on('thumbnail_drop', this.onThumbnailDrop);
        this.container.element.addEventListener('click', this.onClick);
        this.input.element.addEventListener('change', this.onChange);
        this.element.addEventListener('dragover', this.onDragOver);
        this.element.addEventListener('drop', this.onDrop);
        this.reader.addEventListener('load', this.onLoad);
        window.addEventListener('keyup', this.onKeyUp);
    }

    removeListeners() {
        Stage.events.off('thumbnail_drop', this.onThumbnailDrop);
        this.container.element.removeEventListener('click', this.onClick);
        this.input.element.removeEventListener('change', this.onChange);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('drop', this.onDrop);
        this.reader.removeEventListener('load', this.onLoad);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    imageToCanvas(image) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');

        if (this.flipY) {
            context.translate(0, canvas.height);
            context.scale(1, -1);
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        return canvas;
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

    onThumbnailDrop = ({ element, data, value }) => {
        if (element === this.element) {
            this.setData(data);
            this.setValue(value);
        }
    };

    onClick = e => {
        e.preventDefault();

        this.input.element.click();
    };

    onPointerDown = e => {
        this.lastTime = performance.now();
        this.lastMouse.set(e.clientX, e.clientY);

        this.onPointerMove(e);

        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    };

    onPointerMove = e => {
        const event = {
            x: e.clientX,
            y: e.clientY
        };

        this.mouse.copy(event);
        this.delta.subVectors(this.mouse, this.lastMouse);

        if (this.delta.length()) {
            if (!this.isDragging) {
                this.isDragging = true;

                Stage.events.emit('thumbnail_dragging', { dragging: this.isDragging, target: this });

                if (e.altKey) {
                    this.duplicate = this.wrapper.clone(true);
                    this.addBefore(this.duplicate, this.wrapper);

                    const canvas = this.duplicate.element.querySelector('canvas');

                    if (canvas) {
                        canvas.getContext('2d').drawImage(this.wrapper.children[0].element, 0, 0, canvas.width, canvas.height);
                    }
                }
            }

            this.origin.copy(this.delta);

            this.bounds = this.element.getBoundingClientRect();
            this.thumbnails = [...document.querySelectorAll('.panel-thumbnail')];
            this.thumbnails = this.thumbnails.filter(element => element !== this.element).map(element => {
                return {
                    element,
                    bounds: element.getBoundingClientRect()
                };
            });

            this.snap();
        }
    };

    onPointerUp = e => {
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);

        this.onPointerMove(e);

        let intersects = false;

        this.thumbnails.forEach(({ element }) => {
            if (this.wrapper.intersects(element)) {
                Stage.events.emit('thumbnail_drop', { element, data: this.data, value: this.value, target: this });

                if (!e.altKey) {
                    this.setValue(null);
                }

                intersects = true;
            }
        });

        if (!intersects && !this.wrapper.intersects(this.element) && !e.altKey) {
            this.setValue(null);
        }

        this.wrapper.css({ left: 0, top: 0 });
        this.isDragging = false;

        Stage.events.emit('thumbnail_dragging', { dragging: this.isDragging, target: this });

        if (this.duplicate) {
            this.duplicate = this.duplicate.destroy();
        }

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            return;
        }

        this.input.element.click();
    };

    onKeyUp = e => {
        if (e.keyCode === 27) { // Esc
            if (this.isDragging) {
                window.removeEventListener('pointermove', this.onPointerMove);
                window.removeEventListener('pointerup', this.onPointerUp);

                this.wrapper.css({ left: 0, top: 0 });
                this.isDragging = false;

                Stage.events.emit('thumbnail_dragging', { dragging: this.isDragging, target: this });

                if (this.duplicate) {
                    this.duplicate = this.duplicate.destroy();
                }
            }
        }
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

    hasContent() {
        return !!this.group;
    }

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

    toggleContent(show) {
        if (show) {
            this.group.show();
        } else {
            this.group.hide();
        }
    }

    setData(data) {
        if (!data) {
            return;
        }

        this.data = data;
    }

    setValue(value) {
        if (value instanceof ImageBitmap) {
            this.value = this.imageToCanvas(value);
        } else if (value && value.nodeName) {
            this.value = value.cloneNode();

            if (this.value instanceof HTMLCanvasElement) {
                this.value.getContext('2d').drawImage(value, 0, 0, this.value.width, this.value.height);
            }
        } else {
            this.value = value;
        }

        if (!this.wrapper) {
            this.wrapper = new Interface('.wrapper');
            this.wrapper.css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: this.width,
                height: this.width,
                cursor: 'move',
                zIndex: 1
            });
            this.add(this.wrapper);
        }

        const content = new Interface(this.value);
        content.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
        });

        const oldWrapper = this.wrapper;
        oldWrapper.element.removeEventListener('pointerdown', this.onPointerDown);

        const newWrapper = this.wrapper.clone();
        newWrapper.element.addEventListener('pointerdown', this.onPointerDown);
        newWrapper.add(content);

        this.replace(oldWrapper, newWrapper);
        this.wrapper = newWrapper;

        oldWrapper.destroy();

        if (this.value) {
            this.wrapper.show();
        } else {
            this.wrapper.hide();
            this.input.element.value = '';
        }

        this.update();
    }

    update() {
        this.events.emit('update', { path: [], value: this.value, target: this });

        if (this.callback) {
            this.callback(this.value, this);
        }
    }

    topLeftSnap(target, bounds) {
        let snapped = false;

        if (target.distanceTo(bounds) < bounds.width + 10) {
            // Top
            if (target.y > bounds.y - 10 && target.y < bounds.y + 10) {
                target.y = bounds.y;
                snapped = true;
            }

            // Left
            if (target.x > bounds.x - 10 && target.x < bounds.x + 10) {
                target.x = bounds.x;
                snapped = true;
            }
        }

        return snapped;
    }

    snap() {
        const currentSnapped = this.snapped;

        let snapped = null;

        this.snapPosition.addVectors(this.bounds, this.origin);
        this.snapTarget.copy(this.snapPosition);

        if (this.topLeftSnap(this.snapTarget, this.bounds)) {
            snapped = this.element;
        }

        this.thumbnails.forEach(({ element, bounds }) => {
            if (this.topLeftSnap(this.snapTarget, bounds)) {
                snapped = element;
            }
        });

        this.snapPosition.sub(this.snapTarget);
        this.origin.sub(this.snapPosition); // Subtract delta

        this.wrapper.css({ left: this.origin.x, top: this.origin.y });

        this.snapped = snapped;

        if (this.snapped !== currentSnapped) {
            Stage.events.emit('thumbnail_snap', { element: this.snapped, target: this });
        }
    }

    destroy() {
        this.removeListeners();

        return super.destroy();
    }
}
