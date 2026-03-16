/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/rveciana/svg-path-properties
 */

export class LinearPosition {
    constructor(x0, x1, y0, y1) {
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
    }

    getTotalLength() {
        return Math.sqrt(Math.pow(this.x1 - this.x0, 2) + Math.pow(this.y1 - this.y0, 2));
    }

    getPointAtLength(pos) {
        let fraction = pos / this.getTotalLength();
        fraction = Number.isNaN(fraction) ? 1 : fraction;

        const newDeltaX = (this.x1 - this.x0) * fraction;
        const newDeltaY = (this.y1 - this.y0) * fraction;

        return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
    }

    getTangentAtLength() {
        const x = this.x1 - this.x0;
        const y = this.y1 - this.y0;
        const length = Math.sqrt(x * x + y * y);

        return { x: x / length, y: y / length };
    }

    getPropertiesAtLength(pos) {
        const point = this.getPointAtLength(pos);
        const tangent = this.getTangentAtLength(pos);

        return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
    }
}
