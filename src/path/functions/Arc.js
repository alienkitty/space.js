/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

import { TwoPI, clamp, degToRad, euclideanModulo } from '../../utils/Utils.js';

export class Arc {
    constructor(x0, y0, rx, ry, xAxisRotate, largeArcFlag, sweepFlag, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.rx = rx;
        this.ry = ry;
        this.xAxisRotate = xAxisRotate;
        this.largeArcFlag = largeArcFlag;
        this.sweepFlag = sweepFlag;
        this.x1 = x1;
        this.y1 = y1;

        const lengthProperties = approximateArcLengthOfCurve(300, t => {
            return pointOnEllipticalArc(
                { x: x0, y: y0 },
                rx,
                ry,
                xAxisRotate,
                largeArcFlag,
                sweepFlag,
                { x: x1, y: y1 },
                t
            );
        });

        this.length = lengthProperties.arcLength;
    }

    getTotalLength() {
        return this.length;
    }

    getPointAtLength(fractionLength) {
        if (fractionLength < 0) {
            fractionLength = 0;
        } else if (fractionLength > this.length) {
            fractionLength = this.length;
        }

        const position = pointOnEllipticalArc(
            { x: this.x0, y: this.y0 },
            this.rx,
            this.ry,
            this.xAxisRotate,
            this.largeArcFlag,
            this.sweepFlag,
            { x: this.x1, y: this.y1 },
            fractionLength / this.length
        );

        return { x: position.x, y: position.y };
    }

    getTangentAtLength(fractionLength) {
        if (fractionLength < 0) {
            fractionLength = 0;
        } else if (fractionLength > this.length) {
            fractionLength = this.length;
        }

        const point_dist = 0.05; // Needs testing
        const p1 = this.getPointAtLength(fractionLength);
        let p2;

        if (fractionLength < 0) {
            fractionLength = 0;
        } else if (fractionLength > this.length) {
            fractionLength = this.length;
        }

        if (fractionLength < this.length - point_dist) {
            p2 = this.getPointAtLength(fractionLength + point_dist);
        } else {
            p2 = this.getPointAtLength(fractionLength - point_dist);
        }

        const xDist = p2.x - p1.x;
        const yDist = p2.y - p1.y;
        const dist = Math.sqrt(xDist * xDist + yDist * yDist);

        if (fractionLength < this.length - point_dist) {
            return { x: -xDist / dist, y: -yDist / dist };
        } else {
            return { x: xDist / dist, y: yDist / dist };
        }
    }

    getPropertiesAtLength(fractionLength) {
        const tangent = this.getTangentAtLength(fractionLength);
        const point = this.getPointAtLength(fractionLength);

        return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
    }
}

