/**
 * @author pschroen / https://ufo.ai/
 */

export function loadFile(file) {
    const reader = new FileReader();

    const promise = new Promise(resolve => {
        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                resolve(image);

                image.onload = null;
            };

            image.src = reader.result;

            reader.onload = null;
        };
    });

    reader.readAsDataURL(file);

    return promise;
}

export async function loadFiles(files) {
    const array = [];
    const names = [];
    const filenames = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (/\.(jpe?g|png|webp|gif|svg)/i.test(file.name)) {
            array.push(loadFile(file));

            const match = file.name.match(/[-_]([^-_]*)\./);

            let name;

            if (match) {
                name = match.pop();
            } else {
                name = (i + 1).toString();
            }

            let count = 1;

            while (names.includes(name)) {
                name = `${name}${++count}`;
            }

            names.push(name);
            filenames.push(file.name);
        }
    }

    return [
        await Promise.all(array),
        names,
        filenames
    ];
}
