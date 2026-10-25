/**
 * A 3D noise class based on the three.js `ImprovedNoise` class.
 *
 * @see {@link https://cs.nyu.edu/~perlin/noise/ | Ken Perlin's Improved Noise}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/math/ImprovedNoise.js | three.js `ImprovedNoise` Source}
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/math/ImprovedNoise.js | Source}
 */
export class ImprovedNoise {
    noise(x: number, y: number, z: number): number;
}
