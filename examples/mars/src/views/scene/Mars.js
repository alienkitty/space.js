import { Group, MathUtils, Mesh, MeshPhongMaterial, NoColorSpace, SRGBColorSpace, Vector2 } from 'three';
import { getSphericalCube } from '@alienkitty/space.js/three';

import { WorldController } from '../../controllers/world/WorldController.js';

import { params } from '../../config/Config.js';

import hsv2rgbSmooth from '@alienkitty/alien.js/src/shaders/modules/hsv/hsv2rgbSmooth.glsl.js';
import rgb2hsv from '@alienkitty/alien.js/src/shaders/modules/hsv/rgb2hsv.glsl.js';
import brightnessContrast from '@alienkitty/alien.js/src/shaders/modules/brightness-contrast/brightness-contrast.glsl.js';

export class Mars extends Group {
    constructor() {
        super();

        // 25 degree tilt
        this.rotation.z = MathUtils.degToRad(-25);

        // HSL offset
        this.hue = { value: -2 / 360 };
        this.saturation = { value: -6 / 100 };
        this.lightness = { value: -3 / 100 };
        this.brightness = { value: 5 / 100 };
        this.contrast = { value: 10 / 100 };
    }

    async initMesh() {
        const { loadTexture/* , loadCompressedTexture */ } = WorldController;

        const geometry = getSphericalCube(0.6, 40);

        const material = this.createCubeFaceMaterial({
            mapFaces: await Promise.all([
                loadTexture('cube/mars/mars_basecolor_px.jpg'),
                loadTexture('cube/mars/mars_basecolor_nx.jpg'),
                loadTexture('cube/mars/mars_basecolor_py.jpg'),
                loadTexture('cube/mars/mars_basecolor_ny.jpg'),
                loadTexture('cube/mars/mars_basecolor_pz.jpg'),
                loadTexture('cube/mars/mars_basecolor_nz.jpg')
            ]),
            normalFaces: await Promise.all([
                loadTexture('cube/mars/mars_normal_px.jpg'),
                loadTexture('cube/mars/mars_normal_nx.jpg'),
                loadTexture('cube/mars/mars_normal_py.jpg'),
                loadTexture('cube/mars/mars_normal_ny.jpg'),
                loadTexture('cube/mars/mars_normal_pz.jpg'),
                loadTexture('cube/mars/mars_normal_nz.jpg')
            ])/* ,
            displaceFaces: await Promise.all([
                loadTexture('cube/mars/mars_height_px.jpg'),
                loadTexture('cube/mars/mars_height_nx.jpg'),
                loadTexture('cube/mars/mars_height_py.jpg'),
                loadTexture('cube/mars/mars_height_ny.jpg'),
                loadTexture('cube/mars/mars_height_pz.jpg'),
                loadTexture('cube/mars/mars_height_nz.jpg')
            ]) */
        });
        /* const material = this.createCubeFaceMaterial({
            mapFaces: await Promise.all([
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_px.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_nx.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_py.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_ny.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_pz.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_basecolor_nz.ktx2')
            ]),
            normalFaces: await Promise.all([
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_px.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_nx.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_py.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_ny.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_pz.ktx2'),
                loadCompressedTexture('../assets/textures/cube/mars/mars_normal_nz.ktx2')
            ])
        }); */

        const mesh = new Mesh(geometry, material);
        mesh.rotation.y = MathUtils.degToRad(15); // Start rotation
        this.add(mesh);

        this.mesh = mesh;
    }

    createCubeFaceMaterial({ mapFaces, normalFaces/* , displaceFaces */ }) {
        const { anisotropy } = WorldController;

        return mapFaces.map((texture, index) => {
            const map = mapFaces[index];
            const normalMap = normalFaces[index];
            // const displacementMap = displaceFaces[index];

            map.colorSpace = SRGBColorSpace;

            // Important: Make sure your normal map and
            // displacement map do not have a color profile!
            normalMap.colorSpace = NoColorSpace;
            // displacementMap.colorSpace = NoColorSpace;

            // map.flipY = false;
            // normalMap.flipY = false;

            map.anisotropy = anisotropy;
            normalMap.anisotropy = anisotropy;
            // displacementMap.anisotropy = anisotropy;

            const material = new MeshPhongMaterial({
                // color: new Color().offsetHSL(0, 0, -0.65),
                map,
                // bumpMap,
                // bumpScale: 40,
                normalMap,
                normalScale: new Vector2(2, -2),
                // displacementMap,
                // displacementScale: 0.01,
                shininess: 0,
                reflectivity: 0.1,
                fog: false
            });

            material.onBeforeCompile = shader => {
                shader.uniforms.hue = this.hue;
                shader.uniforms.saturation = this.saturation;
                shader.uniforms.lightness = this.lightness;
                shader.uniforms.brightness = this.brightness;
                shader.uniforms.contrast = this.contrast;

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

            return material;
        });
    }

    // Public methods

    update = () => {
        if (params.animate) {
            // Counter clockwise rotation
            this.mesh.rotation.y += 0.0005 * params.speed;
        }
    };

    ready = () => this.initMesh();
}
