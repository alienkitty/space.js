import { ShaderChunk } from 'three';
import { MaterialPatches } from '@alienkitty/space.js/three';

import hsv2rgbSmooth from '@alienkitty/alien.js/src/shaders/modules/hsv/hsv2rgbSmooth.glsl.js';
import rgb2hsv from '@alienkitty/alien.js/src/shaders/modules/hsv/rgb2hsv.glsl.js';
import brightnessContrast from '@alienkitty/alien.js/src/shaders/modules/brightness-contrast/brightness-contrast.glsl.js';

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Basic.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = reflectedLight.indirectDiffuse;',
        /* glsl */ `
        vec3 outgoingLight = reflectedLight.indirectDiffuse;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Lambert.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
        /* glsl */ `
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
MaterialPatches.Lambert.subsurface = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

    shader.vertexShader = /* glsl */ `
        #define USE_UV
        ${shader.vertexShader}
    `;

    shader.fragmentShader = /* glsl */ `
        #define USE_UV
        ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform sampler2D thicknessMap;
        uniform bool thicknessUseMap;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        uniform float thicknessPower;
        uniform float thicknessScale;

        void RE_Direct_Scattering(IncidentLight directLight, vec2 uv, vec3 geometryPosition, vec3 geometryNormal, vec3 geometryViewDir, vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
            vec3 thickness;

            if (thicknessUseMap) {
                thickness = directLight.color * texture2D(thicknessMap, uv).r;
            } else {
                thickness = directLight.color * 0.8;
            }

            vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
            float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
            reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_begin>',
        ShaderChunk.lights_fragment_begin.replaceAll(
            'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
            /* glsl */ `
            RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
            `
        )
    );
};

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Matcap.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;',
        /* glsl */ `
        vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Phong.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;',
        /* glsl */ `
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
MaterialPatches.Phong.subsurface = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

    shader.vertexShader = /* glsl */ `
        #define USE_UV
        ${shader.vertexShader}
    `;

    shader.fragmentShader = /* glsl */ `
        #define USE_UV
        ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform sampler2D thicknessMap;
        uniform bool thicknessUseMap;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        uniform float thicknessPower;
        uniform float thicknessScale;

        void RE_Direct_Scattering(IncidentLight directLight, vec2 uv, vec3 geometryPosition, vec3 geometryNormal, vec3 geometryViewDir, vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
            vec3 thickness;

            if (thicknessUseMap) {
                thickness = directLight.color * texture2D(thicknessMap, uv).r;
            } else {
                thickness = directLight.color * 0.8;
            }

            vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
            float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
            reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_begin>',
        ShaderChunk.lights_fragment_begin.replaceAll(
            'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
            /* glsl */ `
            RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
            `
        )
    );
};

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Toon.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
        /* glsl */ `
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
MaterialPatches.Toon.subsurface = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

    shader.vertexShader = /* glsl */ `
        #define USE_UV
        ${shader.vertexShader}
    `;

    shader.fragmentShader = /* glsl */ `
        #define USE_UV
        ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform sampler2D thicknessMap;
        uniform bool thicknessUseMap;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        uniform float thicknessPower;
        uniform float thicknessScale;

        void RE_Direct_Scattering(IncidentLight directLight, vec2 uv, vec3 geometryPosition, vec3 geometryNormal, vec3 geometryViewDir, vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
            vec3 thickness;

            if (thicknessUseMap) {
                thickness = directLight.color * texture2D(thicknessMap, uv).r;
            } else {
                thickness = directLight.color * 0.8;
            }

            vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
            float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
            reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_begin>',
        ShaderChunk.lights_fragment_begin.replaceAll(
            'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
            /* glsl */ `
            RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
            `
        )
    );
};

// Based on https://github.com/yuichiroharai/glsl-y-hsv
// Based on https://github.com/spite/Wagner
MaterialPatches.Standard.adjustments = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.adjustmentsUniforms);

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform float hue;
        uniform float saturation;
        uniform float lightness;
        uniform float brightness;
        uniform float contrast;

        ${hsv2rgbSmooth}
        ${rgb2hsv}
        ${brightnessContrast}

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;',
        /* glsl */ `
        vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

        vec3 hsv = rgb2hsv(outgoingLight);
        hsv.x += hue;
        hsv.y += saturation;
        hsv.z += lightness;

        outgoingLight = hsv2rgbSmooth(hsv);

        outgoingLight = getBrightnessContrast(outgoingLight, brightness, 1.0 + contrast);
        `
    );
};

// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
// Based on https://gist.github.com/mattdesl/2ee82157a86962347dedb6572142df7c
MaterialPatches.Standard.subsurface = function (shader, mesh) {
    shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

    shader.vertexShader = /* glsl */ `
        #define USE_UV
        ${shader.vertexShader}
    `;

    shader.fragmentShader = /* glsl */ `
        #define USE_UV
        ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        /* glsl */ `
        uniform sampler2D thicknessMap;
        uniform bool thicknessUseMap;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        uniform float thicknessPower;
        uniform float thicknessScale;

        void RE_Direct_Scattering(IncidentLight directLight, vec2 uv, vec3 geometryPosition, vec3 geometryNormal, vec3 geometryViewDir, vec3 geometryClearcoatNormal, PhysicalMaterial material, inout ReflectedLight reflectedLight) {
            vec3 thickness;

            if (thicknessUseMap) {
                thickness = directLight.color * texture2D(thicknessMap, uv).r;
            } else {
                thickness = directLight.color * 0.8;
            }

            vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
            float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
            reflectedLight.directDiffuse += material.diffuseColor * directLight.color * scatteringIllu * thicknessAttenuation;
        }

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <lights_fragment_begin>',
        ShaderChunk.lights_fragment_begin.replaceAll(
            'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
            /* glsl */ `
            RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight);
            `
        )
    );
};

MaterialPatches.Physical.adjustments = MaterialPatches.Standard.adjustments;
MaterialPatches.Physical.subsurface = MaterialPatches.Standard.subsurface;
