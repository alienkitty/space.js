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
        return Math.sqrt(
            Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2)
        );
    }

    getPointAtLength(pos) {
        let fraction =
            pos /
            Math.sqrt(
                Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2)
            );
        fraction = Number.isNaN(fraction) ? 1 : fraction;

        const newDeltaX = (this.x1 - this.x0) * fraction;
        const newDeltaY = (this.y1 - this.y0) * fraction;

        return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
    }

    getTangentAtLength() {
        const module = Math.sqrt(
            (this.x1 - this.x0) * (this.x1 - this.x0) +
                (this.y1 - this.y0) * (this.y1 - this.y0)
        );

        return {
            x: (this.x1 - this.x0) / module,
            y: (this.y1 - this.y0) / module
        };
    }

    getPropertiesAtLength(pos) {
        const point = this.getPointAtLength(pos);
        const tangent = this.getTangentAtLength(pos);

        return { x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y };
    }
}
