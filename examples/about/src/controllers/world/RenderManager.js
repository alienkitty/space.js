import { AdditiveBlending, Color, MathUtils, Mesh, MeshBasicMaterial, MeshMatcapMaterial, NoBlending, OrthographicCamera, Vector2, WebGLRenderTarget } from 'three';

import { DisplayOptions } from '@alienkitty/space.js/three';
import { BloomCompositeMaterial, DepthMaterial, LuminosityMaterial, MotionBlur, MotionBlurCompositeMaterial, NormalMaterial, UnrealBloomBlurMaterial } from '@alienkitty/alien.js/three';

import { WorldController } from './WorldController.js';
import { CompositeMaterial } from '../../materials/CompositeMaterial.js';

import { layers } from '../../config/Config.js';

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

export class RenderManager {
    static init(renderer, scene, camera, ui) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.ui = ui;

        // Bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;
        this.bloomDistortion = 2.2;

        // Debug
        this.display = DisplayOptions.Default;

        this.enabled = false;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle, textureLoader, getTexture } = WorldController;

        // Manually clear
        this.renderer.autoClear = false;

        // Clear colors
        this.clearColor = new Color(0, 0, 0);
        this.currentClearColor = new Color();

        // Current state
        this.rendererState();

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetB = this.renderTargetA.clone();

        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        this.renderTargetBright = this.renderTargetA.clone();

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetA.depthBuffer = true;

        // Motion blur
        this.motionBlur = new MotionBlur(this.renderer, this.scene, this.camera, layers.velocity, {
            interpolateGeometry: 0
        });

        this.motionBlurCompositeMaterial = new MotionBlurCompositeMaterial(textureLoader);
        this.motionBlurCompositeMaterial.uniforms.tVelocity.value = this.motionBlur.renderTarget.texture;

        // Luminosity high pass material
        this.luminosityMaterial = new LuminosityMaterial();
        this.luminosityMaterial.uniforms.uThreshold.value = this.luminosityThreshold;
        this.luminosityMaterial.uniforms.uSmoothing.value = this.luminositySmoothing;

        // Separable Gaussian blur materials
        this.blurMaterials = [];

        const kernelSizeArray = [3, 5, 7, 9, 11];

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.blurMaterials.push(new UnrealBloomBlurMaterial(kernelSizeArray[i]));
        }

        // Bloom composite material
        this.bloomCompositeMaterial = new BloomCompositeMaterial();
        this.bloomCompositeMaterial.uniforms.tBlur1.value = this.renderTargetsVertical[0].texture;
        this.bloomCompositeMaterial.uniforms.tBlur2.value = this.renderTargetsVertical[1].texture;
        this.bloomCompositeMaterial.uniforms.tBlur3.value = this.renderTargetsVertical[2].texture;
        this.bloomCompositeMaterial.uniforms.tBlur4.value = this.renderTargetsVertical[3].texture;
        this.bloomCompositeMaterial.uniforms.tBlur5.value = this.renderTargetsVertical[4].texture;
        this.bloomCompositeMaterial.uniforms.uBloomFactors.value = this.bloomFactors();

        // Composite material
        this.compositeMaterial = new CompositeMaterial();
        this.compositeMaterial.uniforms.uRGBStrength.value = this.bloomDistortion;

        // Debug materials
        this.blackoutMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.matcap1Material = new MeshMatcapMaterial({ matcap: getTexture('assets/textures/matcaps/040full.jpg') });
        this.matcap2Material = new MeshMatcapMaterial({ matcap: getTexture('assets/textures/matcaps/defaultwax.jpg') });
        this.normalMaterial = new NormalMaterial();
        this.depthMaterial = new DepthMaterial();
    }

    static bloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    static rendererState() {
        this.currentOverrideMaterial = this.scene.overrideMaterial;
        this.currentBackground = this.scene.background;
        this.renderer.getClearColor(this.currentClearColor);
        this.currentClearAlpha = this.renderer.getClearAlpha();
    }

    static restoreRendererState() {
        this.scene.overrideMaterial = this.currentOverrideMaterial;
        this.scene.background = this.currentBackground;
        this.renderer.setClearColor(this.currentClearColor, this.currentClearAlpha);
    }

    // Public methods

    static setCamera = camera => {
        this.camera = camera;

        this.motionBlur.setCamera(camera);
    };

    static invert = isInverted => {
        // Light colour is inverted
        if (isInverted) {
            this.luminosityMaterial.uniforms.uThreshold.value = 0.75;
            this.compositeMaterial.uniforms.uGamma.value = true;
        } else {
            this.luminosityMaterial.uniforms.uThreshold.value = this.luminosityThreshold;
            this.compositeMaterial.uniforms.uGamma.value = false;
        }

        this.ui.setPanelValue('Thresh', this.luminosityMaterial.uniforms.uThreshold.value);
        this.ui.setPanelValue('Gamma', this.compositeMaterial.uniforms.uGamma.value);
    };

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);

        this.motionBlur.setSize(width, height);

        // Unreal bloom
        width = MathUtils.floorPowerOfTwo(width) / 2;
        height = MathUtils.floorPowerOfTwo(height) / 2;

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uResolution.value.set(width, height);

            width /= 2;
            height /= 2;
        }
    };

    static update = () => {
        const renderer = this.renderer;
        const scene = this.scene;
        const camera = this.camera;

        if (!this.enabled) {
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            return;
        }

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Renderer state
        this.rendererState();

        // Scene layer
        camera.layers.set(layers.default);

        renderer.setRenderTarget(renderTargetA);
        renderer.clear();
        renderer.render(scene, camera);

        // Post-processing
        scene.background = null;
        renderer.setClearColor(this.clearColor, 1);

        // Debug override material passes (render to screen)
        if (this.display === DisplayOptions.Depth) {
            scene.overrideMaterial = this.depthMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Geometry) {
            scene.overrideMaterial = this.normalMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Matcap1) {
            scene.overrideMaterial = this.matcap1Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        } else if (this.display === DisplayOptions.Matcap2) {
            scene.overrideMaterial = this.matcap2Material;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(scene, camera);
            this.restoreRendererState();
            return;
        }

        // Motion blur layer
        camera.layers.set(layers.velocity);

        if (this.display === DisplayOptions.Velocity) {
            // Debug pass (render to screen)
            this.motionBlur.update(null);
            this.restoreRendererState();
            return;
        } else {
            this.motionBlur.update();
        }

        this.motionBlurCompositeMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.motionBlurCompositeMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;

        if (this.display === DisplayOptions.Luma) {
            // Debug pass (render to screen)
            this.screen.material = this.blackoutMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.screen.material = this.luminosityMaterial;
            this.screen.material.blending = AdditiveBlending;
            renderer.render(this.screen, this.screenCamera);
            this.restoreRendererState();
            return;
        } else {
            this.screen.material = this.luminosityMaterial;
            this.screen.material.blending = NoBlending;
            renderer.setRenderTarget(renderTargetBright);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Blur all the mips progressively
        let inputRenderTarget = renderTargetBright;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.screen.material = this.blurMaterials[i];

            this.blurMaterials[i].uniforms.tMap.value = inputRenderTarget.texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionX;
            renderer.setRenderTarget(renderTargetsHorizontal[i]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            this.blurMaterials[i].uniforms.tMap.value = this.renderTargetsHorizontal[i].texture;
            this.blurMaterials[i].uniforms.uDirection.value = BlurDirectionY;
            renderer.setRenderTarget(renderTargetsVertical[i]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            inputRenderTarget = renderTargetsVertical[i];
        }

        // Composite all the mips
        this.screen.material = this.bloomCompositeMaterial;

        if (this.display === DisplayOptions.Bloom) {
            // Debug pass (render to screen)
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
            this.restoreRendererState();
            return;
        } else {
            renderer.setRenderTarget(renderTargetsHorizontal[0]);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
        this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Restore renderer settings
        this.restoreRendererState();
    };

    static animateIn = () => {
        this.enabled = true;

        this.ui.setPanelValue('Post', this.enabled);
    };
}
