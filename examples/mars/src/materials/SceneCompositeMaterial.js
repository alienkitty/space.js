import { Color, GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { colors } from '../config/Config.js';

import blendSoftLight from '@alienkitty/alien.js/src/shaders/modules/blending/soft-light.glsl.js';

const vertexShader = /* glsl */ `
in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tBloom;
uniform vec3 uColor;
uniform float uBloomReduction;
uniform float uBloomBoost;
uniform float uBloomClamp;

in vec2 vUv;

out vec4 FragColor;

${blendSoftLight}

void main() {
    FragColor = texture(tScene, vUv);

    vec4 bloom = texture(tBloom, vUv);
    bloom.r = max(0.0, bloom.r - uBloomReduction);
    bloom.g = max(0.0, bloom.g - uBloomReduction);
    bloom.b = max(0.0, bloom.b - uBloomReduction);
    bloom.rgb *= uBloomBoost;
    bloom = clamp(bloom, 0.0, uBloomClamp);

    FragColor.rgb += bloom.rgb;

    // Blend soft light background color
    FragColor = blendSoftLight(FragColor, vec4(uColor, 1.0), 0.8);
}
`;

export class SceneCompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                uColor: { value: new Color(colors.backgroundColor) },
                uBloomReduction: { value: 0.07 },
                uBloomBoost: { value: 0.4 },
                uBloomClamp: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
