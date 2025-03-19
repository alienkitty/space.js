import { /* BasicShadowMap,  */Color, ColorManagement, DirectionalLight, HemisphereLight, LinearSRGBColorSpace, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BufferGeometryLoader, EnvironmentTextureLoader, Interface, Stage, TextureLoader, getFullscreenTriangle, getViewSize } from '@alienkitty/space.js/three';
import { OimoPhysics } from '@alienkitty/alien.js/three/oimophysics';

export class WorldController {
    static init() {
        this.initWorld();
        this.initLights();
        this.initLoaders();
        this.initEnvironment();
        this.initControls();
        this.initPhysics();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            // alpha: true,
            antialias: true
        });

        // Output canvas
        // this.element = this.renderer.domElement;
        this.canvas = new Interface(this.renderer.domElement);
        this.canvas.css({ opacity: 0 });

        // Disable color management
        ColorManagement.enabled = false;
        this.renderer.outputColorSpace = LinearSRGBColorSpace;

        // Shadows
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = BasicShadowMap;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(Stage.rootStyle.getPropertyValue('--bg-color').trim());

        // Polar camera
        this.polarCamera = new PerspectiveCamera(30);
        this.polarCamera.near = 0.5;
        this.polarCamera.far = 40;
        this.polarCamera.position.set(0, 10, 0);
        this.polarCamera.lookAt(this.scene.position);

        // Oblique camera
        this.obliqueCamera = new PerspectiveCamera(30);
        this.obliqueCamera.near = 0.5;
        this.obliqueCamera.far = 40;
        this.obliqueCamera.position.set(0, 6, 8);
        this.obliqueCamera.lookAt(this.scene.position);

        // Isometric camera
        this.isometricCamera = new OrthographicCamera();
        this.isometricCamera.near = 0;
        this.isometricCamera.far = 40;
        this.isometricCamera.position.set(10, 10, 10);
        this.isometricCamera.lookAt(this.scene.position);

        // Output camera
        this.camera = this.obliqueCamera;

        // Global geometries
        this.quad = new PlaneGeometry(1, 1);
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

    static initLights() {
        this.scene.add(new HemisphereLight(0xffffff, 0x888888, 3));

        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(5, 5, 5);
        // light.castShadow = true;
        // light.shadow.mapSize.width = 2048;
        // light.shadow.mapSize.height = 2048;
        this.scene.add(light);
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath('/examples/assets/textures/');
        /* this.textureLoader.setOptions({
            preserveData: true
        });
        this.textureLoader.cache = true; */

        this.environmentLoader = new EnvironmentTextureLoader(this.renderer);
        this.environmentLoader.setPath('/examples/assets/textures/env/');

        this.bufferGeometryLoader = new BufferGeometryLoader();
        this.bufferGeometryLoader.setPath('/examples/assets/geometry/');
    }

    static async initEnvironment() {
        this.scene.environment = await this.loadEnvironmentTexture('jewelry_black_contrast.jpg');
        this.scene.environmentIntensity = 1.2;
    }

    static initControls() {
        // Polar camera controls
        this.polarCameraControls = new OrbitControls(this.polarCamera, this.renderer.domElement);
        this.polarCameraControls.enableDamping = true;
        this.polarCameraControls.maxPolarAngle = 0;
        this.polarCameraControls.enabled = false;

        // Oblique camera controls
        this.obliqueCameraControls = new OrbitControls(this.obliqueCamera, this.renderer.domElement);
        this.obliqueCameraControls.enableDamping = true;
        this.obliqueCameraControls.enabled = false;

        // Isometric camera controls
        this.isometricCameraControls = new OrbitControls(this.isometricCamera, this.renderer.domElement);
        this.isometricCameraControls.enableDamping = true;
        this.isometricCameraControls.enabled = false;

        // Output camera controls
        this.controls = this.obliqueCameraControls;
        this.controls.enabled = true;
    }

    static initPhysics() {
        this.physics = new OimoPhysics();
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
    }

    // Event handlers

    static onTouchStart = e => {
        e.preventDefault();
    };

    // Public methods

    static setCamera = (camera, controls) => {
        this.camera = camera;
        this.controls = controls;

        this.polarCameraControls.enabled = false;
        this.obliqueCameraControls.enabled = false;
        this.isometricCameraControls.enabled = false;

        this.controls.enabled = true;
    };

    static resize = (width, height, dpr) => {
        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.texelSize.value.set(1 / width, 1 / height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };

    static animateIn = () => {
        this.canvas.tween({ opacity: 1 }, 1000, 'linear', () => {
            this.canvas.css({ opacity: '' });
        });
    };

    static ready = () => Promise.all([
        this.textureLoader.ready(),
        this.environmentLoader.ready(),
        this.bufferGeometryLoader.ready()
    ]);

    // Global handlers

    static getTexture = (path, callback) => this.textureLoader.load(path, callback);

    static loadTexture = path => this.textureLoader.loadAsync(path);

    static loadEnvironmentTexture = path => this.environmentLoader.loadAsync(path);

    static getBufferGeometry = (path, callback) => this.bufferGeometryLoader.load(path, callback);

    static loadBufferGeometry = path => this.bufferGeometryLoader.loadAsync(path);

    static getViewSize = object => getViewSize(this.camera, object);
}
