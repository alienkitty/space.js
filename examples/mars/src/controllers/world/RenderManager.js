import { Color, MathUtils, Mesh, MeshBasicMaterial, OrthographicCamera, Vector2, Vector3, WebGLRenderTarget } from 'three';
import { BloomCompositeMaterial, BlurMaterial, LuminosityMaterial, SMAABlendMaterial, SMAAEdgesMaterial, SMAAWeightsMaterial, UnrealBloomBlurMaterial } from '@alienkitty/alien.js/three';

import { WorldController } from './WorldController.js';
import { VolumetricLightLensflareMaterial } from '../../materials/VolumetricLightLensflareMaterial.js';
import { SceneCompositeMaterial } from '../../materials/SceneCompositeMaterial.js';
import { CompositeMaterial } from '../../materials/CompositeMaterial.js';

import { layers } from '../../config/Config.js';

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

export class RenderManager {
    static init(renderer, scene, camera, view) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.view = view;

        // Bloom
        this.bloomReduction = 0.3;
        this.bloomBoost = 6;
        this.bloomClamp = 1;
        this.bloomResolutionScale = 0.25;
        this.bloomAmount = 1;

        // Anamorphic light, radial glow and lens flare
        this.lightPosition = new Vector3();
        this.cameraDirection = new Vector3();
        this.glowPower = 0.3;
        this.glowAmount = 0;
        this.vlScale = new Vector2(0.97, -1);
        this.vlSwizzle = 0;
        this.vlExposure = 0.15;
        this.vlDecay = 0.93;
        this.vlDensity = 1;
        this.vlWeight = 1;
        this.vlClamp = 1;
        this.lensflareScale = new Vector2(2.9, 2.9);
        this.lensflareExposure = 0.3;
        this.lensflareClamp = 1;
        this.blurResolutionScale = 1;
        this.blurAmount = 2.5;

        // Unreal bloom
        this.luminosityThreshold = 0.1;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        // Final
        this.rgbAmount = 0.1;
        this.reduction = 0.2;
        this.boost = 1.2;
        this.toneMapping = true;
        this.toneMappingExposure = 1.8;
        this.gammaCorrection = false;
        this.smaa = true;

