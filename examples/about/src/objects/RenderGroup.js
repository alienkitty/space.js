import { BackSide, Group, NoToneMapping, WebGLRenderTarget } from 'three';

import { DiscardMaterial } from '@alienkitty/alien.js/three';

import { WorldController } from '../controllers/world/WorldController.js';

export class RenderGroup extends Group {
    constructor() {
        super();

        this.initRenderer();
    }

    initRenderer() {
        const { renderer, scene, camera } = WorldController;

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.backside = true;
        this.thickness = 0.1;
        this.backsideThickness = 3;
        this.specularIntensity = 1;
        this.backsideSpecularIntensity = 0.05;

        // Render targets
        this.renderTargetBack = new WebGLRenderTarget(1, 1);
        this.renderTargetFront = this.renderTargetBack.clone();

        // Occlusion material
        this.discardMaterial = new DiscardMaterial();
    }

    /**
     * Public methods
     */

    resize(width, height) {
        this.renderTargetBack.setSize(width, height);
        this.renderTargetFront.setSize(width, height);
    }

    update() {
        if (typeof this.mesh.material.buffer === 'undefined') {
            return;
        }

        const currentRenderTarget = this.renderer.getRenderTarget();

        const currentToneMapping = this.renderer.toneMapping;
        this.renderer.toneMapping = NoToneMapping;

        const currentMaterial = this.mesh.material;
        const currentSide = this.mesh.material.side;

        // Occlusion pass
        this.mesh.material = this.discardMaterial;

        if (this.backside) {
            this.renderer.setRenderTarget(this.renderTargetBack);
            this.renderer.render(this.scene, this.camera);

            this.mesh.material = currentMaterial;
            this.mesh.material.buffer = this.renderTargetBack.texture;
            this.mesh.material.thickness = this.backsideThickness;
            this.mesh.material.specularIntensity = this.backsideSpecularIntensity;
            this.mesh.material.side = BackSide;
        }

        this.renderer.setRenderTarget(this.renderTargetFront);
        this.renderer.render(this.scene, this.camera);

        // Restore settings
        this.mesh.material = currentMaterial;
        this.mesh.material.buffer = this.renderTargetFront.texture;
        this.mesh.material.thickness = this.thickness;
        this.mesh.material.specularIntensity = this.specularIntensity;
        this.mesh.material.side = currentSide;

        this.renderer.toneMapping = currentToneMapping;
        this.renderer.setRenderTarget(currentRenderTarget);
    }
}
