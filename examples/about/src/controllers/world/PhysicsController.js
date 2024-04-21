import { params } from '../../config/Config.js';

export class PhysicsController {
    static init(physics) {
        this.physics = physics;

        this.enabled = false;
        this.animatedOneFramePast = false;
    }

    // Public methods

    static update = () => {
        if (!this.enabled) {
            return;
        }

        if (params.animate || !this.animatedOneFramePast) {
            this.physics.step();

            this.animatedOneFramePast = !params.animate;
        }
    };
}
