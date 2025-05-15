/**
 * @author pschroen / https://ufo.ai/
 */

import { BasicMaterialOptions } from '../panels/materials/BasicMaterialPanel.js';
import { LambertMaterialOptions } from '../panels/materials/LambertMaterialPanel.js';
import { MatcapMaterialOptions } from '../panels/materials/MatcapMaterialPanel.js';
import { PhongMaterialOptions } from '../panels/materials/PhongMaterialPanel.js';
import { ToonMaterialOptions } from '../panels/materials/ToonMaterialPanel.js';
import { StandardMaterialOptions } from '../panels/materials/StandardMaterialPanel.js';
import { PhysicalMaterialOptions } from '../panels/materials/PhysicalMaterialPanel.js';

export function getMaterialName(materials, name, index) {
    const names = materials.map(material => material.name);
    const match = name.match(/[-_\s]([^-_\s]*)\./);

    let materialName;

    if (match) {
        const suffix = match.pop();

        let count = 1;
        materialName = suffix;

        while (names.includes(materialName)) {
            materialName = `${suffix}${++count}`;
        }
    } else {
        materialName = index;
    }

    return materialName;
}

export function getTextureName(name) {
    if (/[-_\s]Light/i.test(name)) {
        return 'Light';
    } else if (/[-_\s]Occ/i.test(name)) {
        return 'AO';
    } else if (/[-_\s]Emission/i.test(name)) {
        return 'Emissive';
    } else if (/[-_\s]Bump/i.test(name)) {
        return 'Bump';
    } else if (/[-_\s]Normal/i.test(name)) {
        return 'Normal';
    } else if (/[-_\s]Height|Displace/i.test(name)) {
        return 'Displace';
    } else if (/[-_\s]Rough/i.test(name)) {
        return 'Rough';
    } else if (/[-_\s]Metal/i.test(name)) {
        return 'Metal';
    } else if (/[-_\s]Alpha/i.test(name)) {
        return 'Alpha';
    } else if (/[-_\s]Anis/i.test(name)) {
        return 'Anis';
    } else if (/[-_\s]\w+?Coat[-_\s]Rough/i.test(name)) {
        return 'Coat Rough';
    } else if (/[-_\s]\w+?Coat[-_\s]Normal/i.test(name)) {
        return 'Coat Normal';
    } else if (/[-_\s]\w+?Coat/i.test(name)) {
        return 'Coat';
    } else if (/[-_\s]Irid\w+?[-_\s]Thick/i.test(name)) {
        return 'Irid Thick';
    } else if (/[-_\s]Irid/i.test(name)) {
        return 'Irid';
    } else if (/[-_\s]Sheen[-_\s]Rough/i.test(name)) {
        return 'Sheen Rough';
    } else if (/[-_\s]Sheen/i.test(name)) {
        return 'Sheen Color';
    } else if (/[-_\s]Trans\w+?[-_\s]Thick/i.test(name)) {
        return 'Trans Thick';
    } else if (/[-_\s]Trans/i.test(name)) {
        return 'Trans Int';
    } else if (/[-_\s]Specular[-_\s]Int/i.test(name)) {
        return 'Specular Int';
    } else if (/[-_\s]Specular/i.test(name)) {
        return 'Specular Color';
    } else if (/[-_\s]Thick/i.test(name)) {
        return 'Subsurface';
    } else if (/[-_\s]Env/i.test(name)) {
        return 'Env';
    } else if (/[-_\s]Albedo|Base|Color|Diffuse/i.test(name)) {
        return 'Map';
    }
}

export function isCubeTextures(names) {
    return names.find(name => /^PosX|PX|[-_\s]PosX|PX|Cube/i.test(name));
}

export function sortCubeTextures(images, names) {
    names = names.map(name => {
        if (/^PosX|PX|[-_\s]PosX|PX/i.test(name)) {
            return 'px';
        } else if (/^NegX|NX|[-_\s]NegX|NX/i.test(name)) {
            return 'nx';
        } else if (/^PosY|PY|[-_\s]PosY|PY/i.test(name)) {
            return 'py';
        } else if (/^NegY|NY|[-_\s]NegY|NY/i.test(name)) {
            return 'ny';
        } else if (/^PosZ|PZ|[-_\s]PosZ|PZ/i.test(name)) {
            return 'pz';
        } else if (/^NegZ|NZ|[-_\s]NegZ|NZ/i.test(name)) {
            return 'nz';
        }
    });

    const map = new Map(images.map((image, i) => [names[i], image]));

    images = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(name => map.get(name));

    map.clear();

    return images;
}

export function setPanelTexture(panel, material, image, name = 'Map', index = []) {
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

    panel.setPanelValue('Map', image, [[type, Array.from(options.keys()).indexOf(name)], ...index]);
}
