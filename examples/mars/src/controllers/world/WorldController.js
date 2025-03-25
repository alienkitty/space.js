import { Color, ColorManagement, DirectionalLight, HemisphereLight, LinearSRGBColorSpace, MathUtils, PerspectiveCamera, SRGBColorSpace, Scene, Vector2, WebGLRenderer } from 'three';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Interface, Stage, TextureLoader, getFullscreenTriangle } from '@alienkitty/space.js/three';

import { assetPath } from '../../config/Config.js';

export class WorldController {
    static init() {
        this.backgroundIntensity = 1.2;

        this.initWorld();
        this.initLights();
        this.initLoaders();
        this.initBackground();
        this.initControls();

        this.addListeners();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance'
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

        // Oblique camera
        this.obliqueCamera = new PerspectiveCamera(30);
        this.obliqueCamera.near = 0.1;
        this.obliqueCamera.far = 20000;
        this.obliqueCamera.position.set(-1.3, 0.7, 2.015);
        this.obliqueCamera.lookAt(this.scene.position);

        // North polar camera
        this.northPolarCamera = new PerspectiveCamera(30);
        this.northPolarCamera.near = 0.1;
        this.northPolarCamera.far = 20000;
        this.northPolarCamera.position.set(0, 2.5, 0);
        this.northPolarCamera.lookAt(this.scene.position);

        // South polar camera
        this.southPolarCamera = new PerspectiveCamera(30);
        this.southPolarCamera.near = 0.1;
        this.southPolarCamera.far = 20000;
        this.southPolarCamera.position.set(0, -2.5, 0);
        this.southPolarCamera.lookAt(this.scene.position);

        // Point of interest #1 camera
        this.point1Camera = new PerspectiveCamera(30);
        this.point1Camera.near = 0.1;
        this.point1Camera.far = 20000;
        this.point1Camera.position.set(0, -0.25, 1.6);
        this.point1Camera.rotation.y = MathUtils.degToRad(3);

        // Point of interest #2 camera
        this.point2Camera = new PerspectiveCamera(30);
        this.point2Camera.near = 0.1;
        this.point2Camera.far = 20000;
        this.point2Camera.position.set(0, 0, 1.25);

        // Point of interest #3 camera
        this.point3Camera = new PerspectiveCamera(30);
        this.point3Camera.near = 0.1;
        this.point3Camera.far = 20000;
        this.point3Camera.position.set(-0.62, 0, 1);
        this.point3Camera.rotation.y = MathUtils.degToRad(-10);
        this.point3Camera.rotation.z = MathUtils.degToRad(90);

        // Output camera
        this.camera = this.obliqueCamera;

        // Global geometries
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = { value: new Vector2() };
        this.texelSize = { value: new Vector2() };
        this.aspect = { value: 1 };
        this.time = { value: 0 };
        this.frame = { value: 0 };

        // Global settings
        // this.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        this.anisotropy = 8;
    }

    static initLights() {
        this.scene.add(new HemisphereLight(0x606060, 0x404040, 0));

        const light = new DirectionalLight(0xffffff, 3);
        light.position.set(-3, 1.5, 3);
        this.scene.add(light);
    }

    static initLoaders() {
        this.textureLoader = new TextureLoader();
        this.textureLoader.setPath(`${assetPath}/textures/`);

        this.ktx2Loader = new KTX2Loader();
        this.ktx2Loader.setPath(`${assetPath}/textures/cube/`);
        this.ktx2Loader.setTranscoderPath('https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/');
        this.ktx2Loader.detectSupport(this.renderer);
        // TODO: Fix KTX2Loader setPath()
        // console.log('initLoaders', this.ktx2Loader.path);
    }

    static async initBackground() {
        const cubeTexture = await this.loadCompressedTexture(`${assetPath}/textures/cube/hiptyc_2020_cube.ktx2`);
        cubeTexture.colorSpace = SRGBColorSpace;

        this.scene.background = cubeTexture;
        this.scene.backgroundIntensity = this.backgroundIntensity;
        this.scene.backgroundRotation.x = MathUtils.degToRad(180);
        this.scene.backgroundRotation.z = MathUtils.degToRad(180);
    }

    static initControls() {
        // Oblique camera controls
        this.obliqueCameraControls = new OrbitControls(this.obliqueCamera, this.renderer.domElement);
        this.obliqueCameraControls.enableDamping = true;
        this.obliqueCameraControls.enabled = false;

        // Output camera controls
        this.controls = this.obliqueCameraControls;
        this.controls.enabled = true;
    }

    static addListeners() {
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
    }

    // Event handlers

    static onTouchStart = e => {
        e.preventDefault();
    };

    // Public methods

    static setCamera = camera => {
        this.camera = camera;
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
        this.textureLoader.ready()
    ]);

    // Global handlers

    static loadTexture = path => this.textureLoader.loadAsync(path);

    static loadCompressedTexture = path => this.ktx2Loader.loadAsync(path);
}
