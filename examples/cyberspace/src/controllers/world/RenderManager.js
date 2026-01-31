import { AdditiveBlending, MathUtils, Mesh, OrthographicCamera, Vector2, WebGLRenderTarget } from 'three';
import { BloomCompositeMaterial, CopyMaterial, LuminosityMaterial, UnrealBloomBlurMaterial } from '@alienkitty/alien.js/three';

import { WorldController } from './WorldController.js';
import { CompositeMaterial } from '../../materials/CompositeMaterial.js';

const BlurDirectionX = new Vector2(1, 0);
const BlurDirectionY = new Vector2(0, 1);

export class RenderManager {
    static init(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // Unreal bloom
        // this.luminosityThreshold = 0.1;
        this.luminosityThreshold = 0;
        this.luminositySmoothing = 1;
        this.bloomStrength = 0.3;
        this.bloomRadius = 0.2;

        this.enabled = true;

        this.initRenderer();
    }

    static initRenderer() {
        const { screenTriangle } = WorldController;

        // Manually clear
        this.renderer.autoClear = false;

        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });

        this.renderTargetB = this.renderTargetA.clone();

        this.renderTargetBright = this.renderTargetA.clone();

        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal.push(this.renderTargetA.clone());
            this.renderTargetsVertical.push(this.renderTargetA.clone());
        }

        this.renderTargetA.depthBuffer = true;

        // Luminosity high pass material
        this.luminosityMaterial = new LuminosityMaterial();
        this.luminosityMaterial.uniforms.uThreshold.value = this.luminosityThreshold;
        this.luminosityMaterial.uniforms.uSmoothing.value = this.luminositySmoothing;

        // Separable Gaussian blur materials
        this.blurMaterials = [];

        const kernelSizeArray = [6, 10, 14, 18, 22];

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.blurMaterials.push(this.getSeparableBlurMaterial(kernelSizeArray[i]));
        }

        // Unreal bloom composite material
        this.bloomCompositeMaterial = new BloomCompositeMaterial();
        this.bloomCompositeMaterial.uniforms.tBlur1.value = this.renderTargetsVertical[0].texture;
        this.bloomCompositeMaterial.uniforms.tBlur2.value = this.renderTargetsVertical[1].texture;
        this.bloomCompositeMaterial.uniforms.tBlur3.value = this.renderTargetsVertical[2].texture;
        this.bloomCompositeMaterial.uniforms.tBlur4.value = this.renderTargetsVertical[3].texture;
        this.bloomCompositeMaterial.uniforms.tBlur5.value = this.renderTargetsVertical[4].texture;
        this.bloomCompositeMaterial.uniforms.uBloomFactors.value = this.getBloomFactors();

        // Blend it additively
        this.bloomCompositeMaterial.blending = AdditiveBlending;

        // Copy material
        this.copyMaterial = new CopyMaterial();

        // Composite material
        this.compositeMaterial = new CompositeMaterial();
    }

    static getSeparableBlurMaterial(kernelRadius) {
        const coefficients = [];
        const sigma = kernelRadius / 3;

        for (let i = 0; i < kernelRadius; i++) {
            coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (sigma * sigma)) / sigma);
        }

        return new UnrealBloomBlurMaterial(kernelRadius, coefficients);
    }

    static getBloomFactors() {
        const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];

        for (let i = 0, l = this.nMips; i < l; i++) {
            const factor = bloomFactors[i];
            bloomFactors[i] = this.bloomStrength * MathUtils.lerp(factor, 1.2 - factor, this.bloomRadius);
        }

        return bloomFactors;
    }

    // Public methods

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);

        // Unreal bloom
        width = Math.round(width / 2);
        height = Math.round(height / 2);

        this.renderTargetBright.setSize(width, height);

        for (let i = 0, l = this.nMips; i < l; i++) {
            this.renderTargetsHorizontal[i].setSize(width, height);
            this.renderTargetsVertical[i].setSize(width, height);

            this.blurMaterials[i].uniforms.uTexelSize.value.set(1 / width, 1 / height);

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
        const renderTargetBright = this.renderTargetBright;
        const renderTargetsHorizontal = this.renderTargetsHorizontal;
        const renderTargetsVertical = this.renderTargetsVertical;

        // Scene pass
        renderer.setRenderTarget(renderTargetA);
        renderer.clear();
        renderer.render(scene, camera);

        // Copy pass
        this.copyMaterial.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.copyMaterial;
        renderer.setRenderTarget(renderTargetB);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);

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
        renderer.setRenderTarget(renderTargetB);
        renderer.render(this.screen, this.screenCamera);

        // Composite pass (render to screen)
        this.compositeMaterial.uniforms.tMap.value = renderTargetB.texture;
        this.screen.material = this.compositeMaterial;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(this.screen, this.screenCamera);
    };
}
