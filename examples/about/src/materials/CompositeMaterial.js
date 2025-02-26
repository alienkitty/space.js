import { GLSL3, NoBlending, RawShaderMaterial, RepeatWrapping } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

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
uniform sampler2D tLensDirt;
uniform sampler2D tLensDirtTiles;
uniform float uRGBAmount;
uniform bool uLensDirt;
uniform bool uToneMapping;
uniform float uExposure;
uniform bool uGamma;
uniform vec2 uResolution;
uniform float uAspect;

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

    vec4 bloom = getRGB(tBloom, vUv, angle, amount);

    if (uLensDirt) {
        vec2 tilesUv = vUv;
        tilesUv.x *= uAspect;

        float distortion = 1.0 - texture(tLensDirtTiles, tilesUv).r;
        distortion = smoothstep(0.5, 0.7, distortion);

        vec2 sceneUv = vUv;
        sceneUv.xy += smoothstep(0.0, 0.4, bloom.rg) * distortion * dir * 0.005 * dist * uRGBAmount;

        vec2 dirtUv = vUv;

        float aspectRatio2 = 1.0;
        float aspectRatio = uResolution.x / uResolution.y;

        if (aspectRatio2 > aspectRatio) {
            float widthRatio = aspectRatio / aspectRatio2;
            dirtUv.x = vUv.x * widthRatio;
            dirtUv.x += 0.5 * (1.0 - widthRatio);
            dirtUv.y = vUv.y;
        } else {
            float heightRatio = aspectRatio2 / aspectRatio;
            dirtUv.x = vUv.x;
            dirtUv.y = vUv.y * heightRatio;
            dirtUv.y += 0.5 * (1.0 - heightRatio);
        }

        dirtUv.xy += distortion * dir * 0.05 * dist * uRGBAmount;

        FragColor = texture(tScene, sceneUv);
        FragColor.rgb += bloom.rgb;
        FragColor.rgb += smoothstep(0.0, 0.4, bloom.rgb) * texture(tLensDirt, dirtUv).rgb * dist * uRGBAmount;
    } else {
        FragColor = texture(tScene, vUv);
        FragColor.rgb += bloom.rgb;
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
`;

export class CompositeMaterial extends RawShaderMaterial {
    constructor() {
        const { getTexture, resolution, aspect } = WorldController;

        // Textures
        const [lensDirtMap, lensDirtTilesMap] = [
            getTexture('lens_dirt.jpg'),
            getTexture('pbr/white_hexagonal_tiles_height.jpg')
        ];

        lensDirtTilesMap.wrapS = RepeatWrapping;
        lensDirtTilesMap.wrapT = RepeatWrapping;

        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null },
                tLensDirt: { value: lensDirtMap },
                tLensDirtTiles: { value: lensDirtTilesMap },
                uRGBAmount: { value: 2.2 },
                uLensDirt: { value: true },
                uToneMapping: { value: false },
                uExposure: { value: 1 },
                uGamma: { value: false },
                uResolution: resolution,
                uAspect: aspect
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}
