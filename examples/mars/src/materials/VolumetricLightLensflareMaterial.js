import { Color, GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import { colors } from '../config/Config.js';

import lensflare from '@alienkitty/alien.js/src/shaders/modules/lensflare/lensflare.glsl.js';
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
uniform bool uTransition;
uniform vec2 uLightPosition;
uniform vec3 uLightColor;
uniform float uPower;
uniform float uAmount;
uniform vec2 uScale;
uniform float uSwizzle;
uniform float uExposure;
uniform float uDecay;
uniform float uDensity;
uniform float uWeight;
uniform float uClamp;
uniform vec2 uLensflareScale;
uniform float uLensflareExposure;
uniform float uLensflareClamp;
uniform vec2 uResolution;

in vec2 vUv;
in vec3 vWorldPosition;
in vec3 vViewDirection;

out vec4 FragColor;

// const int samples = 20;
const int samples = 7;

${lensflare}
${dither}

void main() {
    vec2 texcoord = vUv;
    vec2 deltaTexCoord = texcoord - uLightPosition;
    deltaTexCoord *= 1.0 / float(samples) * uDensity;
    vec4 color = vec4(0);
    float illuminationDecay = 1.0;

    for (int i = 0; i < samples; i++) {
        texcoord -= ((deltaTexCoord.xy * (1.0 - uSwizzle)) + (deltaTexCoord.xx * uSwizzle)) * uScale;
        vec4 texel = texture(tMap, texcoord);
        texel *= illuminationDecay * uWeight;
        color += texel;
        illuminationDecay *= uDecay;
    }

    color *= uExposure;
    color = clamp(color, 0.0, uClamp);

    // Occlusion light color
    vec3 light;

    if (
        uLightPosition.x > 1.0 || uLightPosition.x < 0.0 ||
        uLightPosition.y > 1.0 || uLightPosition.y < 0.0 ||
        uTransition
    ) {
        light = uLightColor;
    } else {
        light = texture(tMap, uLightPosition).rgb;
    }

    // Radial glow
    vec2 uv = vUv - uLightPosition;
    uv.x *= uResolution.x / uResolution.y;

    float amount = length(uv);
    amount = pow(amount, uPower);
    amount *= 1.0 - uAmount;

    vec3 glow = clamp(light * (1.0 - amount), 0.0, 1.0);

    // Lens flare
    uv = vUv - 0.5;
    vec2 pos = uLightPosition - 0.5;

    uv.x *= uResolution.x / uResolution.y;
    pos.x *= uResolution.x / uResolution.y;

    uv *= uLensflareScale;
    pos *= uLensflareScale;

    vec3 flare = lensflare(uv, pos) * light * 2.0;
    flare = pow(flare, vec3(0.5));
    flare *= uLensflareExposure;
    flare = clamp(flare, 0.0, uLensflareClamp);

    FragColor = vec4(color.rgb + glow + flare, 1.0);

    // Dithering
    FragColor.rgb = dither(FragColor.rgb);
    FragColor.a = 1.0;
}
`;

export class VolumetricLightLensflareMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uTransition: { value: false },
                uLightPosition: { value: new Vector2(0.5, 0.5) },
                uLightColor: { value: new Color(colors.lightColor) },
                uPower: { value: 1.5 },
                uAmount: { value: 0.3 },
                uScale: { value: new Vector2(1, 1) },
                uSwizzle: { value: 0 },
                uExposure: { value: 0.6 },
                uDecay: { value: 0.93 },
                uDensity: { value: 0.96 },
                uWeight: { value: 0.4 },
                uClamp: { value: 1 },
                uLensflareScale: { value: new Vector2(1.5, 1.5) },
                uLensflareExposure: { value: 1 },
                uLensflareClamp: { value: 1 },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
