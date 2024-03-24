import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import rgbshift from '@alienkitty/alien.js/src/shaders/modules/rgbshift/rgbshift.glsl.js';
import encodings from '@alienkitty/alien.js/src/shaders/modules/encodings/encodings.glsl.js';

// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/ACESFilmicToneMappingShader.js by WestLangley
// Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/GammaCorrectionShader.js by WestLangley

export class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                uBloomDistortion: { value: 1.5 },
                uToneMapping: { value: false },
                uExposure: { value: 1 },
                uGamma: { value: false }
            },
            vertexShader: /* glsl */ `
                in vec3 position;
                in vec2 uv;

                out vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */ `
                precision highp float;

                uniform sampler2D tScene;
                uniform sampler2D tBloom;
                uniform float uBloomDistortion;
                uniform bool uToneMapping;
                uniform float uExposure;
                uniform bool uGamma;

                in vec2 vUv;

                out vec4 FragColor;

                ${rgbshift}
                ${encodings}

                void main() {
                    FragColor = texture(tScene, vUv);

                    vec2 dir = 0.5 - vUv;
                    float angle = atan(dir.y, dir.x);
                    float amount = 0.001 * uBloomDistortion;

                    FragColor.rgb += getRGB(tBloom, vUv, angle, amount).rgb;

                    if (uToneMapping) {
                        FragColor.rgb *= uExposure;

                        FragColor = vec4(ACESFilmicToneMapping(FragColor.rgb), FragColor.a);
                    }

                    if (uGamma) {
                        FragColor = LinearToSRGB(FragColor);
                    }
                }
            `,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
