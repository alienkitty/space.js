/**
 * @author pschroen / https://ufo.ai/
 */

import { Group, Matrix4, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, TextureLoader, Vector2 } from 'three';

import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';

import { EventEmitter } from '../../utils/EventEmitter.js';
import { Interface } from '../../utils/Interface.js';
import { Stage } from '../../utils/Stage.js';
import { Line } from '../../ui/Line.js';
import { Reticle } from '../../ui/Reticle.js';
import { Tracker } from '../../ui/Tracker.js';
import { Point } from '../../ui/Point.js';

import { clearTween, delayedCall } from '../../tween/Tween.js';
import { getScreenSpaceBox } from '../utils/Utils3D.js';

export class Point3D extends Group {
    static init(scene, camera, {
        root = document.body,
        container = document.body,
        physics = null,
        loader = new TextureLoader(),
        uvTexturePath = 'assets/textures/uv.jpg',
        uvHelper = false,
        debug = false
    } = {}) {
        this.events = new EventEmitter();
        this.scene = scene;
        this.camera = camera;
        this.physics = physics;
        this.root = root instanceof Interface ? root : new Interface(root);
        this.container = container instanceof Interface ? container : new Interface(container);
        this.loader = loader;
        this.uvTexturePath = uvTexturePath;
        this.uvHelper = uvHelper;
        this.debug = debug;

        this.objects = [];
        this.points = [];
        this.multiple = [];
        this.instanceId = null;
        this.lastInstanceId = null;
        this.raycaster = new Raycaster();
        this.raycaster.layers.enable(31); // Last layer
        this.mouse = new Vector2(-1, -1);
        this.delta = new Vector2();
        this.coords = new Vector2();
        this.hover = null;
        this.click = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.raycastInterval = 1 / 10; // 10 frames per second
        this.lastRaycast = 0;
        this.halfScreen = new Vector2();
        this.openColor = null;
        this.enabled = true;

        this.initCanvas();
        this.initLoaders();

        this.addListeners();
        this.onResize();
    }

