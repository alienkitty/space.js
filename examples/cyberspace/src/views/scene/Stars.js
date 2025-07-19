import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, GLSL3, Group, Points, RawShaderMaterial } from 'three';

import { Data } from '../../data/Data.js';
import { WorldController } from '../../controllers/world/WorldController.js';

const vertexShader = /* glsl */ `
in vec3 position;
in vec4 color;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform float uScale;
uniform float uCameraNear;
uniform float uCameraFar;
uniform float uTime;

out vec4 vColor;
out float vFade;

void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 11.0 * uScale;

    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    float linearDepth = 1.0 / (uCameraFar - uCameraNear);
    float linearPos = length(cameraPosition - worldPosition) * linearDepth;

    vFade = clamp(1.0 - linearPos, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uAlpha;
uniform float uCameraNear;
uniform float uCameraFar;
uniform vec2 uResolution;

in vec4 vColor;
in float vFade;

out vec4 FragColor;

void main(void) {
    float d = 1.0 - 2.0 * length(gl_PointCoord - 0.5);
    float a = pow(d, 5.0);
    FragColor.rgb = vColor.rgb;
    FragColor.a = vColor.a * 6.0 * a;
    FragColor.a *= vFade;
    FragColor.a *= uAlpha;
}
`;

export class Stars extends Group {
    constructor() {
        super();

        this.initPoints();
    }

    initPoints() {
        const { camera, resolution, time } = WorldController;

        const vertices = [];
        const colors = [];
        const indices = [];

        for (let i = 0, l = Data.stars.length; i < l; i++) {
            const star = Data.stars[i];
            vertices[3 * i + 0] = star.position.x;
            vertices[3 * i + 1] = star.position.y;
            vertices[3 * i + 2] = star.position.z;
            colors[4 * i + 0] = star.color.r;
            colors[4 * i + 1] = star.color.g;
            colors[4 * i + 2] = star.color.b;
            colors[4 * i + 3] = star.alpha;
            indices[i] = i;
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 4));
        geometry.setIndex(indices);

        const material = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                uScale: { value: window.devicePixelRatio / 2 },
                uAlpha: { value: 1 },
                uCameraNear: { value: camera.near },
                // uCameraFar: { value: camera.far },
                uCameraFar: { value: 1150 },
                // uCameraFar: { value: 2900 },
                uResolution: resolution,
                uTime: time
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false
        });

        const points = new Points(geometry, material);
        points.matrixAutoUpdate = false;
        points.frustumCulled = false;
        points.renderOrder = -1; // Render first (default is 0)
        this.add(points);

        this.points = points;
        this.material = material;
    }
}
