import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

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
uniform float uRGBAmount;
uniform bool uToneMapping;
uniform float uExposure;
uniform bool uGamma;

in vec2 vUv;

out vec4 FragColor;

${rgbshift}
${encodings}
${dither}

void main() {
    vec2 dir = 0.5 - vUv;
    float dist = length(dir);
    dist = clamp(smoothstep(0.2, 0.7, dist), 0.0, 1.0);
    float angle = atan(dir.y, dir.x);
    float amount = 0.002 * dist * uRGBAmount;

    FragColor = texture(tScene, vUv);
    FragColor.rgb += getRGB(tBloom, vUv, angle, amount).rgb;

    if (uToneMapping) {
        FragColor.rgb *= uExposure;

        FragColor = vec4(ACESFilmicToneMapping(FragColor.rgb), FragColor.a);
    }

    if (uGamma) {
        FragColor = vec4(linearToSRGB(FragColor.rgb), FragColor.a);
    }

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
                uRGBAmount: { value: 2.2 },
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
