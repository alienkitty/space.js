import { MathUtils } from 'three';
import { Panel, PanelItem, TwoPI } from '@alienkitty/space.js/three';

export class SpacePanel extends Panel {
    constructor(scene) {
        super();

        this.scene = scene;

        this.initPanel();
    }

    initPanel() {
        const scene = this.scene;

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Int',
                min: 0,
                max: 10,
                step: 0.1,
                value: scene.backgroundIntensity,
                callback: value => {
                    scene.backgroundIntensity = value;
                }
            },
            {
                type: 'slider',
                name: 'Rotate X',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.backgroundRotation.x + (scene.backgroundRotation.x < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.backgroundRotation.x = MathUtils.degToRad(value);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Y',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.backgroundRotation.y + (scene.backgroundRotation.y < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.backgroundRotation.y = MathUtils.degToRad(value);
                }
            },
            {
                type: 'slider',
                name: 'Rotate Z',
                min: 0,
                max: 360,
                step: 1,
                value: MathUtils.radToDeg(scene.backgroundRotation.z + (scene.backgroundRotation.z < 0 ? TwoPI : 0)),
                callback: value => {
                    scene.backgroundRotation.z = MathUtils.degToRad(value);
                }
            },
            {
                type: 'spacer'
            },
            {
                type: 'link',
                value: 'Reset',
                callback: () => {
                    this.setPanelValue('Int', 1.2);
                    this.setPanelValue('Rotate X', 180);
                    this.setPanelValue('Rotate Y', 0);
                    this.setPanelValue('Rotate Z', 180);
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
