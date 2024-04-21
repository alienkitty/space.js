import { Panel, PanelItem } from '@alienkitty/space.js/three';

export class EnvPanel extends Panel {
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
            }
            // TODO: Texture thumbnails
        ];

        if (scene.environment) {
            items.push(
                {
                    type: 'slider',
                    name: 'Int',
                    min: 0,
                    max: 10,
                    step: 0.1,
                    value: scene.environmentIntensity,
                    callback: value => {
                        scene.environmentIntensity = value;
                    }
                }
            );
        }

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