function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {
    // In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    xAxisRotation = euclideanModulo(xAxisRotation, 360);
    const xAxisRotationRadians = degToRad(xAxisRotation);

    // If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
    if (p0.x === p1.x && p0.y === p1.y) {
        return { x: p0.x, y: p0.y, ellipticalArcAngle: 0 }; // Check if angle is correct
    }

    // If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.
    if (rx === 0 || ry === 0) {
        return { x: 0, y: 0, ellipticalArcAngle: 0 }; // Check if angle is correct
    }

    // Following "Conversion from endpoint to center parameterization"
    // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

    // Step #1: Compute transformedPoint
    const dx = (p0.x - p1.x) / 2;
    const dy = (p0.y - p1.y) / 2;
    const transformedPoint = {
        x: Math.cos(xAxisRotationRadians) * dx + Math.sin(xAxisRotationRadians) * dy,
        y: -Math.sin(xAxisRotationRadians) * dx + Math.cos(xAxisRotationRadians) * dy
    };
    // Ensure radii are large enough
    const radiiCheck =
        Math.pow(transformedPoint.x, 2) / Math.pow(rx, 2) +
        Math.pow(transformedPoint.y, 2) / Math.pow(ry, 2);
    if (radiiCheck > 1) {
        rx = Math.sqrt(radiiCheck) * rx;
        ry = Math.sqrt(radiiCheck) * ry;
    }

    // Step #2: Compute transformedCenter
    const cSquareNumerator =
        Math.pow(rx, 2) * Math.pow(ry, 2) -
        Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) -
        Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2);
    const cSquareRootDenom =
        Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) +
        Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2);
    let cRadicand = cSquareNumerator / cSquareRootDenom;
    // Make sure this never drops below zero because of precision
    cRadicand = cRadicand < 0 ? 0 : cRadicand;
    const cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
    const transformedCenter = {
        x: cCoef * ((rx * transformedPoint.y) / ry),
        y: cCoef * (-(ry * transformedPoint.x) / rx)
    };

    // Step #3: Compute center
    const center = {
        x:
            Math.cos(xAxisRotationRadians) * transformedCenter.x -
            Math.sin(xAxisRotationRadians) * transformedCenter.y +
            (p0.x + p1.x) / 2,
        y:
            Math.sin(xAxisRotationRadians) * transformedCenter.x +
            Math.cos(xAxisRotationRadians) * transformedCenter.y +
            (p0.y + p1.y) / 2
    };

    // Step #4: Compute start/sweep angles
    // Start angle of the elliptical arc prior to the stretch and rotate operations.
    // Difference between the start and end angles
    const startVector = {
        x: (transformedPoint.x - transformedCenter.x) / rx,
        y: (transformedPoint.y - transformedCenter.y) / ry
    };
    const startAngle = angleBetweenPoints(
        {
            x: 1,
            y: 0
        },
        startVector
    );

    const endVector = {
        x: (-transformedPoint.x - transformedCenter.x) / rx,
        y: (-transformedPoint.y - transformedCenter.y) / ry
    };
    let sweepAngle = angleBetweenPoints(startVector, endVector);

    if (!sweepFlag && sweepAngle > 0) {
        sweepAngle -= TwoPI;
    } else if (sweepFlag && sweepAngle < 0) {
        sweepAngle += TwoPI;
    }
    // We use % instead of `euclideanModulo()` because we want it to be -360deg to 360deg (but in radians)
    sweepAngle %= TwoPI;

    // From http://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
    const angle = startAngle + sweepAngle * t;
    const ellipseComponentX = rx * Math.cos(angle);
    const ellipseComponentY = ry * Math.sin(angle);

    const point = {
        x:
            Math.cos(xAxisRotationRadians) * ellipseComponentX -
            Math.sin(xAxisRotationRadians) * ellipseComponentY +
            center.x,
        y:
            Math.sin(xAxisRotationRadians) * ellipseComponentX +
            Math.cos(xAxisRotationRadians) * ellipseComponentY +
            center.y,
        ellipticalArcStartAngle: startAngle,
        ellipticalArcEndAngle: startAngle + sweepAngle,
        ellipticalArcAngle: angle,
        ellipticalArcCenter: center,
        resultantRx: rx,
        resultantRy: ry
    };

    return point;
}

function approximateArcLengthOfCurve(resolution, pointOnCurveFunc) {
    // Resolution is the number of segments we use
    resolution = resolution ? resolution : 500;

    let resultantArcLength = 0;
    const arcLengthMap = [];
    const approximationLines = [];

    let prevPoint = pointOnCurveFunc(0);
    let nextPoint;

    for (let i = 0; i < resolution; i++) {
        const t = clamp(i * (1 / resolution), 0, 1);
        nextPoint = pointOnCurveFunc(t);
        resultantArcLength += distanceBetweenPoints(prevPoint, nextPoint);
        approximationLines.push([prevPoint, nextPoint]);

        arcLengthMap.push({
            t,
            arcLength: resultantArcLength
        });

        prevPoint = nextPoint;
    }

    // Last stretch to the endpoint
    nextPoint = pointOnCurveFunc(1);
    approximationLines.push([prevPoint, nextPoint]);
    resultantArcLength += distanceBetweenPoints(prevPoint, nextPoint);
    arcLengthMap.push({
        t: 1,
        arcLength: resultantArcLength
    });

    return {
        arcLength: resultantArcLength,
        arcLengthMap,
        approximationLines
    };
}

function distanceBetweenPoints(p0, p1) {
    return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
}

function angleBetweenPoints(v0, v1) {
    const p = v0.x * v1.x + v0.y * v1.y;
    const n = Math.sqrt(
        (Math.pow(v0.x, 2) + Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2) + Math.pow(v1.y, 2))
    );
    const sign = v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1;
    const angle = sign * Math.acos(p / n);

    return angle;
}
