/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

const length = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
};
const segmentRegExp = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
const numberRegExp = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

export default function parse(path) {
    const segments = (path && path.length > 0 ? path : 'M0,0').match(segmentRegExp);

    if (!segments) {
        throw new Error(`No path elements found in string ${path}`);
    }

    return segments.reduce((segmentsArray, segmentString) => {
        let command = segmentString.charAt(0);
        let type = command.toLowerCase();
        let args = parseValues(segmentString.substring(1));

        // Overloaded moveTo
        if (type === 'm' && args.length > 2) {
            segmentsArray.push([command, ...args.splice(0, 2)]);
            type = 'l';
            command = command === 'm' ? 'l' : 'L';
        }

        // Overloaded arcTo
        if (type.toLowerCase() === 'a' && (args.length === 5 || args.length === 6)) {
            const aArgs = segmentString.substring(1).trim().split(' ');
            args = [
                Number(aArgs[0]),
                Number(aArgs[1]),
                Number(aArgs[2]),
                Number(aArgs[3].charAt(0)),
                Number(aArgs[3].charAt(1)),
                Number(aArgs[3].substring(2)),
                Number(aArgs[4])
            ];
        }

        while (args.length >= 0) {
            if (args.length === length[type]) {
                segmentsArray.push([command, ...args.splice(0, length[type])]);
                break;
            }
            if (args.length < length[type]) {
                throw new Error(
                    `Malformed path data: "${command}" must have ${length[type]} elements and has ${args.length}: ${segmentString}`
                );
            }
            segmentsArray.push([command, ...args.splice(0, length[type])]);
        }

        return segmentsArray;
    }, []);
}

function parseValues(args) {
    const numbers = args.match(numberRegExp);

    return numbers ? numbers.map(Number) : [];
}
