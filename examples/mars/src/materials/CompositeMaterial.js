import { Color, GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { colors } from '../config/Config.js';

import blendScreen from '@alienkitty/alien.js/src/shaders/modules/blending/screen.glsl.js';
import blendSoftLight from '@alienkitty/alien.js/src/shaders/modules/blending/soft-light.glsl.js';
import rgbshift from '@alienkitty/alien.js/src/shaders/modules/rgbshift/rgbshift.glsl.js';
import encodings from '@alienkitty/alien.js/src/shaders/modules/encodings/encodings.glsl.js';
import dither from '@alienkitty/alien.js/src/shaders/modules/dither/dither.glsl.js';

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
uniform sampler2D tAdd;
uniform vec3 uColor;
uniform float uRGBAmount;
uniform float uReduction;
uniform float uBoost;
uniform bool uToneMapping;
uniform float uExposure;
uniform bool uGamma;

in vec2 vUv;

out vec4 FragColor;

${blendScreen}
${blendSoftLight}
${rgbshift}
${encodings}
${dither}

void main() {
    float center = length(vUv - 0.5);

    FragColor = getRGB(tScene, vUv, 0.1, 0.002 * uRGBAmount);

    FragColor.rgb += texture(tBloom, vUv).rgb;

    vec4 glow = texture(tAdd, vUv);

    // Blend soft light background color
    glow = blendSoftLight(glow, vec4(uColor, 1.0), 0.8);

    // Blend screen glow
    FragColor = blendScreen(FragColor, glow, 1.0);

    // Additive blend soft light background color
    FragColor.rgb += blendSoftLight(glow, vec4(uColor, 1.0), 0.8).rgb;

    // Vignetting
    FragColor.rgb *= uBoost - center * uReduction;

    // Tone mapping
    if (uToneMapping) {
        FragColor.rgb *= uExposure;

        FragColor = vec4(ACESFilmicToneMapping(FragColor.rgb), FragColor.a);
    }

    // Gamma correction
    if (uGamma) {
        FragColor = vec4(linearToSRGB(FragColor.rgb), FragColor.a);
    }

    // Dithering
    FragColor.rgb = dither(FragColor.rgb);
    FragColor.a = 1.0;
}
`;

export class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                tAdd: { value: null },
                uColor: { value: new Color(colors.backgroundColor) },
                uRGBAmount: { value: 0.2 },
                uReduction: { value: 0.9 },
                uBoost: { value: 1.1 },
                uToneMapping: { value: false },
                uExposure: { value: 1 },
                uGamma: { value: false }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
