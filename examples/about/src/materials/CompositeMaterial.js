import { GLSL3, NoBlending, RawShaderMaterial, RepeatWrapping } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

import blur from '@alienkitty/alien.js/src/shaders/modules/blur/radial-blur8-rgbshift.glsl.js';
import encodings from '@alienkitty/alien.js/src/shaders/modules/encodings/encodings.glsl.js';
import dither from '@alienkitty/alien.js/src/shaders/modules/dither/dither.glsl.js';

export class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        const { getTexture, resolution, aspect } = WorldController;

        const map = getTexture('../assets/textures/pbr/white_hexagonal_tiles_height.jpg');
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        // map.repeat.set(6, 6);

        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                tLensDirt: { value: getTexture('../assets/textures/lens_dirt.jpg') },
                tLensDirtDudv: { value: map },
                uBlurDist: { value: 1 },
                uBlurStrength: { value: 2.2 },
                uRGBStrength: { value: 2.2 },
                uLensDirt: { value: true },
                uToneMapping: { value: false },
                uExposure: { value: 1 },
                uGamma: { value: false },
                uResolution: resolution,
                uAspect: aspect
            },
            vertexShader: /* glsl */ `
                in vec3 position;
                in vec2 uv;

                out vec2 vUv;
                out vec2 vScreenUv;

                void main() {
                    vUv = uv;

                    gl_Position = vec4(position, 1.0);

                    vScreenUv = gl_Position.xy / gl_Position.w;
                    vScreenUv = vScreenUv * 0.5 + 0.5;
                }
            `,
            fragmentShader: /* glsl */ `
                precision highp float;

                uniform sampler2D tScene;
                uniform sampler2D tBloom;
                uniform sampler2D tLensDirt;
                uniform sampler2D tLensDirtDudv;
                uniform float uBlurDist;
                uniform float uBlurStrength;
                uniform float uRGBStrength;
                uniform bool uLensDirt;
                uniform bool uToneMapping;
                uniform float uExposure;
                uniform bool uGamma;
                uniform vec2 uResolution;
                uniform float uAspect;

                in vec2 vUv;
                in vec2 vScreenUv;

                out vec4 FragColor;

                ${blur}
                ${encodings}
                ${dither}

                void main() {
                    vec2 dir = 0.5 - vUv;
                    float dist = length(dir);
                    dist = clamp(smoothstep(0.2, 0.7, dist), 0.0, 1.0);
                    float angle = atan(dir.y, dir.x);
                    float amount = 0.002 * dist * uRGBStrength;

                    vec4 bloom = getRGB(tBloom, vUv, angle, amount);

                    vec2 vUv1 = vUv;
                    vec2 vUv2 = vUv;

                    float aspectRatio2 = 1.0;
                    float aspectRatio = uResolution.x / uResolution.y;

                    if (aspectRatio2 > aspectRatio) {
                        float widthRatio = aspectRatio / aspectRatio2;
                        vUv2.x = vUv.x * widthRatio;
                        vUv2.x += 0.5 * (1.0 - widthRatio);
                        vUv2.y = vUv.y;
                    } else {
                        float heightRatio = aspectRatio2 / aspectRatio;
                        vUv2.x = vUv.x;
                        vUv2.y = vUv.y * heightRatio;
                        vUv2.y += 0.5 * (1.0 - heightRatio);
                    }

                    vec2 cursor = vUv;
                    cursor.x *= uAspect;

                    float distortion = 1.0 - texture(tLensDirtDudv, cursor).r;
                    // vec2 distortion = texture(tLensDirtDudv, cursor).rg;
                    distortion = smoothstep(0.5, 0.7, distortion);
                    vUv1.xy += smoothstep(0.0, 0.4, bloom.rg) * distortion * dir * 0.005 * dist * uRGBStrength;
                    vUv2.xy += distortion * dir * 0.05 * dist * uRGBStrength;

                    FragColor = texture(tScene, vUv1);
                    // FragColor = radialBlurRGB(tScene, vUv1, 0.1 * dist * uBlurDist, smoothstep(0.0, 0.4, bloom.r) * uBlurStrength, angle, smoothstep(0.0, 0.4, bloom.r) * amount);

                    FragColor.rgb += bloom.rgb;

                    if (uLensDirt) {
                        FragColor.rgb += smoothstep(0.0, 0.4, bloom.rgb) * texture(tLensDirt, vUv2).rgb * dist * uRGBStrength;
                    }

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
            `,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