    static initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.canvas.css({
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none'
        });
        this.context = this.canvas.element.getContext('2d');
        this.container.add(this.canvas);
    }

    static initLoaders() {
        if (this.uvHelper) {
            this.uvTexture = this.loader.load(this.uvTexturePath);
        }
    }

    static addListeners() {
        Stage.events.on('color_picker', this.onColorPicker);
        Stage.events.on('invert', this.onInvert);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
        window.addEventListener('keyup', this.onKeyUp);
    }

    static removeListeners() {
        Stage.events.off('color_picker', this.onColorPicker);
        Stage.events.off('invert', this.onInvert);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    // Event handlers

    static onColorPicker = ({ open, target }) => {
        if (open) {
            this.openColor = target;
        } else {
            this.openColor = null;
        }
    };

    static onInvert = () => {
        this.invert();
    };

    static onResize = () => {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;
        this.dpr = window.devicePixelRatio;

        this.halfScreen.set(this.width / 2, this.height / 2);

        this.canvas.element.width = Math.round(this.width * this.dpr);
        this.canvas.element.height = Math.round(this.height * this.dpr);
        this.canvas.element.style.width = this.width + 'px';
        this.canvas.element.style.height = this.height + 'px';
        this.context.scale(this.dpr, this.dpr);

        this.points.forEach(ui => ui.resize());
    };

    static onPointerDown = e => {
        if (!this.enabled) {
            return;
        }

        this.lastTime = performance.now();
        this.lastMouse.set(e.clientX, e.clientY);

        this.onPointerMove(e);

        if (this.hover) {
            this.click = this.hover;
        }
    };

    static onPointerMove = e => {
        if (!this.enabled) {
            return;
        }

        if (e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.coords.x = (this.mouse.x / this.width) * 2 - 1;
            this.coords.y = 1 - (this.mouse.y / this.height) * 2;
        }

        if (document.elementFromPoint(this.mouse.x, this.mouse.y) instanceof HTMLCanvasElement) {
            this.raycaster.setFromCamera(this.coords, this.camera);

            const intersection = this.raycaster.intersectObjects(this.objects);

            if (intersection.length) {
                this.instanceId = intersection[0].instanceId;

                const ui = this.points[this.objects.indexOf(intersection[0].object)];

                if (!this.hover || this.instanceId !== this.lastInstanceId) {
                    this.lastInstanceId = this.instanceId;
                    this.hover = ui;
                    this.hover.onHover({ type: 'over' });
                    this.root.css({ cursor: 'pointer' });
                } else if (this.hover !== ui) {
                    this.hover.onHover({ type: 'out' });
                    this.hover = ui;
                    this.hover.onHover({ type: 'over' });
                    this.root.css({ cursor: 'pointer' });
                }
            } else if (this.hover) {
                this.hover.onHover({ type: 'out' });
                this.hover = null;
                this.root.css({ cursor: '' });
            }
        } else if (this.hover) {
            this.hover.onHover({ type: 'out' });
            this.hover = null;
            this.root.css({ cursor: '' });
        }

        this.delta.subVectors(this.mouse, this.lastMouse);
    };

    static onPointerUp = e => {
        if (!this.enabled) {
            return;
        }

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
            this.click = null;
            return;
        }

        if (this.click && this.click === this.hover) {
            if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                this.points.forEach(ui => {
                    if (ui !== this.click && ui.animatedIn) {
                        ui.animateOut(true);
                        ui.deactivate();
                    }
                });
            }

            this.click.onClick(e.shiftKey);
        } else if (this.openColor && !this.openColor.element.contains(e.target)) {
            Stage.events.emit('color_picker', { open: false, target: this });
        } else if (document.elementFromPoint(this.mouse.x, this.mouse.y) instanceof HTMLCanvasElement) {
            this.animateOut();
        }

        this.click = null;
    };

    static onKeyUp = e => {
        if (e.keyCode >= 48 && e.keyCode <= 57) { // 0-9
            const select = this.points[e.keyCode - 49];

            if (select) {
                if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    this.points.forEach(ui => {
                        if (ui !== select && ui.animatedIn) {
                            ui.animateOut(true);
                            ui.deactivate();
                        }
                    });
                }

                if (!e.ctrlKey) { // Ctrl key reserved for camera perspective
                    select.onHover({ type: 'over' });
                    select.onClick(e.shiftKey);
                }
            } else {
                this.animateOut();
            }
        } else if (e.keyCode === 27) { // Esc
            this.animateOut();
        }
    };

    // Public methods

    static getPoint(mesh) {
        return this.points.find(ui => ui.object === mesh);
    }

    static getSelected() {
        return this.points.filter(ui => ui.selected);
    }

    static getMultipleName() {
        return `${this.multiple.length}&nbsp;Objects`;
    }

    static getMultipleTypes() {
        const types = this.multiple.map(ui => ui.type);
        const counts = {};

        types.forEach(type => {
            counts[type] = counts[type] ? counts[type] + 1 : 1;
        });

        const unique = [...new Set(types)];

        return unique.map(type => `${counts[type]}&nbsp;${type}`).join('<br>');
    }

    static getMultipleTargetNumbers() {
        return this.multiple.map(ui => ui.index + 1);
    }

    static setIndexes() {
        this.points.forEach((ui, i) => ui.setIndex(i));
    }

    static invert() {
        this.points.forEach(ui => ui.resize());
    }

    static update(time) {
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        this.points.forEach(ui => ui.update());

        if (!navigator.maxTouchPoints && time - this.lastRaycast > this.raycastInterval) {
            this.onPointerMove();
            this.lastRaycast = time;
        }
    }

    static add(...points) {
        points.forEach(ui => {
            this.objects.push(ui.object);
            this.points.push(ui);
        });

        this.setIndexes();
    }

    static remove(...points) {
        points.forEach(ui => {
            const index = this.points.indexOf(ui);

            if (~index) {
                this.objects.splice(index, 1);
                this.points.splice(index, 1);
            }

            if (ui === this.hover) {
                this.hover.onHover({ type: 'out' });
                this.hover = null;
                this.root.css({ cursor: '' });
            }
        });

        this.setIndexes();
    }

    static animateOut() {
        this.points.forEach(ui => {
            if (ui.animatedIn) {
                ui.animateOut(true);
                ui.deactivate();
            }
        });

        if (this.hover) {
            this.hover.onHover({ type: 'out' });
            this.hover = null;
            this.root.css({ cursor: '' });
        }
    }

    static destroy() {
        this.removeListeners();

        if (this.uvTexture) {
            this.uvTexture.dispose();
        }

        for (let i = this.points.length - 1; i >= 0; i--) {
            if (this.points[i] && this.points[i].destroy) {
                this.points[i].destroy();
            }
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }

    constructor(mesh, {
        name = mesh.material.name || mesh.geometry.type,
        type = mesh.material.type,
        noTracker = false
    } = {}) {
        super();

        this.object = mesh;
        this.name = name;
        this.type = type;
        this.noTracker = noTracker;
        this.isInstanced = mesh.isInstancedMesh;
        this.isDefault = name === mesh.geometry.type && type === mesh.material.type;
        this.isMultiple = false;
        this.camera = Point3D.camera;
        this.halfScreen = Point3D.halfScreen;

        this.center = new Vector2();
        this.size = new Vector2();
        this.selected = false;
        this.animatedIn = false;

        this.instances = [];
        this.matrix = new Matrix4();

        this.initMesh();
        this.initElement();
        this.initViews();

        Point3D.add(this);
    }

    initMesh() {
        this.object.geometry.computeBoundingSphere();

        const { radius } = this.object.geometry.boundingSphere;

        this.geometry = new SphereGeometry(radius);

        if (Point3D.debug) {
            this.material = new MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });
            this.camera.layers.enable(31); // Last layer
        } else {
            this.material = new MeshBasicMaterial({ visible: false });
        }

        this.mesh = this.createMesh();
    }

    initElement() {
        this.element = new Interface('.target');
        this.element.css({
            position: 'static'
        });
        Point3D.container.add(this.element);
    }

    initViews() {
        const { context } = Point3D;

        this.line = new Line(context);
        this.element.add(this.line);

        this.reticle = new Reticle();
        this.element.add(this.reticle);

        if (!this.noTracker) {
            this.tracker = new Tracker();
            this.element.add(this.tracker);
        }

        this.point = new Point(this, this.tracker);
        this.point.setData({
            name: this.name,
            type: this.type
        });
        this.element.add(this.point);
    }

    createMesh() {
        const { center } = this.object.geometry.boundingSphere;

        const mesh = new Mesh(this.geometry, this.material);
        mesh.position.copy(this.object.position);
        mesh.position.x += center.x;
        mesh.position.y -= center.y; // Y flipped
        mesh.position.z += center.z;
        mesh.scale.copy(this.object.scale);
        mesh.layers.set(31); // Last layer
        this.add(mesh);

        return mesh;
    }

    removeMesh(mesh) {
        this.remove(mesh);
        mesh.material.dispose();
        mesh.geometry.dispose();

        if (mesh.tracker) {
            mesh.tracker.animateOut(() => {
                mesh.tracker = mesh.tracker.destroy();
            });
        }
    }

    setInitialPosition() {
        this.updateMatrixWorld();

        this.reticle.position.copy(this.reticle.target);

        if (this.tracker) {
            this.tracker.position.copy(this.tracker.target);
        }

        this.point.position.copy(this.point.target);
    }

    addListeners() {
        this.panel.events.on('update', this.onUpdate);
    }

    removeListeners() {
        this.panel.events.off('update', this.onUpdate);
    }

    // Event handlers

    onHover = ({ type, isPoint }) => {
        clearTween(this.timeout);

        if (this.tracker && this.selected) {
            if (type === 'over') {
                this.tracker.show();
            } else {
                this.tracker.hide();
            }

            if (isPoint && this.isMultiple) {
                Point3D.multiple.forEach(ui => {
                    if (ui !== this) {
                        ui.onHover({ type });
                    }
                });
            }

            return;
        }

        if (type === 'over') {
            if (this.isInstanced) {
                const { instanceId } = Point3D;

                const { position, quaternion, scale } = this.mesh;

                this.object.getMatrixAt(instanceId, this.matrix);
                this.matrix.decompose(position, quaternion, scale);
            }

            if (!this.animatedIn) {
                this.setInitialPosition();
                this.resize();
                this.animateIn();
            }
        } else {
            this.timeout = delayedCall(2000, () => {
                this.animateOut();
            });
        }

        Point3D.events.emit('hover', { type, target: this });
    };

    onClick = multiple => {
        clearTween(this.timeout);

        if (this.tracker) {
            if (this.isInstanced) {
                const { instanceId } = Point3D;

                if (!this.instances.some(instance => instance.index === instanceId)) {
                    this.toggle(true, multiple);
                } else {
                    this.toggle(false, multiple);
                }

                this.selected = !!this.instances.length;
            } else {
                this.selected = !this.selected;

                if (this.selected) {
                    this.toggle(true, multiple);
                } else {
                    this.toggle(false, multiple);
                }
            }

            const selected = Point3D.getSelected();

            Point3D.events.emit('change', { selected, target: this });
        }

        Point3D.events.emit('click', { target: this });
    };

    onUpdate = ({ value, index, target }) => {
        if (this.isMultiple) {
            Point3D.multiple.forEach(ui => {
                if (ui !== this) {
                    if (index !== undefined) {
                        ui.setPanelIndex(target.name, index);
                    } else if (value !== undefined) {
                        ui.setPanelValue(target.name, value);
                    }
                }
            });
        }
    };

    // Public methods

    setIndex(index) {
        this.index = index;

        if (this.tracker) {
            const targetNumber = index + 1;

            this.tracker.setData({ targetNumber });
            this.point.setTargetNumbers([targetNumber]);
        }
    }

    addPanel(item) {
        this.point.info.addPanel(item);

        if (!this.panel) {
            this.panel = this.point.info.panel;

            this.addListeners();
        }
    }

    setPanelValue(name, value) {
        this.panel.setPanelValue(name, value);
    }

    setPanelIndex(name, index) {
        this.panel.setPanelIndex(name, index);
    }

    toggleNormalsHelper(show) {
        if (show) {
            if (!this.normalsHelper) {
                this.object.geometry.computeBoundingSphere();

                const { radius } = this.object.geometry.boundingSphere;

                this.normalsHelper = new VertexNormalsHelper(this.object, radius / 5);
                Point3D.scene.add(this.normalsHelper);
            }

            this.normalsHelper.visible = true;
        } else if (this.normalsHelper) {
            this.normalsHelper.visible = false;
        }
    }

    toggleTangentsHelper(show) {
        if (show) {
            if (!this.tangentsHelper) {
                this.object.geometry.computeBoundingSphere();
                this.object.geometry.computeTangents();

                const { radius } = this.object.geometry.boundingSphere;

                this.tangentsHelper = new VertexTangentsHelper(this.object, radius / 5);
                Point3D.scene.add(this.tangentsHelper);
            }

            this.tangentsHelper.visible = true;
        } else if (this.tangentsHelper) {
            this.tangentsHelper.visible = false;
        }
    }

    toggleUVHelper(show) {
        const material = this.object.material;

        if (show) {
            if (Point3D.uvTexture && Point3D.uvTexture.image) {
                if (!this.uvTexture) {
                    this.uvTexture = Point3D.uvTexture.clone();
                }

                if (!this.currentMaterialMap && material.map !== this.uvTexture) {
                    this.currentMaterialMap = material.map;

                    material.map = this.uvTexture;
                    material.needsUpdate = true;
                }
            }
        } else {
            material.map = this.currentMaterialMap;
            material.needsUpdate = true;

            if (this.uvTexture) {
                this.uvTexture.dispose();
            }

            delete this.currentMaterialMap;
            delete this.uvTexture;
        }
    }

    resize() {
        this.line.resize();
    }

    update() {
        this.line.setStartPoint(this.reticle.position);
        this.line.setEndPoint(this.point.position);
        this.line.update();
        this.reticle.update();
        this.point.update();
    }

    updateMatrixWorld(force) {
        super.updateMatrixWorld(force);

        this.camera.updateMatrixWorld();

        const box = getScreenSpaceBox(this.mesh, this.camera);
        const center = box.getCenter(this.center).multiply(this.halfScreen);
        const size = box.getSize(this.size).multiply(this.halfScreen);
        const centerX = this.halfScreen.x + center.x;
        const centerY = this.halfScreen.y - center.y;
        const width = Math.round(size.x);
        const height = Math.round(size.y);
        const halfWidth = Math.round(width / 2);
        const halfHeight = Math.round(height / 2);

        this.reticle.target.set(centerX, centerY);

        if (this.tracker) {
            this.tracker.target.set(centerX, centerY);
            this.tracker.update();
            this.tracker.css({
                width,
                height,
                marginLeft: -halfWidth,
                marginTop: -halfHeight
            });
        }

        this.point.target.set(centerX + halfWidth, centerY - halfHeight);

        if (this.isInstanced) {
            this.instances.forEach(instance => {
                const { position, quaternion, scale } = instance;

                this.object.getMatrixAt(instance.index, this.matrix);
                this.matrix.decompose(position, quaternion, scale);

                if (instance.tracker) {
                    const box = getScreenSpaceBox(instance, this.camera);
                    const center = box.getCenter(this.center).multiply(this.halfScreen);
                    const size = box.getSize(this.size).multiply(this.halfScreen);
                    const centerX = this.halfScreen.x + center.x;
                    const centerY = this.halfScreen.y - center.y;
                    const width = Math.round(size.x);
                    const height = Math.round(size.y);
                    const halfWidth = Math.round(width / 2);
                    const halfHeight = Math.round(height / 2);

                    instance.tracker.target.set(centerX, centerY);
                    instance.tracker.update();
                    instance.tracker.css({
                        width,
                        height,
                        marginLeft: -halfWidth,
                        marginTop: -halfHeight
                    });
                }
            });
        } else {
            if (this.normalsHelper) {
                this.normalsHelper.update();
            }

            if (this.tangentsHelper) {
                this.tangentsHelper.update();
            }
        }
    }

    lock() {
        this.point.lock();

        if (this.tracker) {
            this.tracker.lock();

            if (this.isMultiple) {
                Point3D.multiple.forEach(ui => {
                    if (ui !== this) {
                        ui.lock();
                    }
                });
            }
        }
    }

    unlock() {
        this.point.unlock();

        if (this.tracker) {
            this.tracker.unlock();

            if (this.isMultiple) {
                Point3D.multiple.forEach(ui => {
                    if (ui !== this) {
                        ui.unlock();
                    }
                });
            }
        }
    }

    show() {
        if (this.tracker) {
            this.tracker.show();

            if (this.isMultiple) {
                Point3D.multiple.forEach(ui => {
                    if (ui !== this) {
                        ui.show();
                    }
                });
            }
        }
    }

    hide() {
        if (this.tracker) {
            this.tracker.hide(true);

            if (this.isMultiple) {
                Point3D.multiple.forEach(ui => {
                    if (ui !== this) {
                        ui.hide();
                    }
                });
            }
        }
    }

    animateIn(reverse) {
        this.line.animateIn(reverse);
        this.reticle.animateIn();
        this.point.animateIn();

        this.animatedIn = true;
    }

    animateOut(fast, callback) {
        this.line.animateOut(fast, callback);
        this.reticle.animateOut();

        if (this.tracker) {
            this.tracker.animateOut();
        }

        this.point.animateOut();

        this.animatedIn = false;
    }

    toggle(show, multiple) {
        if (this.isInstanced) {
            const { instanceId } = Point3D;

            if (show) {
                if (!this.instances.length) {
                    this.togglePanel(true, multiple);
                }

                if (!multiple) {
                    this.instances.forEach(instance => this.removeMesh(instance));
                    this.instances.length = 0;
                }

                const mesh = this.createMesh();
                mesh.index = instanceId;
                this.instances.push(mesh);

                mesh.tracker = new Tracker();
                this.element.add(mesh.tracker);

                this.updateMatrixWorld();

                mesh.tracker.position.copy(mesh.tracker.target);
                mesh.tracker.animateIn();
            } else {
                if (!multiple) {
                    this.instances.forEach(instance => this.removeMesh(instance));
                    this.instances.length = 0;
                } else {
                    const index = this.instances.findIndex(instance => instance.index === instanceId);

                    if (~index) {
                        this.removeMesh(this.instances[index]);
                        this.instances.splice(index, 1);
                    }
                }

                if (!this.instances.length) {
                    this.togglePanel(false, false);
                }
            }

            if (this.instances.length > 1) {
                this.point.setData({
                    name: `${this.instances.length}&nbsp;Instances`
                });
            } else {
                this.point.setData({
                    name: this.name
                });
            }
        } else {
            this.togglePanel(show, multiple);
        }

        if (Point3D.multiple.length > 1) {
            const ui = Point3D.multiple[0];

            ui.point.setData({
                name: Point3D.getMultipleName(),
                type: Point3D.getMultipleTypes()
            });

            if (ui.tracker) {
                ui.point.setTargetNumbers(Point3D.getMultipleTargetNumbers());
            }

            ui.isMultiple = true;
        } else if (Point3D.multiple.length) {
            const ui = Point3D.multiple[0];

            Point3D.multiple.length = 0;

            ui.point.setData({
                name: ui.name,
                type: ui.type
            });

            if (ui.tracker) {
                ui.point.setTargetNumbers([ui.index + 1]);
            }

            ui.isMultiple = false;
        }
    }

    togglePanel(show, multiple) {
        if (show) {
            this.line.animateOut(true);
            this.reticle.animateOut();

            if (this.tracker) {
                this.tracker.animateIn(this.isInstanced);
            }

            const selected = Point3D.getSelected();

            if (multiple && selected.length > 1) {
                if (!Point3D.multiple.length) {
                    const ui = selected.filter(ui => ui !== this)[0];

                    Point3D.multiple.push(ui);
                }

                Point3D.multiple.push(this);

                this.line.deactivate();
                this.point.deactivate();
            } else {
                this.point.open();

                Stage.events.emit('color_picker', { open: false, target: this.panel });
            }
        } else {
            this.line.animateIn(true);
            this.reticle.animateIn();

            if (this.tracker) {
                this.tracker.animateOut();
            }

            if (this.isMultiple) {
                Point3D.multiple.length = 0;

                this.point.setData({
                    name: this.name,
                    type: this.type
                });

                if (this.tracker) {
                    this.point.setTargetNumbers([this.index + 1]);
                }

                this.isMultiple = false;
            } else if (Point3D.multiple.length) {
                const index = Point3D.multiple.indexOf(this);

                if (~index) {
                    Point3D.multiple.splice(index, 1);
                }
            }

            this.point.enable();
            this.point.close();
        }
    }

    snap() {
        // Top-left window snap
        if (this.point.originPosition.x < 20) {
            this.point.originPosition.x = this.point.tracker.locked ? 10 : -18;
        }

        if (this.point.originPosition.y < 83) {
            this.point.originPosition.y = 73;
        }

        // Panel snap
        Point3D.points.forEach(ui => {
            if (ui === this || !ui.point.isMove) {
                return;
            }

            let gap = 20;

            if (this.point.tracker.locked) {
                gap += 28;
            }

            const min = gap - 10;
            const max = gap + 10;

            if (this.point.originPosition.distanceTo(ui.point.originPosition) < Math.max(this.point.bounds.width, ui.point.bounds.width) + max) {
                // Left
                if (
                    this.point.originPosition.x > ui.point.originPosition.x - this.point.bounds.width - max &&
                    this.point.originPosition.x < ui.point.originPosition.x - this.point.bounds.width - min
                ) {
                    this.point.originPosition.x = ui.point.originPosition.x - this.point.bounds.width - gap;
                }

                // Right
                if (
                    this.point.originPosition.x > ui.point.originPosition.x + ui.point.bounds.width + min &&
                    this.point.originPosition.x < ui.point.originPosition.x + ui.point.bounds.width + max
                ) {
                    this.point.originPosition.x = ui.point.originPosition.x + ui.point.bounds.width + gap;
                }

                // Top
                if (
                    this.point.originPosition.y > ui.point.originPosition.y - 10 &&
                    this.point.originPosition.y < ui.point.originPosition.y + 10
                ) {
                    this.point.originPosition.y = ui.point.originPosition.y;
                }
            }
        });
    }

    deactivate() {
        if (this.isInstanced) {
            this.instances.forEach(instance => this.removeMesh(instance));
            this.instances.length = 0;

            this.point.setData({
                name: this.name
            });
        }

        if (this.isMultiple) {
            Point3D.multiple.length = 0;

            this.point.setData({
                name: this.name,
                type: this.type
            });

            if (this.tracker) {
                this.point.setTargetNumbers([this.index + 1]);
            }

            this.isMultiple = false;
        }

        this.selected = false;
        this.line.deactivate();
        this.point.deactivate();

        const selected = Point3D.getSelected();

        Point3D.events.emit('change', { selected, target: this });
    }

    destroy() {
        this.removeListeners();

        if (this.normalsHelper) {
            this.toggleNormalsHelper(false);
            Point3D.scene.remove(this.normalsHelper);
            this.normalsHelper.dispose();
        }

        if (this.tangentsHelper) {
            this.toggleTangentsHelper(false);
            Point3D.scene.remove(this.tangentsHelper);
            this.tangentsHelper.dispose();
        }

        if (this.currentMaterialMap) {
            this.toggleUVHelper(false);
        }

        if (this.isInstanced) {
            this.instances.forEach(instance => this.removeMesh(instance));
            this.instances.length = 0;
        }

        this.material.dispose();
        this.geometry.dispose();

        this.animateOut(false, () => {
            this.element = this.element.destroy();
        });
    }
}
