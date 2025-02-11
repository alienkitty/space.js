/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

import {
    cubicDerivative,
    cubicPoint,
    getCubicArcLength,
    getQuadraticArcLength,
    quadraticDerivative,
    quadraticPoint,
    t2length
} from './BezierFunctions.js';

export class Bezier {
    constructor(ax, ay, bx, by, cx, cy, dx, dy) {
        this.a = { x: ax, y: ay };
        this.b = { x: bx, y: by };
        this.c = { x: cx, y: cy };

        if (dx !== undefined && dy !== undefined) {
            this.getArcLength = getCubicArcLength;
            this.getPoint = cubicPoint;
            this.getDerivative = cubicDerivative;
            this.d = { x: dx, y: dy };
        } else {
            this.getArcLength = getQuadraticArcLength;
            this.getPoint = quadraticPoint;
            this.getDerivative = quadraticDerivative;
            this.d = { x: 0, y: 0 };
        }

        this.length = this.getArcLength(
            [this.a.x, this.b.x, this.c.x, this.d.x],
            [this.a.y, this.b.y, this.c.y, this.d.y],
            1
        );
    }

    getTotalLength() {
        return this.length;
    }

    getPointAtLength(length) {
        const xs = [this.a.x, this.b.x, this.c.x, this.d.x];
        const xy = [this.a.y, this.b.y, this.c.y, this.d.y];
        const t = t2length(length, this.length, i => this.getArcLength(xs, xy, i));

        return this.getPoint(xs, xy, t);
    }

    getTangentAtLength(length) {
        const xs = [this.a.x, this.b.x, this.c.x, this.d.x];
        const xy = [this.a.y, this.b.y, this.c.y, this.d.y];
        const t = t2length(length, this.length, i => this.getArcLength(xs, xy, i));

        const derivative = this.getDerivative(xs, xy, t);
        const mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
        let tangent;

        if (mdl > 0) {
            tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
        } else {
            tangent = { x: 0, y: 0 };
        }

        return tangent;
    }

    getPropertiesAtLength(length) {
        const xs = [this.a.x, this.b.x, this.c.x, this.d.x];
        const xy = [this.a.y, this.b.y, this.c.y, this.d.y];
        const t = t2length(length, this.length, i => this.getArcLength(xs, xy, i));

        const derivative = this.getDerivative(xs, xy, t);
        const mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
        let tangent;

        if (mdl > 0) {
            tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
        } else {
            tangent = { x: 0, y: 0 };
        }

        const point = this.getPoint(xs, xy, t);

        return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
    }

    getC() {
        return this.c;
    }

    getD() {
        return this.d;
    }
}
