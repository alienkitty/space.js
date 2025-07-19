import { Color, ColorManagement, LinearSRGBColorSpace, MathUtils, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Interface, Point3D, Stage, TextureLoader, clearTween, delayedCall, getFullscreenTriangle } from '@alienkitty/space.js/three';

export class WorldController {
    static init() {
        this.pointThreshold = 0.1;
        this.isDown = false;

        this.initWorld();
        this.initLoaders();
        this.initControls();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true
        });

        // Output canvas
        this.canvas = new Interface(this.renderer.domElement);
        this.canvas.css({ opacity: 0 });

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(Stage.rootStyle.getPropertyValue('--bg-color').trim());
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.1;
        this.camera.far = 10000;
        this.camera.position.z = 530;
        // this.camera.position.set(0, -1750, 1750);
        this.camera.lookAt(this.scene.position);

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = { value: new Vector2() };
        this.texelSize = { value: new Vector2() };
        this.aspect = { value: 1 };
        this.time = { value: 0 };
        this.frame = { value: 0 };

        // Global settings
        this.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath('../assets/textures/');
    }

    static initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        // this.controls.enableZoom = false;
        // this.controls.rotateSpeed = 0.01;
        // this.controls.zoomSpeed = 0.01;
        // this.controls.panSpeed = 0.01;
        // this.controls.autoRotate = true;
        // this.controls.autoRotateSpeed = 0.1;
        this.controls.minDistance = 0.2;
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
        this.controls.addEventListener('change', this.onChange);
        this.controls.addEventListener('start', this.onInteraction);
        this.controls.addEventListener('end', this.onInteraction);
    }

    // Event handlers

    static onTouchStart = e => {
        e.preventDefault();
    };

    static onChange = () => {
        if (this.isDown) {
            Point3D.hoverEnabled = false;
        }
    };

    static onInteraction = ({ type }) => {
        clearTween(this.timeout);

        if (type === 'start') {
            this.isDown = true;
        } else {
            this.timeout = delayedCall(300, () => {
                this.isDown = false;
                Point3D.hoverEnabled = true;
            });
        }
    };

    // Public methods

    static setPoint(point) {
        // https://discourse.threejs.org/t/solved-rotate-camera-to-face-point-on-sphere/1676
        const camDistance = this.camera.position.length();

        this.camera.position.copy(point).normalize().multiplyScalar(camDistance);
        this.controls.target.copy(point);
    }

    static resize = (width, height, dpr) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.texelSize.value.set(1 / width, 1 / height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;

        this.controls.update();

        if (Point3D.points && Point3D.points.length) {
            Point3D.raycaster.params.Points.threshold = MathUtils.clamp(
                MathUtils.mapLinear(this.controls.getDistance(), this.controls.minDistance, 30, 0.005, this.pointThreshold),
                0.005,
                4
            );

            Point3D.points[0].mesh.scale.setScalar(Point3D.raycaster.params.Points.threshold);
        }
    };

    static animateIn = () => {
        this.canvas.tween({ opacity: 1 }, 1000, 'linear', () => {
            this.canvas.css({ opacity: '' });
        });
    };

    static ready = () => Promise.all([
        this.textureLoader.ready()
    ]);

    // Global handlers

    static getTexture = (path, callback) => this.textureLoader.load(path, callback);

    static loadTexture = path => this.textureLoader.loadAsync(path);
}
