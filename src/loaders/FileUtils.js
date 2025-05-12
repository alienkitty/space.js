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

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (/\.(jpe?g|png|webp|gif|svg)/i.test(file.name)) {
            array.push(loadFile(file));

            const match = file.name.match(/[-_]([^-_]*)\./);

            if (match) {
                names.push(match.pop());
            } else {
                names.push((i + 1).toString());
            }
        }
    }

    return [
        await Promise.all(array),
        names
    ];
}
