/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

// Legendre-Gauss abscissae with n=2 (xi values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
export const tValues = [
    -0.5773502691896257645091487805019574556476,
    0.5773502691896257645091487805019574556476
];

// Legendre-Gauss weights with n=2 (wi values, defined by a function linked to in the Bezier primer article)
export const cValues = [
    1.0,
    1.0
];

// LUT for binomial coefficient arrays per curve order n
export const binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
