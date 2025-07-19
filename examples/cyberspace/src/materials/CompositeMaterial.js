import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import blur from '@alienkitty/alien.js/src/shaders/modules/blur/radial-blur8-rgbshift.glsl.js';
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

uniform sampler2D tMap;
uniform float uBlurDist;
uniform float uBlurAmount;
uniform float uRGBAmount;

in vec2 vUv;

out vec4 FragColor;

${blur}
${dither}

void main() {
    vec2 dir = 0.5 - vUv;
    float dist = length(dir);
    dist = clamp(smoothstep(0.4, 1.0, dist), 0.0, 1.0);
    float angle = atan(dir.y, dir.x);
    float amount = 0.002 * dist * uRGBAmount;

    FragColor = radialBlurRGB(tMap, vUv, 0.1 * dist * uBlurDist, uBlurAmount, angle, amount);

    FragColor.rgb = dither(FragColor.rgb);
    FragColor.a = 1.0;
}
`;

export class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uBlurDist: { value: 1 },
                uBlurAmount: { value: 2.2 },
                uRGBAmount: { value: 1.1 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