        this.animatedIn = false;
        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle, resolution, texelSize, textureLoader } = WorldController;

        // Manually clear
        this.renderer.autoClear = false;

        // Clear colors
        this.clearColor = new Color(0, 0, 0);
        this.currentClearColor = new Color();

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetB = this.renderTargetA.clone();
        this.renderTargetEdges = this.renderTargetA.clone();
        this.renderTargetWeights = this.renderTargetA.clone();

        this.renderTargetBloomA = this.renderTargetA.clone();
        this.renderTargetBloomB = this.renderTargetA.clone();
        this.renderTargetBlurA = this.renderTargetA.clone();
        this.renderTargetBlurB = this.renderTargetA.clone();

        this.renderTargetBright = this.renderTargetA.clone();
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetB.depthBuffer = true;
        this.renderTargetBlurA.depthBuffer = true;

        // Occlusion material
        this.blackoutMaterial = new MeshBasicMaterial({ color: 0x000000 });

        // Gaussian blur materials
        this.hBloomMaterial = new BlurMaterial(BlurDirectionX);
        this.hBloomMaterial.uniforms.uBlurAmount.value = this.bloomAmount;

        this.vBloomMaterial = new BlurMaterial(BlurDirectionY);
        this.vBloomMaterial.uniforms.uBlurAmount.value = this.bloomAmount;

        this.hBlurMaterial = new BlurMaterial(BlurDirectionX);
        this.hBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;

        this.vBlurMaterial = new BlurMaterial(BlurDirectionY);
        this.vBlurMaterial.uniforms.uBlurAmount.value = this.blurAmount;

        // Volumetric light material
        this.vlMaterial = new VolumetricLightLensflareMaterial();
        this.vlMaterial.uniforms.uPower.value = this.glowPower;
        this.vlMaterial.uniforms.uAmount.value = this.glowAmount;
        this.vlMaterial.uniforms.uScale.value = this.vlScale.clone();
        this.vlMaterial.uniforms.uSwizzle.value = this.vlSwizzle;
        this.vlMaterial.uniforms.uExposure.value = this.vlExposure;
        this.vlMaterial.uniforms.uDecay.value = this.vlDecay;
        this.vlMaterial.uniforms.uDensity.value = this.vlDensity;
        this.vlMaterial.uniforms.uWeight.value = this.vlWeight;
        this.vlMaterial.uniforms.uClamp.value = this.vlClamp;
        this.vlMaterial.uniforms.uLensflareScale.value = this.lensflareScale.clone();
        this.vlMaterial.uniforms.uLensflareExposure.value = this.lensflareExposure;
        this.vlMaterial.uniforms.uLensflareClamp.value = this.lensflareClamp;
        this.vlMaterial.uniforms.uResolution = resolution;

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

        // Unreal bloom composite material
        this.bloomCompositeMaterial = new BloomCompositeMaterial();
        this.bloomCompositeMaterial.uniforms.tBlur1.value = this.renderTargetsVertical[0].texture;
        this.bloomCompositeMaterial.uniforms.tBlur2.value = this.renderTargetsVertical[1].texture;
        this.bloomCompositeMaterial.uniforms.tBlur3.value = this.renderTargetsVertical[2].texture;
        this.bloomCompositeMaterial.uniforms.tBlur4.value = this.renderTargetsVertical[3].texture;
        this.bloomCompositeMaterial.uniforms.tBlur5.value = this.renderTargetsVertical[4].texture;
        this.bloomCompositeMaterial.uniforms.uBloomFactors.value = this.bloomFactors();

        // Composite materials
        this.sceneCompositeMaterial = new SceneCompositeMaterial();
        this.sceneCompositeMaterial.uniforms.uBloomReduction.value = this.bloomReduction;
        this.sceneCompositeMaterial.uniforms.uBloomBoost.value = this.bloomBoost;
        this.sceneCompositeMaterial.uniforms.uBloomClamp.value = this.bloomClamp;

        this.compositeMaterial = new CompositeMaterial();
        this.compositeMaterial.uniforms.uRGBAmount.value = this.rgbAmount;
        this.compositeMaterial.uniforms.uReduction.value = this.reduction;
        this.compositeMaterial.uniforms.uBoost.value = this.boost;
        this.compositeMaterial.uniforms.uToneMapping.value = this.toneMapping;
        this.compositeMaterial.uniforms.uExposure.value = this.toneMappingExposure;
        this.compositeMaterial.uniforms.uGamma.value = this.gammaCorrection;

        // SMAA edge detection material
        this.edgesMaterial = new SMAAEdgesMaterial();
        this.edgesMaterial.uniforms.uTexelSize = texelSize;

        // SMAA weights material
        this.weightsMaterial = new SMAAWeightsMaterial(textureLoader, {
            areaTexturePath: 'smaa/area.png',
            searchTexturePath: 'smaa/search.png'
        });
        this.weightsMaterial.uniforms.uTexelSize = texelSize;

        // SMAA material
        this.smaaMaterial = new SMAABlendMaterial();
        this.smaaMaterial.uniforms.tWeightMap.value = this.renderTargetWeights.texture;
        this.smaaMaterial.uniforms.uTexelSize = texelSize;
    }

    static bloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    static setLightPosition() {
        this.camera.getWorldDirection(this.cameraDirection);

        // Only when the Sun is facing the camera
        if (!this.animatedIn || this.cameraDirection.z < 0) {
            this.lightPosition.copy(this.view.sun.position).project(this.camera);

            const x = (this.lightPosition.x + 1) / 2;
            const y = (this.lightPosition.y + 1) / 2;

            this.vlMaterial.uniforms.uLightPosition.value.set(x, y);
        }
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
    };

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);

        // SMAA
        this.renderTargetEdges.setSize(width, height);
        this.renderTargetWeights.setSize(width, height);

        // Gaussian blur
        const bloomWidth = Math.round(width * this.bloomResolutionScale);
        const bloomHeight = Math.round(height * this.bloomResolutionScale);

        this.renderTargetBloomA.setSize(bloomWidth, bloomHeight);
        this.renderTargetBloomB.setSize(bloomWidth, bloomHeight);

        this.hBloomMaterial.uniforms.uResolution.value.set(bloomWidth, bloomHeight);
        this.vBloomMaterial.uniforms.uResolution.value.set(bloomWidth, bloomHeight);

        const blurWidth = Math.round(width * this.blurResolutionScale);
        const blurHeight = Math.round(height * this.blurResolutionScale);

        this.renderTargetBlurA.setSize(blurWidth, blurHeight);
        this.renderTargetBlurB.setSize(blurWidth, blurHeight);

        this.hBlurMaterial.uniforms.uResolution.value.set(blurWidth, blurHeight);
        this.vBlurMaterial.uniforms.uResolution.value.set(blurWidth, blurHeight);

        // Unreal bloom
        width = Math.round(width / 2);
        height = Math.round(height / 2);

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uResolution.value.set(width, height);

            width = Math.round(width / 2);
            height = Math.round(height / 2);
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
        const renderTargetEdges = this.renderTargetEdges;
        const renderTargetWeights = this.renderTargetWeights;
        const renderTargetBloomA = this.renderTargetBloomA;
        const renderTargetBloomB = this.renderTargetBloomB;
        const renderTargetBlurA = this.renderTargetBlurA;
        const renderTargetBlurB = this.renderTargetBlurB;
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Renderer state
        this.rendererState();

        // Background layer
        camera.layers.set(layers.background);

        renderer.setRenderTarget(renderTargetA);
        renderer.clear();
        renderer.render(scene, camera);
        // this.restoreRendererState();
        // return;

        // Two pass Gaussian blur (horizontal and vertical)
        this.hBloomMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.hBloomMaterial;
        renderer.setRenderTarget(renderTargetBloomA);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        this.vBloomMaterial.uniforms.tMap.value = renderTargetBloomA.texture;
        this.screen.material = this.vBloomMaterial;
        renderer.setRenderTarget(renderTargetBloomB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Scene composite pass
        this.sceneCompositeMaterial.uniforms.tScene.value = renderTargetA.texture;
        this.sceneCompositeMaterial.uniforms.tBloom.value = renderTargetBloomB.texture;
        this.screen.material = this.sceneCompositeMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Scene layer
        camera.layers.set(layers.default);

        scene.background = null;
        renderer.setClearColor(this.clearColor, 1);

        renderer.setRenderTarget(renderTargetB);
        renderer.render(scene, camera);
        // this.restoreRendererState();
        // return;

        // Occlusion layer
        // TODO: Skip helpers
        // https://github.com/mrdoob/three.js/issues/26732
        scene.overrideMaterial = this.blackoutMaterial;
        renderer.setRenderTarget(renderTargetBlurA);
        renderer.clear();
        renderer.render(scene, camera);
        scene.overrideMaterial = this.currentOverrideMaterial;

        camera.layers.set(layers.occlusion);

        renderer.render(scene, camera);

        // Post-processing
        camera.layers.set(layers.default);

        // Two pass Gaussian blur (horizontal and vertical)
        this.hBlurMaterial.uniforms.tMap.value = renderTargetBlurA.texture;
        this.screen.material = this.hBlurMaterial;
        renderer.setRenderTarget(renderTargetBlurB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        this.vBlurMaterial.uniforms.tMap.value = renderTargetBlurB.texture;
        this.screen.material = this.vBlurMaterial;
        renderer.setRenderTarget(renderTargetBlurA);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        // Volumetric light pass
        this.vlMaterial.uniforms.tMap.value = renderTargetBlurA.texture;
        this.setLightPosition();
        this.screen.material = this.vlMaterial;
        renderer.setRenderTarget(renderTargetBlurB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);
        // this.restoreRendererState();
        // return;

        // Extract bright areas
        this.luminosityMaterial.uniforms.tMap.value = renderTargetB.texture;
        this.screen.material = this.luminosityMaterial;
        renderer.setRenderTarget(renderTargetBright);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

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
        renderer.setRenderTarget(renderTargetsHorizontal[0]);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

        if (this.smaa) {
            // Composite pass
            this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
            this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
            this.compositeMaterial.uniforms.tAdd.value = renderTargetBlurB.texture;
            this.screen.material = this.compositeMaterial;
            renderer.setRenderTarget(renderTargetA);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            // SMAA edge detection pass
            this.edgesMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.screen.material = this.edgesMaterial;
            renderer.setRenderTarget(renderTargetEdges);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            // SMAA weights pass
            this.weightsMaterial.uniforms.tMap.value = renderTargetEdges.texture;
            this.screen.material = this.weightsMaterial;
            renderer.setRenderTarget(renderTargetWeights);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);

            // SMAA pass (render to screen)
            this.smaaMaterial.uniforms.tMap.value = renderTargetA.texture;
            this.screen.material = this.smaaMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        } else {
            // Composite pass (render to screen)
            this.compositeMaterial.uniforms.tScene.value = renderTargetB.texture;
            this.compositeMaterial.uniforms.tBloom.value = renderTargetsHorizontal[0].texture;
            this.compositeMaterial.uniforms.tAdd.value = renderTargetBlurB.texture;
            this.screen.material = this.compositeMaterial;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(this.screen, this.screenCamera);
        }

        // Restore renderer settings
        this.restoreRendererState();
    };
}
