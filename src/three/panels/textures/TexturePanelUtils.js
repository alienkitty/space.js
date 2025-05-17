/**
 * @author pschroen / https://ufo.ai/
 */

import { BasicMaterialOptions } from '../materials/BasicMaterialPanel.js';
import { LambertMaterialOptions } from '../materials/LambertMaterialPanel.js';
import { MatcapMaterialOptions } from '../materials/MatcapMaterialPanel.js';
import { PhongMaterialOptions } from '../materials/PhongMaterialPanel.js';
import { ToonMaterialOptions } from '../materials/ToonMaterialPanel.js';
import { StandardMaterialOptions } from '../materials/StandardMaterialPanel.js';
import { PhysicalMaterialOptions } from '../materials/PhysicalMaterialPanel.js';

export function setPanelTexture(panel, material, texture, name = 'Map', index = []) {
    if (index.length) {
        index = [index];
    }

    let type, options;

    if (material.isMeshBasicMaterial) {
        type = 'Basic';
        options = BasicMaterialOptions;
    } else if (material.isMeshLambertMaterial) {
        type = 'Lambert';
        options = LambertMaterialOptions;
    } else if (material.isMeshMatcapMaterial) {
        type = 'Matcap';
        options = MatcapMaterialOptions;
    } else if (material.isMeshPhongMaterial) {
        type = 'Phong';
        options = PhongMaterialOptions;
    } else if (material.isMeshToonMaterial) {
        type = 'Toon';
        options = ToonMaterialOptions;
    } else if (material.isMeshPhysicalMaterial) {
        type = 'Physical';
        options = PhysicalMaterialOptions;
    } else if (material.isMeshStandardMaterial) {
        type = 'Standard';
        options = StandardMaterialOptions;
    }

    panel.setPanelValue('Map', texture, [[type, Array.from(options.keys()).indexOf(name)], ...index]);
}
