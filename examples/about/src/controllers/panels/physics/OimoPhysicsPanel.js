import { Panel, PanelItem } from '@alienkitty/space.js/three';

export class OimoPhysicsPanel extends Panel {
    constructor(mesh, ui) {
        super();

        this.mesh = mesh;
        this.ui = ui;

        this.initPanel();
    }

    initPanel() {
        const ui = this.ui;

        const { physics } = ui.constructor;

        let object = this.mesh;

        if (object.parent && object.parent.isGroup) {
            object = object.parent;
        }

        const angularVelocity = physics.getAngularVelocity(object);

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Gravity',
                min: -1,
                max: 1,
                step: 0.01,
                value: physics.getGravityScale(object),
                callback: value => {
                    physics.setGravityScale(object, value);
                }
            },
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 16,
                step: 1,
                value: angularVelocity.x,
                callback: value => {
                    angularVelocity.setX(value);
                    physics.setAngularVelocity(object, angularVelocity);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Y',
                min: 0,
                max: 16,
                step: 1,
                value: angularVelocity.y,
                callback: value => {
                    angularVelocity.setY(value);
                    physics.setAngularVelocity(object, angularVelocity);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Z',
                min: 0,
                max: 16,
                step: 1,
                value: angularVelocity.z,
                callback: value => {
                    angularVelocity.setZ(value);
                    physics.setAngularVelocity(object, angularVelocity);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
