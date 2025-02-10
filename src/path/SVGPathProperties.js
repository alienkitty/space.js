/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

import parse from './functions/Parse.js';
import { LinearPosition } from './functions/Linear.js';
import { Arc } from './functions/Arc.js';
import { Bezier } from './functions/Bezier.js';

export class SVGPathProperties {
    constructor(source) {
        this.length = 0;
        this.partialLengths = [];
        this.functions = [];
        this.initialPoint = null;

        const parsed = Array.isArray(source) ? source : parse(source);
        let cur = [0, 0];
        let prev = [0, 0];
        let curve;
        let start = [0, 0];

        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i][0] === 'M') {
                // moveTo
                cur = [parsed[i][1], parsed[i][2]];
                start = [cur[0], cur[1]];
                this.functions.push(null);

                if (i === 0) {
                    this.initialPoint = { x: parsed[i][1], y: parsed[i][2] };
                }
            } else if (parsed[i][0] === 'm') {
                cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
                start = [cur[0], cur[1]];
                this.functions.push(null);
            } else if (parsed[i][0] === 'L') {
                // lineTo
                this.length += Math.sqrt(
                    Math.pow(cur[0] - parsed[i][1], 2) +
                        Math.pow(cur[1] - parsed[i][2], 2)
                );
                this.functions.push(
                    new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2])
                );
                cur = [parsed[i][1], parsed[i][2]];
            } else if (parsed[i][0] === 'l') {
                this.length += Math.sqrt(
                    Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2)
                );
                this.functions.push(
                    new LinearPosition(
                        cur[0],
                        parsed[i][1] + cur[0],
                        cur[1],
                        parsed[i][2] + cur[1]
                    )
                );
                cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
            } else if (parsed[i][0] === 'H') {
                this.length += Math.abs(cur[0] - parsed[i][1]);
                this.functions.push(
                    new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1])
                );
                cur[0] = parsed[i][1];
            } else if (parsed[i][0] === 'h') {
                this.length += Math.abs(parsed[i][1]);
                this.functions.push(
                    new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1])
                );
                cur[0] = parsed[i][1] + cur[0];
            } else if (parsed[i][0] === 'V') {
                this.length += Math.abs(cur[1] - parsed[i][1]);
                this.functions.push(
                    new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1])
                );
                cur[1] = parsed[i][1];
            } else if (parsed[i][0] === 'v') {
                this.length += Math.abs(parsed[i][1]);
                this.functions.push(
                    new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1])
                );
                cur[1] = parsed[i][1] + cur[1];
            } else if (parsed[i][0] === 'z' || parsed[i][0] === 'Z') {
                // Close path
                this.length += Math.sqrt(
                    Math.pow(start[0] - cur[0], 2) +
                        Math.pow(start[1] - cur[1], 2)
                );
                this.functions.push(
                    new LinearPosition(cur[0], start[0], cur[1], start[1])
                );
                cur = [start[0], start[1]];
            } else if (parsed[i][0] === 'C') {
                // Cubic Bezier curves
                curve = new Bezier(
                    cur[0],
                    cur[1],
                    parsed[i][1],
                    parsed[i][2],
                    parsed[i][3],
                    parsed[i][4],
                    parsed[i][5],
                    parsed[i][6]
                );

                this.length += curve.getTotalLength();
                cur = [parsed[i][5], parsed[i][6]];
                this.functions.push(curve);
            } else if (parsed[i][0] === 'c') {
                curve = new Bezier(
                    cur[0],
                    cur[1],
                    cur[0] + parsed[i][1],
                    cur[1] + parsed[i][2],
                    cur[0] + parsed[i][3],
                    cur[1] + parsed[i][4],
                    cur[0] + parsed[i][5],
                    cur[1] + parsed[i][6]
                );

                if (curve.getTotalLength() > 0) {
                    this.length += curve.getTotalLength();
                    this.functions.push(curve);
                    cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
                } else {
                    this.functions.push(
                        new LinearPosition(cur[0], cur[0], cur[1], cur[1])
                    );
                }
            } else if (parsed[i][0] === 'S') {
                if (i > 0 && ['C', 'c', 'S', 's'].indexOf(parsed[i - 1][0]) > -1) {
                    if (curve) {
                        const c = curve.getC();
                        curve = new Bezier(
                            cur[0],
                            cur[1],
                            2 * cur[0] - c.x,
                            2 * cur[1] - c.y,
                            parsed[i][1],
                            parsed[i][2],
                            parsed[i][3],
                            parsed[i][4]
                        );
                    }
                } else {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        cur[0],
                        cur[1],
                        parsed[i][1],
                        parsed[i][2],
                        parsed[i][3],
                        parsed[i][4]
                    );
                }

                if (curve) {
                    this.length += curve.getTotalLength();
                    cur = [parsed[i][3], parsed[i][4]];
                    this.functions.push(curve);
                }
            } else if (parsed[i][0] === 's') {
                // 240 225
                if (i > 0 && ['C', 'c', 'S', 's'].indexOf(parsed[i - 1][0]) > -1) {
                    if (curve) {
                        const c = curve.getC();
                        const d = curve.getD();
                        curve = new Bezier(
                            cur[0],
                            cur[1],
                            cur[0] + d.x - c.x,
                            cur[1] + d.y - c.y,
                            cur[0] + parsed[i][1],
                            cur[1] + parsed[i][2],
                            cur[0] + parsed[i][3],
                            cur[1] + parsed[i][4]
                        );
                    }
                } else {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        cur[0],
                        cur[1],
                        cur[0] + parsed[i][1],
                        cur[1] + parsed[i][2],
                        cur[0] + parsed[i][3],
                        cur[1] + parsed[i][4]
                    );
                }

                if (curve) {
                    this.length += curve.getTotalLength();
                    cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
                    this.functions.push(curve);
                }
            } else if (parsed[i][0] === 'Q') {
                // Quadratic Bezier curves
                if (cur[0] === parsed[i][1] && cur[1] === parsed[i][2]) {
                    const linearCurve = new LinearPosition(
                        parsed[i][1],
                        parsed[i][3],
                        parsed[i][2],
                        parsed[i][4]
                    );
                    this.length += linearCurve.getTotalLength();
                    this.functions.push(linearCurve);
                } else {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        parsed[i][1],
                        parsed[i][2],
                        parsed[i][3],
                        parsed[i][4],
                        undefined,
                        undefined
                    );
                    this.length += curve.getTotalLength();
                    this.functions.push(curve);
                }

                cur = [parsed[i][3], parsed[i][4]];
                prev = [parsed[i][1], parsed[i][2]];
            } else if (parsed[i][0] === 'q') {
                if (!(parsed[i][1] === 0 && parsed[i][2] === 0)) {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        cur[0] + parsed[i][1],
                        cur[1] + parsed[i][2],
                        cur[0] + parsed[i][3],
                        cur[1] + parsed[i][4],
                        undefined,
                        undefined
                    );
                    this.length += curve.getTotalLength();
                    this.functions.push(curve);
                } else {
                    const linearCurve = new LinearPosition(
                        cur[0] + parsed[i][1],
                        cur[0] + parsed[i][3],
                        cur[1] + parsed[i][2],
                        cur[1] + parsed[i][4]
                    );
                    this.length += linearCurve.getTotalLength();
                    this.functions.push(linearCurve);
                }

                prev = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
                cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
            } else if (parsed[i][0] === 'T') {
                if (i > 0 && ['Q', 'q', 'T', 't'].indexOf(parsed[i - 1][0]) > -1) {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        2 * cur[0] - prev[0],
                        2 * cur[1] - prev[1],
                        parsed[i][1],
                        parsed[i][2],
                        undefined,
                        undefined
                    );
                    this.functions.push(curve);
                    this.length += curve.getTotalLength();
                } else {
                    const linearCurve = new LinearPosition(
                        cur[0],
                        parsed[i][1],
                        cur[1],
                        parsed[i][2]
                    );
                    this.functions.push(linearCurve);
                    this.length += linearCurve.getTotalLength();
                }

                prev = [2 * cur[0] - prev[0], 2 * cur[1] - prev[1]];
                cur = [parsed[i][1], parsed[i][2]];
            } else if (parsed[i][0] === 't') {
                if (i > 0 && ['Q', 'q', 'T', 't'].indexOf(parsed[i - 1][0]) > -1) {
                    curve = new Bezier(
                        cur[0],
                        cur[1],
                        2 * cur[0] - prev[0],
                        2 * cur[1] - prev[1],
                        cur[0] + parsed[i][1],
                        cur[1] + parsed[i][2],
                        undefined,
                        undefined
                    );
                    this.length += curve.getTotalLength();
                    this.functions.push(curve);
                } else {
                    const linearCurve = new LinearPosition(
                        cur[0],
                        cur[0] + parsed[i][1],
                        cur[1],
                        cur[1] + parsed[i][2]
                    );
                    this.length += linearCurve.getTotalLength();
                    this.functions.push(linearCurve);
                }

                prev = [2 * cur[0] - prev[0], 2 * cur[1] - prev[1]];
                cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
            } else if (parsed[i][0] === 'A') {
                const arcCurve = new Arc(
                    cur[0],
                    cur[1],
                    parsed[i][1],
                    parsed[i][2],
                    parsed[i][3],
                    parsed[i][4] === 1,
                    parsed[i][5] === 1,
                    parsed[i][6],
                    parsed[i][7]
                );

                this.length += arcCurve.getTotalLength();
                cur = [parsed[i][6], parsed[i][7]];
                this.functions.push(arcCurve);
            } else if (parsed[i][0] === 'a') {
                const arcCurve = new Arc(
                    cur[0],
                    cur[1],
                    parsed[i][1],
                    parsed[i][2],
                    parsed[i][3],
                    parsed[i][4] === 1,
                    parsed[i][5] === 1,
                    cur[0] + parsed[i][6],
                    cur[1] + parsed[i][7]
                );

                this.length += arcCurve.getTotalLength();
                cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
                this.functions.push(arcCurve);
            }

            this.partialLengths.push(this.length);
        }
    }

    getPartAtLength(fractionLength) {
        if (fractionLength < 0) {
            fractionLength = 0;
        } else if (fractionLength > this.length) {
            fractionLength = this.length;
        }

        let i = this.partialLengths.length - 1;

        while (this.partialLengths[i] >= fractionLength && i > 0) {
            i--;
        }

        i++;

        return { fraction: fractionLength - this.partialLengths[i - 1], i };
    }

    getTotalLength() {
        return this.length;
    }

    getPointAtLength(fractionLength) {
        const fractionPart = this.getPartAtLength(fractionLength);
        const functionAtPart = this.functions[fractionPart.i];

        if (functionAtPart) {
            return functionAtPart.getPointAtLength(fractionPart.fraction);
        } else if (this.initialPoint) {
            return this.initialPoint;
        }

        throw new Error('Wrong function at this part');
    }

    getTangentAtLength(fractionLength) {
        const fractionPart = this.getPartAtLength(fractionLength);
        const functionAtPart = this.functions[fractionPart.i];

        if (functionAtPart) {
            return functionAtPart.getTangentAtLength(fractionPart.fraction);
        } else if (this.initialPoint) {
            return { x: 0, y: 0 };
        }

        throw new Error('Wrong function at this part');
    }

    getPropertiesAtLength(fractionLength) {
        const fractionPart = this.getPartAtLength(fractionLength);
        const functionAtPart = this.functions[fractionPart.i];

        if (functionAtPart) {
            return functionAtPart.getPropertiesAtLength(fractionPart.fraction);
        } else if (this.initialPoint) {
            return {
                x: this.initialPoint.x,
                y: this.initialPoint.y,
                tangentX: 0,
                tangentY: 0
            };
        }

        throw new Error('Wrong function at this part');
    }

    getParts() {
        const parts = [];

        for (var i = 0; i < this.functions.length; i++) {
            if (this.functions[i] !== null) {
                const properties = {
                    start: this.functions[i].getPointAtLength(0),
                    end: this.functions[i].getPointAtLength(
                        this.partialLengths[i] - this.partialLengths[i - 1]
                    ),
                    length: this.partialLengths[i] - this.partialLengths[i - 1],
                    getPointAtLength: this.functions[i].getPointAtLength,
                    getTangentAtLength: this.functions[i].getTangentAtLength,
                    getPropertiesAtLength: this.functions[i].getPropertiesAtLength
                };
                parts.push(properties);
            }
        }

        return parts;
    }
}
