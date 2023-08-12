/**
 * @author pschroen / https://ufo.ai/
 */

import { ShaderChunk } from 'three';

export const PhongMaterialPatches = {
    // Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
    subsurface(shader, mesh) {
        shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            /* glsl */ `
            uniform float thicknessDistortion;
            uniform float thicknessAmbient;
            uniform float thicknessAttenuation;
            uniform float thicknessPower;
            uniform float thicknessScale;

            void RE_Direct_Scattering(IncidentLight directLight, GeometricContext geometry, inout ReflectedLight reflectedLight) {
                vec3 thickness = directLight.color * 0.8;
                vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
                float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
                vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
                reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
            }

            void main() {
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <lights_fragment_begin>',
            ShaderChunk.lights_fragment_begin.replaceAll(
                'RE_Direct( directLight, geometry, material, reflectedLight );',
                /* glsl */ `
                RE_Direct( directLight, geometry, material, reflectedLight );
                RE_Direct_Scattering(directLight, geometry, reflectedLight);
                `
            )
        );
    }
};

export const StandardMaterialPatches = {
    // Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
    // Based on https://gist.github.com/mattdesl/2ee82157a86962347dedb6572142df7c
    subsurface(shader, mesh) {
        shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            /* glsl */ `
            uniform float thicknessDistortion;
            uniform float thicknessAmbient;
            uniform float thicknessAttenuation;
            uniform float thicknessPower;
            uniform float thicknessScale;

            void RE_Direct_Scattering(IncidentLight directLight, GeometricContext geometry, PhysicalMaterial material, inout ReflectedLight reflectedLight) {
                vec3 thickness = directLight.color * 0.8;
                vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
                float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
                vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
                reflectedLight.directDiffuse += material.diffuseColor * directLight.color * scatteringIllu * thicknessAttenuation;
            }

            void main() {
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <lights_fragment_begin>',
            ShaderChunk.lights_fragment_begin.replaceAll(
                'RE_Direct( directLight, geometry, material, reflectedLight );',
                /* glsl */ `
                RE_Direct( directLight, geometry, material, reflectedLight );
                RE_Direct_Scattering(directLight, geometry, material, reflectedLight);
                `
            )
        );
    }
};
