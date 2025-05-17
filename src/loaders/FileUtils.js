/**
 * @author pschroen / https://ufo.ai/
 */

export function loadFile(file) {
    const reader = new FileReader();

    const promise = new Promise(resolve => {
        reader.onload = () => {
            if (/\.jpe?g|png|webp|gif|svg/i.test(file.name)) {
                const image = new Image();

                image.onload = () => {
                    resolve(image);

                    image.onload = null;
                };

                image.src = reader.result;
            } else {
                resolve(reader.result);
            }

            reader.onload = null;
        };
    });

    reader.readAsDataURL(file);

    return promise;
}

export async function loadFiles(files) {
    const array = [];
    const filenames = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        array.push(loadFile(file));
        filenames.push(file.name);
    }

    return (await Promise.all(array)).map((image, i) => ({ image, filename: filenames[i] }));
}
