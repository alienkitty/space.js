/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js by daoshengmu
 */

import { ShaderChunk } from 'three';

import { Panel } from '../../Panel.js';
import { PanelItem } from '../../PanelItem.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class PhysicalMaterialSubsurfacePanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        // Defaults
        if (!mesh.userData.subsurface) {
            mesh.userData.subsurface = false;

            mesh.userData.subsurfaceUniforms = {
                thicknessDistortion: { value: 0.1 },
                thicknessAmbient: { value: 0 },
                thicknessAttenuation: { value: 0.1 },
                thicknessPower: { value: 2 },
                thicknessScale: { value: 10 }
            };
        }

        const subsurfaceOptions = {
            Off: false,
            On: true
        };

        const subsurfaceItems = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Distort',
                min: 0,
                max: 1,
                step: 0.01,
                value: mesh.userData.subsurfaceUniforms.thicknessDistortion.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessDistortion.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Ambient',
                min: 0,
                max: 5,
                step: 0.05,
                value: mesh.userData.subsurfaceUniforms.thicknessAmbient.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessAmbient.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Atten',
                min: 0,
                max: 5,
                step: 0.05,
                value: mesh.userData.subsurfaceUniforms.thicknessAttenuation.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessAttenuation.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Power',
                min: 0,
                max: 32,
                step: 0.1,
                value: mesh.userData.subsurfaceUniforms.thicknessPower.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessPower.value = value;
                }
            },
            {
                type: 'slider',
                label: 'Scale',
                min: 0,
                max: 64,
                step: 0.1,
                value: mesh.userData.subsurfaceUniforms.thicknessScale.value,
                callback: value => {
                    mesh.userData.subsurfaceUniforms.thicknessScale.value = value;
                }
            }
            // TODO: Texture thumbnails
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                label: 'Subsurface Scattering',
                list: subsurfaceOptions,
                value: getKeyByValue(subsurfaceOptions, mesh.userData.subsurface),
                callback: (value, panel) => {
                    if (!panel.group) {
                        const subsurfacePanel = new Panel();
                        subsurfacePanel.animateIn(true);

                        subsurfaceItems.forEach(data => {
                            subsurfacePanel.add(new PanelItem(data));
                        });

                        panel.setContent(subsurfacePanel);
                    }

                    mesh.userData.subsurface = subsurfaceOptions[value];

                    if (mesh.userData.subsurface) {
                        mesh.material.onBeforeCompile = shader => {
                            shader.uniforms = Object.assign(shader.uniforms, mesh.userData.subsurfaceUniforms);

                            shader.fragmentShader = shader.fragmentShader.replace(
                                'void main() {',
                                /* glsl */ `
                                uniform float thicknessDistortion;
                                uniform float thicknessAmbient;
                                uniform float thicknessAttenuation;
                                uniform float thicknessPower;
                                uniform float thicknessScale;

                                void RE_Direct_Scattering(IncidentLight directLight, GeometricContext geometry, inout ReflectedLight reflectedLight) {
                                    vec3 thickness = directLight.color * 0.8;
                                    vec3 scatteringHalf = normalize(directLight.direction + (geometry.normal * thicknessDistortion));
                                    float scatteringDot = pow(saturate(dot(geometry.viewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
                                    vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * thickness;
                                    reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
                                }

                                void main() {
                                `
                            );

                            shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <lights_fragment_begin>',
                                ShaderChunk.lights_fragment_begin.replaceAll(
                                    'RE_Direct( directLight, geometry, material, reflectedLight );',
                                    /* glsl */ `
                                    RE_Direct( directLight, geometry, material, reflectedLight );
                                    RE_Direct_Scattering(directLight, geometry, reflectedLight);
                                    `
                                )
                            );
                        };

                        mesh.material.needsUpdate = true;

                        panel.group.show();
                    } else {
                        mesh.material.onBeforeCompile = () => {};
                        mesh.material.needsUpdate = true;

                        panel.group.hide();
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
