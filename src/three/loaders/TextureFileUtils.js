/**
 * @author pschroen / https://ufo.ai/
 */

export function getMaterialName(materials, filename, index) {
    const names = materials.map(material => material.name);
    const match = filename.match(/[-_\s]([^-_\s]*)\./);

    let name;
    let materialName;

    if (match) {
        name = match.pop();
    } else if (filename.length < 16) {
        const match = filename.match(/(.*)\./);

        if (match) {
            name = match.pop().replace(/[-_\s]+/g, '');
        }
    }

    if (name) {
        let count = 1;
        materialName = name;

        while (names.includes(materialName)) {
            materialName = `${name}${++count}`;
        }
    } else {
        materialName = index;
    }

    return materialName;
}

export function getTextureName(filename) {
    if (/[-_\s]Light/i.test(filename)) {
        return 'Light';
    } else if (/[-_\s]Occ/i.test(filename)) {
        return 'AO';
    } else if (/[-_\s]Emission/i.test(filename)) {
        return 'Emissive';
    } else if (/[-_\s]Bump/i.test(filename)) {
        return 'Bump';
    } else if (/[-_\s]Normal/i.test(filename)) {
        return 'Normal';
    } else if (/[-_\s]Height|Displace/i.test(filename)) {
        return 'Displace';
    } else if (/[-_\s]Rough/i.test(filename)) {
        return 'Rough';
    } else if (/[-_\s]Metal/i.test(filename)) {
        return 'Metal';
    } else if (/[-_\s]Alpha/i.test(filename)) {
        return 'Alpha';
    } else if (/[-_\s]Anis/i.test(filename)) {
        return 'Anis';
    } else if (/[-_\s]\w+?Coat[-_\s]Rough/i.test(filename)) {
        return 'Coat Rough';
    } else if (/[-_\s]\w+?Coat[-_\s]Normal/i.test(filename)) {
        return 'Coat Normal';
    } else if (/[-_\s]\w+?Coat/i.test(filename)) {
        return 'Coat';
    } else if (/[-_\s]Irid\w+?[-_\s]Thick/i.test(filename)) {
        return 'Irid Thick';
    } else if (/[-_\s]Irid/i.test(filename)) {
        return 'Irid';
    } else if (/[-_\s]Sheen[-_\s]Rough/i.test(filename)) {
        return 'Sheen Rough';
    } else if (/[-_\s]Sheen/i.test(filename)) {
        return 'Sheen Color';
    } else if (/[-_\s]Trans\w+?[-_\s]Thick/i.test(filename)) {
        return 'Trans Thick';
    } else if (/[-_\s]Trans/i.test(filename)) {
        return 'Trans Int';
    } else if (/[-_\s]Specular[-_\s]Int/i.test(filename)) {
        return 'Specular Int';
    } else if (/[-_\s]Specular/i.test(filename)) {
        return 'Specular Color';
    } else if (/[-_\s]Thick/i.test(filename)) {
        return 'Subsurface';
    } else if (/[-_\s]Env/i.test(filename)) {
        return 'Env';
    } else if (/[-_\s]Albedo|Base|Color|Diffuse/i.test(filename)) {
        return 'Map';
    }
}

export function isCubeTextures(data) {
    return data.find(data => /^PosX|PX|[-_\s]PosX|PX|Cube/i.test(data.filename));
}

export function sortCubeTextures(data) {
    data.forEach(data => {
        if (/^PosX|PX|[-_\s]PosX|PX/i.test(data.filename)) {
            data.key = 'px';
            return;
        } else if (/^NegX|NX|[-_\s]NegX|NX/i.test(data.filename)) {
            data.key = 'nx';
            return;
        } else if (/^PosY|PY|[-_\s]PosY|PY/i.test(data.filename)) {
            data.key = 'py';
            return;
        } else if (/^NegY|NY|[-_\s]NegY|NY/i.test(data.filename)) {
            data.key = 'ny';
            return;
        } else if (/^PosZ|PZ|[-_\s]PosZ|PZ/i.test(data.filename)) {
            data.key = 'pz';
            return;
        } else if (/^NegZ|NZ|[-_\s]NegZ|NZ/i.test(data.filename)) {
            data.key = 'nz';
            return;
        }
    });

    const order = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

    return data.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}
