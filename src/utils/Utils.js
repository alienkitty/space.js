/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/dev/src/math/MathUtils.js
 * Based on https://github.com/lo-th/uil
 */

export const PI = Math.PI;
export const TwoPI = Math.PI * 2;
export const PI90 = Math.PI / 2;
export const PI60 = Math.PI / 3;
export const Third = Math.PI * 2 / 3;

export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

export function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}

export function ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

export function floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function euclideanModulo(n, m) {
    return ((n % m) + m) % m;
}

export function mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}

export function inverseLerp(x, y, value) {
    if (x !== y) {
        return (value - x) / (y - x);
    } else {
        return 0;
    }
}

export function lerp(x, y, t) {
    return (1 - t) * x + t * y;
}

export function step(edge, value) {
    return value < edge ? 0 : 1;
}

export function smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
}

export function smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
}

export function parabola(x, k) {
    return Math.pow(4 * x * (1 - x), k);
}

export function pcurve(x, a, b) {
    const k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b));

    return k * Math.pow(x, a) * Math.pow(1 - x, b);
}

export function fract(value) {
    return value - Math.floor(value);
}

export function average(numbers) {
    const sum = numbers.reduce((a, b) => a + b, 0);

    return sum / numbers.length;
}

export function rms(numbers) {
    const sum = numbers.map(v => v * v).reduce((a, b) => a + b, 0);

    return Math.sqrt(sum / numbers.length);
}

export function median(numbers) {
    const sorted = numbers.toSorted();
    const length = sorted.length;
    const middle = Math.floor(length / 2);

    if (length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

export function peaks(numbers, windowSize, threshold) {
    const length = numbers.length;
    const peaks = [];

    for (let i = 0; i < length; i++) {
        const start = Math.max(1, i - windowSize);
        const end = Math.min(length, i + windowSize);
        let sum = 0;

        for (let j = start; j < end; j++) {
            sum += Math.abs(numbers[j] - numbers[j - 1]);
        }

        if (sum > threshold) {
            peaks.push(i);
        }
    }

    return peaks;
}

export function consecutive(numbers) {
    return numbers.reduce((array, value) => {
        let group = array[array.length - 1];

        if (!group || group[group.length - 1] !== value - 1) {
            group = array[array.push([]) - 1];
        }

        group.push(value);

        return array;
    }, []);
}

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

export function randFloat(low, high) {
    return low + Math.random() * (high - low);
}

export function randFloatSpread(range) {
    return range * (0.5 - Math.random());
}

export function headsTails(heads, tails) {
    if (heads === undefined) {
        return randInt(0, 1);
    }

    return randInt(0, 1) ? tails : heads;
}

export function brightness(color) {
    return color.r * 0.3 + color.g * 0.59 + color.b * 0.11;
}

export function basename(path, ext) {
    const name = path.split('/').pop().split('?')[0];

    return !ext ? name.split('.')[0] : name;
}

export function extension(path) {
    return path.split('.').pop().split('?')[0].toLowerCase();
}

export function absolute(path) {
    if (path.includes('//')) {
        return path;
    }

    const port = Number(location.port) > 1000 ? `:${location.port}` : '';
    const pathname = path.startsWith('/') ? path : `${location.pathname.replace(/\/[^/]*$/, '/')}${path}`;

    return `${location.protocol}//${location.hostname}${port}${pathname}`;
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function getConstructor(object) {
    const isInstance = typeof object !== 'function';
    const code = isInstance ? object.constructor.toString() : object.toString();
    const name = code.match(/(?:class|function)\s([^\s{(]+)/).pop();

    return { name, code, isInstance };
}
